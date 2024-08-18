import { Request, Response } from 'express'
import { catchAsync } from '../../middlewares'
import { LoginDto, SignupDto } from '../../dto'
import { AuthService } from '../../services'
import { RequestWithUser } from '../../types'

const AuthController = {
    signup: catchAsync(async (req: Request, res: Response) => {
        await AuthService.signup(req.body as SignupDto)
        res.status(201).json({
            success: true,
            message: 'User created successfully',
        })
    }),

    login: catchAsync(async (req: Request, res: Response) => {
        const token = await AuthService.login(req.body as LoginDto)
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                token,
            },
        })
    }),

    me: catchAsync(async (req: RequestWithUser, res: Response) => {
        res.status(200).json({
            success: true,
            message: 'User fetched successfully',
            data: {
                user: req.user,
            },
        })
    }),
}

export default AuthController
