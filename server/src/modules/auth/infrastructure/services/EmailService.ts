import { IEmailService } from "../../domain/services/IEmailService";
import nodemailer from 'nodemailer'

export class EmailService implements IEmailService{
    private transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    })

    async sendOTP(email: string, otp: string): Promise<void> {
        await this.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify your account",
            html: `
                <h2>Your OTP<h2>
                <p>Your verification code is:<p>
                <h1>${otp}<h1>
                <p>This code will expires in 5 minutes<p>
            `
        })
    }
}