import { Response } from 'express'
import { catchAsync } from '../../middlewares'
import { RequestWithUser } from '../../types'
import { CreateAccountDto } from '../../dto'
import { AccountService } from '../../services'

const AcoountController = {
    createAccount: catchAsync(async (req: RequestWithUser, res: Response) => {
        const account = await AccountService.createAccount(
            req.body as CreateAccountDto,
            req.user!,
        )

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: {
                account,
            },
        })
    }),

    getAccount: catchAsync(async (req: RequestWithUser, res: Response) => {
        const account = await AccountService.getAccount(
            req.user!,
            Number(req.params.id),
        )

        res.status(200).json({
            success: true,
            message: 'Account fetched successfully',
            data: {
                account,
            },
        })
    }),
}

export default AcoountController
