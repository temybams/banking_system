import { z } from 'zod'
import { TransactionType } from '@prisma/client'

const CreateTransactionSchema = z.object({
    amount: z
        .number({
            required_error: 'Amount is required',
        })
        .positive({
            message: 'Amount must be a positive number',
        }),

    description: z
        .string({
            required_error: 'Description is required',
        })
        .min(3, 'Description must be at least 3 characters long')
        .nullable(),

    type: z.nativeEnum(TransactionType, {
        required_error: 'Transaction type is required',
        invalid_type_error: `Transaction type must be one of ${Object.values(
            TransactionType as Record<string, string>,
        ).join(', ')}`,
    }),

    account_id: z
        .number({
            invalid_type_error: 'Account ID must be a number',
            required_error: 'Account ID is required',
        })
        .positive({
            message: 'Account ID must be a positive number',
        }),
})

const InitializeTransferSchema = z.object({
    amount: z
        .number({
            required_error: 'Amount is required',
        })
        .positive({
            message: 'Amount must be a positive number',
        }),
    account_no: z
        .string({
            required_error: 'Account number is required',
        })
        .min(10, {
            message: 'Account number must be 10 digits',
        })
        .max(10, {
            message: 'Account number must be 10 digits',
        })
        .regex(/^\d+$/, {
            message: 'Account number must be a positive number',
        }),

    account_id: z
        .number({
            required_error: 'Account ID is required',
        })
        .positive({
            message: 'Account ID must be a positive number',
        }),
})

export { CreateTransactionSchema, InitializeTransferSchema }
