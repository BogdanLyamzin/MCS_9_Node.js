import nodemailer, { type SendMailOptions } from "nodemailer";

const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465, //25, 2525
    secure: true,
    auth: {
        user: process.env.UKR_NET_EMAIL,
        pass: process.env.UKR_NET_PASSWORD,
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = (payload: SendMailOptions) => {
    const email = {...payload, from: process.env.UKR_NET_EMAIL};
    return transport.sendMail(email);
}

export default sendEmail;
