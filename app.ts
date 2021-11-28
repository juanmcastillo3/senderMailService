import express from 'express';
import nodemailer from 'nodemailer';
import 'dotenv/config'
import * as process from "process";

let app = express();
app.use(express.json());
const PORT = process.env.APP_PORT;

app.post('/send', async (request: any, response: any) => {
    const name = request.body.name;
    const email = request.body.email;
    const message = request.body.message;
    const result = await sendMail(name, email, message);
    response.status(200).send(result);
});

async function sendMail(name: string, email: string, message: string) {
    try {
        let transporter = createTransporter();
        let info = await sendMailTransporter(transporter, name, email, message);
        return {
            "Message sent: %s": info.messageId,
            "Message url": nodemailer.getTestMessageUrl(info)
        };
    } catch (e) {
        return { "error": e }
    }

}

function createTransporter() {
    let port;
    if(process.env.NODEMAILER_SECURE) {
        port = process.env.NODEMAILER_PORT_SECURE;
    } else {
        port = process.env.NODEMAILER_PORT;
    }

    return nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: port,
        secure: process.env.NODEMAILER_SECURE,
        auth: {
            user: process.env.AUTH_MAIL_USER,
            pass: process.env.AUTH_MAIL_PASSWORD,
        },
    });
}

async function sendMailTransporter(transporter, name: string, email: string, message: string) {
    return await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: process.env.MAIL_TO,
        subject: process.env.MAIL_SUBJECT,
        text: message,
    });
}

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
});
