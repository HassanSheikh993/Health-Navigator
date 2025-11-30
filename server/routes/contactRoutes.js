import express from "express";
import { sendContactEmail } from "../utils/sendContactEmail.js";

const contactRouter = express.Router();

contactRouter.post("/contact", async (req, res) => {
    const { firstName, lastName, phone, email, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const sent = await sendContactEmail(firstName, lastName, phone, email, message);

    if (sent) {
        return res.json({ message: "Message sent successfully!" });
    } else {
        return res.status(500).json({ message: "Failed to send message." });
    }
});

export default contactRouter;
