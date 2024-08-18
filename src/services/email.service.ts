import * as nodemailer from 'nodemailer'
import { MailOptions } from 'nodemailer/lib/sendmail-transport'

const transporter = nodemailer.createTransport({
    port: process.env.EMAIL_PORT as unknown as number,
    host: process.env.EMAIL_HOST,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

const EmailService = {
    async sendEmail({
        email,
        subject,
        text,
    }: {
        email: string
        subject: string
        text: string
    }) {
        try {
            const mailOptions: MailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: subject,
                text: text,
            }
            const info = await transporter.sendMail(mailOptions)
            return info
        } catch (err) {
            console.error('Error sending email')
            console.error(err)
            return null
        }
    },
}

export default EmailService
