import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv' 
import { Router } from './routes'


const app = express()


dotenv.config()
app.use(cors())
app.use(express.json())

app.listen(process.env.SERVER_PORT || 3001, () => {
    console.log(`Server running at port: ${process.env.SERVER_PORT}`)
})

app.use('/api/auth', Router.Auth)
app.use('/api/users', Router.Users)
app.use('/api/posts', Router.Posts)




/*
async function createUser() {
    const { database } = usePrisma()
    const hashedPassword = await hashPassword('chocolate89')
    const user: Users = {
        id: 0,
        email: 'lucieneananias@yahoo.com.br',
        name: 'Luciene Ananias',
        password: hashedPassword,
        role: 'NUTRI'
    }
    console.log(user)
    await database.users.create({
        data: {
            email: user.email,
            password: user.password,
            name: user.name,
            role: user.role
        }
    }).then(data => console.log(data))
}

createUser()
*/