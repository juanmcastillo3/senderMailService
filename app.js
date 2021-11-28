"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
const process = __importStar(require("process"));
let app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = process.env.APP_PORT;
app.post('/send', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const name = request.body.name;
    const email = request.body.email;
    const message = request.body.message;
    const result = yield sendMail(name, email, message);
    response.status(200).send(result);
}));
function sendMail(name, email, message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let transporter = createTransporter();
            let info = yield sendMailTransporter(transporter, name, email, message);
            return {
                "Message sent: %s": info.messageId,
                "Message url": nodemailer_1.default.getTestMessageUrl(info)
            };
        }
        catch (e) {
            return { "error": e };
        }
    });
}
function createTransporter() {
    let port;
    if (process.env.NODEMAILER_SECURE) {
        port = process.env.NODEMAILER_PORT_SECURE;
    }
    else {
        port = process.env.NODEMAILER_PORT;
    }
    return nodemailer_1.default.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: port,
        secure: process.env.NODEMAILER_SECURE,
        auth: {
            user: process.env.AUTH_MAIL_USER,
            pass: process.env.AUTH_MAIL_PASSWORD,
        },
    });
}
function sendMailTransporter(transporter, name, email, message) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield transporter.sendMail({
            from: `"${name}" <${email}>`,
            to: process.env.MAIL_TO,
            subject: process.env.MAIL_SUBJECT,
            text: message,
        });
    });
}
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
