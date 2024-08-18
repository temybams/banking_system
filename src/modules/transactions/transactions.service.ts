import httpStatus from 'http-status'
import { TransactionType, Transaction, Prisma } from '@prisma/client'
import { CreateTransactionDto, InitializeTransferDto } from '../../dto'
import { prisma, EmailService } from '../../services'
import { RequestUser } from '../../types'
import { throwError } from '../../utils'

const TransactionsService = {
    createTransaction: async (dto: CreateTransactionDto, user: RequestUser) => {
        const initialAccount = await prisma.account.findFirst({
            where: {
                id: dto.account_id,
                user_id: user.id,
            },
        })

        if (!initialAccount) {
            return throwError('Account not found', httpStatus.NOT_FOUND)
        }

        let transaction: Transaction | undefined

        try {
            await prisma.$transaction(async (prisma) => {
                let account = await prisma.account.findUnique({
                    where: {
                        id_user_id_version: {
                            user_id: user.id,
                            id: initialAccount.id,
                            version: initialAccount.version,
                        },
                    },
                })

                if (!account) {
                    return throwError(
                        'Account not found or version mismatch',
                        httpStatus.NOT_FOUND,
                    )
                }

                if (dto.type === TransactionType.DEBIT) {
                    if (account.balance < dto.amount) {
                        return throwError(
                            'Insufficient balance',
                            httpStatus.BAD_REQUEST,
                        )
                    }

                    account = await prisma.account.update({
                        where: {
                            id_user_id_version: {
                                user_id: user.id,
                                id: initialAccount.id,
                                version: initialAccount.version,
                            },
                        },
                        data: {
                            balance: {
                                decrement: dto.amount,
                            },
                            version: {
                                increment: 1,
                            },
                        },
                    })

                    if (account.version !== initialAccount.version + 1) {
                        return throwError(
                            'Account version mismatch, please retry your transaction',
                            httpStatus.NOT_FOUND,
                        )
                    }

                    transaction = await prisma.transaction.create({
                        data: {
                            account_id: account.id,
                            type: dto.type,
                            amount: dto.amount,
                            description:
                                dto.description ||
                                `Debit of ${dto.amount} from account ${account.account_no}`,
                        },
                    })
                }
                if (dto.type === TransactionType.CREDIT) {
                    await prisma.account.update({
                        where: {
                            id: account.id,
                            version: account.version,
                        },
                        data: {
                            balance: {
                                increment: dto.amount,
                            },
                            version: {
                                increment: 1,
                            },
                        },
                    })

                    transaction = await prisma.transaction.create({
                        data: {
                            account_id: account.id,
                            type: dto.type,
                            amount: dto.amount,
                            description:
                                dto.description ||
                                `Credit of ${dto.amount} to account ${account.account_no}`,
                        },
                    })
                }
            })
            return transaction
        } catch (error) {
            return TransactionsService.handleTransactionErrors(error)
        } finally {
            if (transaction) {
                if (transaction.type === TransactionType.DEBIT) {
                    EmailService.sendEmail({
                        email: user.email,
                        subject: 'Debit Alert',
                        text: `Dear ${user.name}, a debit of ${dto.amount} was made from your account on ${transaction.createdAt.toLocaleString()} with account no ${initialAccount.account_no}. If this was not you, please contact us immediately.`,
                    })
                }
                if (transaction.type === TransactionType.CREDIT) {
                    EmailService.sendEmail({
                        email: user.email,
                        subject: 'Credit Alert',
                        text: `Dear ${user.name}, a credit of ${dto.amount} was made to your account on ${transaction.createdAt.toLocaleString()} with account no ${initialAccount.account_no}. If this was not you, please contact us immediately.`,
                    })
                }
            }
        }
    },

    getTransactions: async (user: RequestUser) => {
        const accounts = await prisma.account.findMany({
            where: {
                user_id: user.id,
            },
        })

        const accountIds = accounts.map((account) => account.id)

        const transactions = await prisma.transaction.findMany({
            where: {
                account_id: {
                    in: accountIds,
                },
            },
            include: {
                account: true,
            },
        })

        return transactions
    },

    initializeTransfer: async (
        dto: InitializeTransferDto,
        user: RequestUser,
    ) => {
        const senderAccount = await prisma.account.findFirst({
            where: {
                id: dto.account_id,
                user_id: user.id,
            },
        })

        if (!senderAccount) {
            return throwError('Account not found', httpStatus.NOT_FOUND)
        }

        if (senderAccount.balance < dto.amount) {
            return throwError('Insufficient balance', httpStatus.BAD_REQUEST)
        }

        const receiverAccount = await prisma.account.findUnique({
            where: {
                account_no: Number(dto.account_no),
            },
            include: {
                user: true,
            },
        })

        if (!receiverAccount) {
            return throwError(
                'Receiver account not found',
                httpStatus.NOT_FOUND,
            )
        }

        if (receiverAccount.id === senderAccount.id) {
            return throwError(
                'Cannot transfer to the same account',
                httpStatus.BAD_REQUEST,
            )
        }

        let senderTransaction: Transaction | undefined
        let receiverTransaction: Transaction | undefined

        try {
            await prisma.$transaction(async (prisma) => {
                let sender = await prisma.account.findUnique({
                    where: {
                        id_user_id_version: {
                            id: senderAccount.id,
                            user_id: user.id,
                            version: senderAccount.version,
                        },
                    },
                })

                if (!sender) {
                    return throwError(
                        'Sender account not found or version mismatch',
                        httpStatus.NOT_FOUND,
                    )
                }

                if (sender.balance < dto.amount) {
                    return throwError(
                        'Insufficient balance',
                        httpStatus.BAD_REQUEST,
                    )
                }

                let receiver = await prisma.account.findUnique({
                    where: {
                        id: receiverAccount.id,
                    },
                })

                if (!receiver) {
                    return throwError(
                        'Receiver account not found',
                        httpStatus.NOT_FOUND,
                    )
                }

                sender = await prisma.account.update({
                    where: {
                        id_user_id_version: {
                            id: sender.id,
                            user_id: user.id,
                            version: sender.version,
                        },
                    },
                    data: {
                        balance: {
                            decrement: dto.amount,
                        },
                        version: {
                            increment: 1,
                        },
                    },
                })

                if (sender.version !== senderAccount.version + 1) {
                    return throwError(
                        'Sender account version mismatch, please retry your transaction',
                        httpStatus.NOT_FOUND,
                    )
                }

                await prisma.account.update({
                    where: {
                        id: receiver.id,
                    },
                    data: {
                        balance: {
                            increment: dto.amount,
                        },
                    },
                })

                senderTransaction = await prisma.transaction.create({
                    data: {
                        account_id: sender.id,
                        type: TransactionType.DEBIT,
                        amount: dto.amount,
                        description: `Transfer of ${dto.amount} to account ${receiver.account_no}`,
                    },
                })

                receiverTransaction = await prisma.transaction.create({
                    data: {
                        account_id: receiver.id,
                        type: TransactionType.CREDIT,
                        amount: dto.amount,
                        description: `Transfer of ${dto.amount} from account ${sender.account_no}`,
                    },
                })
            })

            return senderTransaction
        } catch (error) {
            return TransactionsService.handleTransactionErrors(error)
        } finally {
            if (senderTransaction) {
                EmailService.sendEmail({
                    email: user.email,
                    subject: 'Transfer Debit Alert',
                    text: `Dear ${user.name}, a transfer of ${dto.amount} was made from your account with account number on ${senderAccount.account_no} ${senderTransaction.createdAt.toLocaleString()} to ${receiverAccount.user.name} . If this was not you, please contact us immediately.`,
                })
            }
            if (receiverTransaction) {
                EmailService.sendEmail({
                    email: receiverAccount.user.email,
                    subject: 'Transfer Credit Alert',
                    text: `Dear ${receiverAccount.user.name}, a transfer of ${dto.amount} was made by ${user.name} to your account with account no ${receiverAccount.account_no} on ${receiverTransaction.createdAt.toLocaleString()}.`,
                })
            }
        }
    },

    handleTransactionErrors: (error: unknown) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2034') {
                return throwError(
                    'Transaction failed due to a write conflict or a deadlock. Please retry your transaction',
                    httpStatus.NOT_ACCEPTABLE,
                )
            }

            if (error.code === 'P2025') {
                return throwError(
                    'Transaction failed due to a version mismatch. Please retry your transaction',
                    httpStatus.NOT_FOUND,
                )
            }

            throw error
        }

        throw error
    },
}

export default TransactionsService
