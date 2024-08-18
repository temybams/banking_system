import httpStatus from 'http-status'
import { Response, NextFunction } from 'express'
import { RequestWithUser } from '../types'
import { catchAsync } from '../middlewares'
import { JWTService, prisma } from '../services'
import { throwError } from '../utils'

const authMiddleware = catchAsync(
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
        let token: string | undefined
        let type: string | undefined
        ;[type, token] = req.headers.authorization?.split(' ') ?? []

        type === 'Bearer' ? (token = token) : (token = undefined)

        if (!token) {
            return throwError('Unauthorized', httpStatus.UNAUTHORIZED)
        }

        const decoded = JWTService.verify(token) as { sub: string }

        if (!decoded) {
            return throwError('Unauthorized', httpStatus.UNAUTHORIZED)
        }

        const user = await prisma.user.findUnique({
            where: {
                id: Number(decoded.sub),
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        })
        if (!user) {
            return throwError('Unauthorized', httpStatus.UNAUTHORIZED)
        }

        req.user = user

        next()
    },
)

export default authMiddleware
