import { Request, Response } from 'express'
import express from 'express'
import { sendReply, usePrisma } from '../lib'
import { verifyJwt, decodedToken } from '../services/auth'
import { Posts } from '.prisma/client'


const RouterPosts = express.Router()

RouterPosts.get('/', async (req: Request, res: Response) => {
    const { database } = usePrisma()
    database.posts.findMany({orderBy: {createdAt: 'asc'}})
    .then(posts => {
        if (posts && posts.length > 0) {
            sendReply(200, 'Success', posts, res)
            return
        } else { 
            sendReply(200, 'No records', null, res)
            return
        }
    }).catch(err => sendReply(500, err, null, res))
    .finally(await database.$disconnect())
})

RouterPosts.get('/count/:many', async (req: Request, res: Response) => {
    const { many } = req.params
    const { id } = decodedToken(req)
    if (many && id > 0) {
        const { database } = usePrisma()
        database.posts.findMany({where: {userId: id}, take: parseInt(many), orderBy: {createdAt: 'asc'}})
        .then(posts => {
            if (posts.length > 0) {
                sendReply(200, 'Success', posts, res)
            }
        }).catch(err => sendReply(500, err, null, res))
        .finally(await database.$disconnect())
    }
})

RouterPosts.get('/:slug', async (req: Request, res: Response) => {
    const { slug } = req.params
    if (slug) {
        const { database } = usePrisma()
        database.posts.findUnique({where:{slug: slug}})
        .then(post => {
            if (post) { 
                sendReply(200, 'Success', post, res)
                return 
            } else { 
                sendReply(200, 'No records', null, res)
            }
        })
        .catch(err => sendReply(500, err, null, res))
        .finally(await database.$disconnect())
    }
})

RouterPosts.post('/create', verifyJwt, async (req: Request, res: Response) => {   
    const { id: userId } = decodedToken(req) 
    const postRequest: Posts = req.body
    let newPost: Posts = {
        content: postRequest.content,
        description: postRequest.description,
        slug: postRequest.slug,
        title: postRequest.title,
        userId: userId,
    }
    const { database } = usePrisma()
    database.posts.create({data: newPost})
    .then(post => {
        sendReply(200, 'Post created', post, res)
        return
    })
    .catch(err => sendReply(500, err, null, res))
    .finally(await database.$disconnect())
})

export default RouterPosts