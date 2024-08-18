import httpStatus from 'http-status'
import { prisma } from '../../services'
import { RequestUser } from '../../types'
import { CreateAccountDto } from '../../dto'
import { throwError } from '../../utils'

const AccountService = {
    createAccount: async (dto: CreateAccountDto, user: RequestUser) => {
        const account = await prisma.account.create({
            data: {
                account_no: await AccountService.generateAccountNubmer(),
                user_id: user.id,
                account_type: dto.account_type,
            },
        })

        return account
    },

    getAccount: async (user: RequestUser, id: number) => {
        const account = await prisma.account.findFirst({
            where: {
                id,
                user_id: user.id,
            },
        })

        if (!account) {
            return throwError('Account not found', httpStatus.NOT_FOUND)
        }

        return account
    },

    generateAccountNubmer: async (): Promise<number> => {
        const accountNumber = Math.floor(
            1000000000 + Math.random() * 9000000000,
        )
        const account = await prisma.account.findUnique({
            where: {
                account_no: accountNumber,
            },
        })

        if (account) {
            return AccountService.generateAccountNubmer()
        }

        return accountNumber
    },
}

export default AccountService
