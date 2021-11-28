const express = require('express');
const nodemailer = require('nodemailer');

let app = express();
const PORT = process.env.APP_PORT || 8080;

app.get('/', async (request, response) => {
    response.status(200).send('app OK');
});

app.post('/send', async (request, response) => {
    const { name, email, message } = request.body;
    const result = await sendMail(name, email, message);
    response.status(200).send(result);
});

async function sendMail(name, email, message) {
    try {
        let transporter = createTransporter();
        let info = await sendMailTransporter(transporter, name, email, message);
        return {
            "Message sent": info.messageId,
        };
    } catch (e) {
        return { "error": e }
    }

}

function createTransporter() {
    let port = process.env.NODEMAILER_PORT;
    if(process.env.NODEMAILER_SECURE) port = process.env.NODEMAILER_PORT_SECURE;
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

async function sendMailTransporter(transporter, name, email, message) {
    return await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: process.env.MAIL_TO,
        subject: process.env.MAIL_SUBJECT,
        text: message,
    });
}

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
});
