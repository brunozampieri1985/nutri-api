import { Response } from "express"


const sendReply = (status: number, message: string, data: any|null, res: Response) => {    
    res.status(status).json({
        status: status,
        message: message,
        data: data,
        
    })   
}

export default sendReply