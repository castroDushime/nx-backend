// backend (Node.js with Express and SMTP provider)
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'nxplayers.com'], // Add your frontend URLs
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

const PORT = process.env.PORT || 'https://nx-backend-topaz.vercel.app';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    requireTLS: true,
    tls: {
        ciphers: 'SSLv3'
    }


});

app.post("/contact", (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: `"${name}" <${process.env.SMTP_USER}>`,
        to: process.env.RECEIVER_EMAIL,
        subject: "",
        replyTo: email,
        text: `From: ${email}\n\n${message}`,
        html: `
        <p>${message.replace(/\n/g, '<br>')}</p>
    `,
        headers: {
            'X-Priority': '3',
            'X-MSMail-Priority': 'Normal',
            'Importance': 'Normal',
            'X-Mailer': 'Node.js/Nodemailer'
        }
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({message: "Error sending email", error});
        }
        res.status(200).json({message: "Message sent successfully!", info});
    });
} );

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
