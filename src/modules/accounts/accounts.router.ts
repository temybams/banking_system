import express from 'express'
import AcoountController from './accounts.controller'
import { validationMiddleware, authMiddleware } from '../../middlewares'
import { CreateAccountSchema } from '../../validation'

const AccountRouter = express.Router()

AccountRouter.post(
    '/',
    authMiddleware,
    validationMiddleware(CreateAccountSchema),
    AcoountController.createAccount,
)

AccountRouter.get('/:id', authMiddleware, AcoountController.getAccount)

export default AccountRouter
