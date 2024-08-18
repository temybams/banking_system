import { Response, NextFunction } from 'express'
import { RequestWithUser } from '../types'

const loggerMiddleware = (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
) => {
    const startAt = process.hrtime()
    const { ip, method, originalUrl, headers, socket } = req
    const country = headers['cf-ipcountry']

    const ipAddress =
        headers['x-forwarded-for']?.toString().split(',').shift() ||
        headers['cf-connecting-ip'] ||
        headers['x-real-ip'] ||
        socket.remoteAddress ||
        ip

    res.on('finish', () => {
        const { statusCode } = res
        const user = req.user ? req.user.id : null
        const contentLength = req.get('content-length')
        const diff = process.hrtime(startAt)
        const responseTime = diff[0] * 1e3 + diff[1] * 1e-6

        console.info(
            `${method} ${originalUrl} ${statusCode} ${(responseTime / 1000).toFixed(2)}s ${contentLength} - ${ipAddress} ${user ? user : 'anonymous'} from: ${country || 'unknown'}`,
        )
    })

    next()
}

export default loggerMiddleware
