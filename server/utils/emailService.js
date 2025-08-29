import nodemailer from "nodemailer";
import dotenv from "dotenv"

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_EMAIL_PASS,
    },
});

export async function sendEmail(email, verificationCode) {
    try {
        const info = await transporter.sendMail({
            from: '"Health Navigator" <hassansheikh993@gmail.com>',
            to: email,
            subject: "Email Verification",
            text: "EMAIL VERIFICATION",
            html: `<b>Your verification code is: ${verificationCode}</b>`,
        });

        console.log("Email sent:", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

