import { z } from 'zod'
import {
    CreateTransactionSchema,
    InitializeTransferSchema,
} from '../validation'

type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>
type InitializeTransferDto = z.infer<typeof InitializeTransferSchema>

export { CreateTransactionDto, InitializeTransferDto }
