import { Request, Response } from 'express'
import express from 'express'
import { sendReply } from '../lib'
import { AuthSignInRequest, signInRequest } from '../services/auth'



const RouterAuth = express.Router()



RouterAuth.get('/', async (req: Request, res: Response) => {    
        sendReply(500, 'This is not an API endpoint ', null, res)
})


RouterAuth.post('/login', async (req: Request, res: Response) => {
    const guest: AuthSignInRequest = req.body
    signInRequest(guest, res)   
})


export default RouterAuth