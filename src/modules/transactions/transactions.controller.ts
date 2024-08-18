import { Response } from 'express'
import { catchAsync } from '../../middlewares'
import { RequestWithUser } from '../../types'
import { CreateTransactionDto, InitializeTransferDto } from '../../dto'
import { TransactionsService } from '../../services'

const TransactionController = {
    createTransaction: catchAsync(
        async (req: RequestWithUser, res: Response) => {
            const transaction = await TransactionsService.createTransaction(
                req.body as CreateTransactionDto,
                req.user!,
            )

            res.status(201).json({
                success: true,
                message: 'Transaction created successfully',
                data: {
                    transaction,
                },
            })
        },
    ),

    initializeTransfer: catchAsync(
        async (req: RequestWithUser, res: Response) => {
            const transfer = await TransactionsService.initializeTransfer(
                req.body as InitializeTransferDto,
                req.user!,
            )

            res.status(201).json({
                success: true,
                message: 'Transfer initialized successfully',
                data: {
                    transfer,
                },
            })
        },
    ),

    getTransactions: catchAsync(async (req: RequestWithUser, res: Response) => {
        const transactions = await TransactionsService.getTransactions(
            req.user!,
        )

        res.status(200).json({
            success: true,
            message: 'Transactions fetched successfully',
            data: {
                transactions,
            },
        })
    }),
}

export default TransactionController
