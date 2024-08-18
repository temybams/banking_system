import { z } from 'zod'
import { AccountType } from '@prisma/client'

const CreateAccountSchema = z.object({
    account_type: z.nativeEnum(AccountType, {
        required_error: 'Account type is required',
        invalid_type_error: `Account type must be one of ${Object.values(
            AccountType as Record<string, string>,
        ).join(', ')}`,
    }),
})

export { CreateAccountSchema }
