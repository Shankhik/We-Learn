import { createTransport } from "nodemailer"
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
    const transpoter = createTransport({
        host: data.host,
        port: data.port,
        secure: true,
        auth:{
            user:data.auth.user,
            pass:data.auth.pass
        }
    })
    return transpoter;
}