import express from 'express'
import TransactionController from './transactions.controller'
import { validationMiddleware, authMiddleware } from '../../middlewares'
import {
    CreateTransactionSchema,
    InitializeTransferSchema,
} from '../../validation'

const TransactionRouter = express.Router()

TransactionRouter.post(
    '/',
    authMiddleware,
    validationMiddleware(CreateTransactionSchema),
    TransactionController.createTransaction,
)

TransactionRouter.get(
    '/',
    authMiddleware,
    TransactionController.getTransactions,
)

TransactionRouter.post(
    '/transfer',
    authMiddleware,
    validationMiddleware(InitializeTransferSchema),
    TransactionController.initializeTransfer,
)

export default TransactionRouter
