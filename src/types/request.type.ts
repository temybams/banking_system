import { Request } from 'express'
import { User } from '@prisma/client'
import { Omit } from '@prisma/client/runtime/library'

type RequestUser = Omit<User, 'password'>

type RequestWithUser = Request & {
    user?: RequestUser
}

export { RequestUser, RequestWithUser }
