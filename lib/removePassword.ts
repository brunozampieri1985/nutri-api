import { Users } from ".prisma/client"


const removePassword = (users: Users[]) => {
    let result: any[] = []
    users.map(user => {
        let newUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
        result.push(newUser)
    })
    return result
}

export default removePassword