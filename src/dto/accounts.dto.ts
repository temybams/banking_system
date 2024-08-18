import { z } from 'zod'
import { CreateAccountSchema } from '../validation'

type CreateAccountDto = z.infer<typeof CreateAccountSchema>

export { CreateAccountDto }
