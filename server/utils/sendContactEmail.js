// utils/sendContactEmail.js

import nodemailer from "nodemailer";
import dotenv from "dotenv";

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

export async function sendContactEmail(firstName, lastName, phone, email, message) {
    try {
        const info = await transporter.sendMail({
            from: `"Health Navigator Contact" <${process.env.USER_EMAIL}>`,
            to: process.env.USER_EMAIL, // your admin email receives the message
            subject: "New Contact Form Submission",
            html: `
                <h2>New Contact Message</h2>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
        });

        console.log("Contact Email Sent:", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending contact email:", error);
        return false;
    }
}
