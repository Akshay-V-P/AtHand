import { IEmailService } from "../../domain/services/IEmailService";
import nodemailer from 'nodemailer'

export class EmailService implements IEmailService{
    private transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
        })
    }
    

    async sendOTP(email: string, otp: string): Promise<void> {
        await this.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify your account",
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verify Your Account</title>
                </head>

                <body style="
                    margin:0;
                    padding:0px 0px;
                    background:#f5f5f5;
                    font-family:Arial, Helvetica, sans-serif;
                ">

                <table
                    align="center"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                    style="max-width:650px;">

                <tr>
                <td
                style="
                    background:linear-gradient(180deg,#BFE7FF 0%,#FEFFE8 100%);
                    border-radius:28px;
                    text-align:center;
                ">

                <!-- Logo -->

                <h1 style="
                margin:0;
                font-size:40px;
                font-weight:800;
                color:#1f1f1f;
                ">
                At<span style="color:#ff4040;">.</span>Hand
                </h1>

                <p style="
                margin-top:10px;
                color:#666;
                font-size:16px;
                ">
                Troubleshoot before hiring
                </p>

                <!-- Title -->

                <h2 style="
                margin-top:45px;
                font-size:34px;
                line-height:42px;
                font-weight:800;
                color:#1f1f1f;
                ">
                Verify your account
                </h2>

                <p style="
                margin-top:15px;
                font-size:18px;
                color:#666;
                line-height:30px;
                ">
                Use the verification code below to complete your signup.
                </p>

                <!-- OTP -->

                <div
                style="
                margin:40px auto;
                background:white;
                border-radius:20px;
                padding:8px;
                width:260px;
                box-shadow:0 12px 30px rgba(0,0,0,.08);
                ">

                <p style="
                margin:0;
                font-size:14px;
                color:#888;
                letter-spacing:2px;
                text-transform:uppercase;
                ">
                Verification Code
                </p>

                <h1 style="
                margin:15px 0 0;
                font-size:42px;
                letter-spacing:6px;
                color:#1f1f1f;
                font-weight:800;
                ">
                ${otp}
                </h1>

                </div>

                <p style="
                font-size:15px;
                color:#666;
                line-height:28px;
                ">
                This code expires in
                <strong>1 minutes</strong>.
                </p>

                <p style="
                margin-top:35px;
                font-size:14px;
                color:#888;
                line-height:26px;
                ">
                If you didn't request this verification,
                you can safely ignore this email.
                </p>

                <hr style="
                margin:45px 0;
                border:none;
                border-top:1px solid rgba(0,0,0,.08);
                ">

                <p style="
                font-size:13px;
                color:#999;
                line-height:22px;
                margin:0;
                ">
                © 2026 At.Hand<br>
                Reliable local services at your fingertips.
                </p>

                </td>
                </tr>

                </table>

                </body>
                </html>
            `
        })
    }
}