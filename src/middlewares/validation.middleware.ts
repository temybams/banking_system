import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { catchAsync } from '../middlewares'

const validationMiddleware = (schema: ZodSchema) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                req.body = schema.parse(req.body)
                next()
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors.map((err) => err.message)[0]
                    return res.status(400).json({
                        success: false,
                        message,
                    })
                }
                next(error)
            }
        },
    )
}

export default validationMiddleware
