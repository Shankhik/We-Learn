// import { render } from "@react-email/components";
import { render } from "react-email"
import { createTransport } from "nodemailer"
// import Mail from "nodemailer/lib/mailer";
const data = {
    host: process.env.EMAIL_HOST||'smtp.zoho.in',
    port: parseInt(process.env.EMAIL_PORT||'465'),
    secure: true,
    auth:{
        user: process.env.EMAIL_ADDRESS||'shankhik.dev@zohomail.in',
        pass: process.env.EMAIL_PASS||''
    }
}
export const createEmailTransport = ()=>{
    const transporter = createTransport({
        host: data.host,
        port: data.port,
        secure: true,
        auth:{
            user:data.auth.user,
            pass:data.auth.pass
        }
    })
    return transporter;
}

export const sendEmail = async (
    component: React.JSX.Element,
    sendTo: string,
    subject: string,
    options?:{
        senderName?: string,
        senderEmail?: string,
    }
)=>{
    const transporter = createEmailTransport();
    const html = await render(component);
    const senderEmail = options?.senderEmail || 'shankhik.dev@zohomail.in'
    
    // sending the email
    await transporter.sendMail({
        from: `"${options?.senderName||"We Learn"}" ${senderEmail}`,
        to: sendTo,
        subject: subject,
        html: html,
        headers: {
            "Content-Transfer-Encoding": "base64"
        }
    })
}
