import { z } from 'zod'
import { SignupSchema, LoginSchema } from '../validation'

type SignupDto = z.infer<typeof SignupSchema>
type LoginDto = z.infer<typeof LoginSchema>

export { SignupDto, LoginDto }
