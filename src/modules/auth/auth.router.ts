import express from 'express'
import AuthController from './auth.controller'
import { validationMiddleware, authMiddleware } from '../../middlewares'
import { SignupSchema, LoginSchema } from '../../validation'

const AuthRouter = express.Router()

AuthRouter.post(
    '/register',
    validationMiddleware(SignupSchema),
    AuthController.signup,
)

AuthRouter.post(
    '/login',
    validationMiddleware(LoginSchema),
    AuthController.login,
)

AuthRouter.get('/me', authMiddleware, AuthController.me)

export default AuthRouter
