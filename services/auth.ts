import Jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Users } from '.prisma/client'
import { usePrisma, sendReply, stringfyToJson } from '../lib'
import bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from 'express'

dotenv.config()

const Authorization: AuthType = {
    nutri: [   
        '/users/',     
        '/users/:id',
        '/users/edit/:id',
        '/posts/create',
        '/posts',
        '/posts/:slug'
    ],
    customer: []
}

type AuthType = {
    nutri: string[]|[],
    customer: string[]|[]
}

//Middleware JWT Verifier
export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['x-access-token']
    if (!token) {
        sendReply(401, 'No token provided', null, res)
        return
    }
    Jwt.verify(token as string, process.env.API_SECRET as string, (err, decoded) => {
        if (err) { 
            sendReply(401, 'Invalid token', null, res) 
            return
        }
        const results = stringfyToJson(decoded)
        const { role } = results
        const { baseUrl, route } = req
        var isAuth = false
        const requestedRoute = baseUrl + route.path  //Requested route example: '/users/:id'
        console.log(requestedRoute)  
        if (role === 'NUTRI') {
            Authorization.nutri.map(route => {                    
                if (route === requestedRoute) { isAuth = true; }
            })
        }
        if (role === 'ADMIN') { isAuth = true; }
        if (!isAuth) { 
            console.log(role)
            sendReply(401, 'Access Denied for this role', null, res)
            return 
        }
        next()
    })

    
}


//Sign in JWT and retireves token
export const getJwt = async (user: Users) => {
    const token = await Jwt.sign({
        id: user.id,
        role: user.role,
    }, process.env.API_SECRET as string, 
    { expiresIn: 60 * 60 })
    return token
}


//bcrypt helpers
export const hashPassword = async (password: string) => {
    const result = await bcrypt.hash(password, 10)
    return result
}
export const comparePasswords = async (password: string, hash: string) => {
    const result = await bcrypt.compare(password, hash)
    return result
}


//types
export type AuthSignInRequest = {
    email: string,
    password: string
}

export type AuthSignInResponse = {
    email: string,
    userId: number,
    role: string,
    token: string
}


//Sign In handler
export const signInRequest = async (guest: AuthSignInRequest, res: Response) => {
    const { database } = usePrisma()
    const user = await database.users.findUnique({
        where: {
            email: guest.email
        }
    })
    if (user?.password) {
        const auth = await comparePasswords(guest.password, user.password)
            if (auth) {
                const token = await getJwt(user)
                const response: AuthSignInResponse = {
                    userId: user.id,
                    email: user.email,
                    role: user.role,
                    token: token
                }   
                const data  = await stringfyToJson(response)
                sendReply(200, 'Authorized', data, res)
            }     
    } 
    sendReply(401, 'Authentication Failed',null, res) 
}

export const decodedToken = (req: Request) => {
    const token = req.headers['x-access-token']
    const decoded = Jwt.verify(token as string, process.env.API_SECRET as string)
    console.log(decoded)
    const results = stringfyToJson(decoded)
    const { id, role } = results
    return { id, role }
}
