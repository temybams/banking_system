import express, { Application, Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routes from './routes'
import { IError } from './types'
import { errorHandler, loggerMiddleware } from './middlewares'
import { connectPrisma } from './services'

const app: Application = express()

dotenv.config()

app.use(loggerMiddleware)
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST'],
    }),
)
app.use(express.json())
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to NodeJs Backend',
    })
})
app.use('/', routes)
app.use((req: Request, res: Response, next: NextFunction) => {
    const error: IError = new Error(
        `API Endpoint Not found - ${req.originalUrl}`,
    )
    error.status = 404
    next(error)
})
app.use(errorHandler)
app.listen(process.env.PORT, async () => {
    await connectPrisma().then(() => {
        console.clear()
        console.log(`Server running on port ${process.env.PORT}`)
    })
})
