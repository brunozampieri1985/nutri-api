import { Request, Response } from 'express'
import express from 'express'
import { sendReply, removePassword, usePrisma } from '../lib'
import { verifyJwt, hashPassword } from '../services/auth'
import { Users } from '.prisma/client'



const RouterUsers = express.Router()

RouterUsers.get('/', verifyJwt, async (req: Request, res: Response) => {  
    const { database } = usePrisma()
    
    const users: Users[] = await database.users.findMany()
    if (users.length === 0) {
        sendReply(200, 'No records', [], res)
        return
    }
    sendReply(200, 'Success', removePassword(users), res)
})


RouterUsers.get('/:id', verifyJwt, async (req: Request, res: Response) => {
    const { id } = req.params
    const { database } = usePrisma()
    database.users.findUnique({
        where: { id: parseInt(id) }
    }).then(user => {
        if (!user) { sendReply(200, 'User not found!', null, res) }
        else { sendReply(200, 'Success', {
            email: user.email,
            name: user.name,
            role: user.role
        }, res)
        }
    }).catch(err => {
        sendReply(500, `Error retrieving user: ${err}`, null, res)
    })
})

RouterUsers.post('/create', verifyJwt, async (req: Request, res: Response) => {

    const { email, role, name, password }: Users = req.body
    const hashedPassword = await hashPassword(password)    
    const { database } = usePrisma()
    database.users.create({data: {
        email: email,
        name: name,
        password: hashedPassword,
        role: role
    }}).then((data: Users) => {
        let user = {
            email: data.email,
            role: data.role,
            name: data.name,
            id: data.id
        }
        sendReply(200, 'Success', user, res)
    }).catch(err => {
        sendReply(500, `Error creating user: ${err}`, null, res)
    })
})

RouterUsers.put('/edit/:id', verifyJwt, async (req: Request, res: Response) => {
    const { id } = req.params
    const { email, name, role }: Users = req.body
    const { database } = usePrisma()
    console.log('newroleshoulbe:', role)
    database.users.update({
        where: { id: parseInt(id) },
        data: { 
            email: email,
            name: name,
            role: role
        }
    }).then(data => {
        let user = {
            email: data.email,
            role: data.role,
            name: data.name,
            id: data.id
        }
        sendReply(200, 'Success', user, res)
        return
    })
    .catch(err => sendReply(500, `Error updating user: ${err}`, null, res))
})

export default RouterUsers