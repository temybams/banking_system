import { z } from 'zod'

const SignupSchema = z.object({
    name: z
        .string({ required_error: 'Name is required' })
        .min(3, {
            message: 'Name must be at least 3 characters long',
        })
        .trim(),
    email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email address')
        .trim()
        .toLowerCase(),
    password: z.string({ required_error: 'Password is required' }).min(6, {
        message: 'Password must be at least 6 characters long',
    }),
})

const LoginSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email address')
        .trim()
        .toLowerCase(),
    password: z.string({ required_error: 'Password is required' }).min(6),
})

export { SignupSchema, LoginSchema }
