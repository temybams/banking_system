import * as argon from 'argon2'
import httpStatus from 'http-status'
import { prisma, JWTService, EmailService } from '../../services'
import { SignupDto, LoginDto } from '../../dto'
import { throwError } from '../../utils'

const AuthService = {
    signup: async (dto: SignupDto) => {
        let user = await prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        })

        if (user) {
            return throwError('User already exists', httpStatus.CONFLICT)
        }

        user = await prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: await argon.hash(dto.password),
            },
        })

        EmailService.sendEmail({
            email: user.email,
            subject: 'Welcome to our platform',
            text: `Dear ${user.name}, welcome to our platform, we are glad to have you on board. You can now enjoy our services.`,
        })

        return user
    },

    login: async (dto: LoginDto) => {
        const user = await prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        })

        if (!user) {
            return throwError('Invalid credentials', httpStatus.NOT_FOUND)
        }

        const valid = await argon.verify(user.password, dto.password)

        if (!valid) {
            return throwError('Invalid credentials', httpStatus.NOT_ACCEPTABLE)
        }

        const token = JWTService.sign({ sub: user.id })

        EmailService.sendEmail({
            email: user.email,
            subject: 'Login Banking Alert',
            text: `Dear ${user.name}, you have successfully logged in to your account. on ${new Date().toLocaleString()}, if this was not you, please contact us immediately.`,
        })

        return token
    },
}

export default AuthService
