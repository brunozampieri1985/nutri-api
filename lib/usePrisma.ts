import { Prisma, PrismaClient } from '@prisma/client'


const usePrisma = () => {
    const database = new PrismaClient()
    return { database, Prisma }
}

export default usePrisma