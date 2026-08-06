import { render as renderHtml } from "@react-email/render";
import { createTransport, SentMessageInfo, TransportOptions } from "nodemailer";

import type { ComponentType, ComponentProps } from "react";
import { ApiError } from "../serverUtils/apiError";

const data = {
    host: process.env.EMAIL_HOST,

    // Not Found -> returns 0
    port: Number(process.env.EMAIL_PORT||""),
    secure: true,
    auth:{
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASS
    }
}

const transporter = createTransport(data);

const transporterVerification ={
    verified: false,
    retriesLeft: 5
};


const verifyTransporter = () =>{
    transporter.verify( async (error, success)=>{
        transporterVerification.verified = !error;  transporterVerification.retriesLeft -= 1;
    });
}
verifyTransporter();

export async function sendEmail <T extends ComponentType<any>>(
    email:{
        senderName?: string,
        recipient: string,
        subject?: string,
    },
    Component: T | string,
    props?: Omit<ComponentProps<T>,'inPreview'>
): Promise<Status>{
    let sentInfo: undefined|SentMessageInfo
    try {

        if (!transporterVerification.verified)
        throw new ApiError("Email Service host configuration error!",{
            httpCode: 500
        });
        
        let html: string|undefined;

        // If bad Component
        if (!Component) throw new ApiError("Bad html string or component",{
            httpCode: 400
        });
        
        // component is Html
        if ( typeof Component === "string" ) html = Component;
        // If component is a function
        else {
            html = await renderHtml(<Component {...props as any}/>)
        }

        if (!html) throw new ApiError("Couldn't render the email",{
            httpCode: 400
        });

        sentInfo = await transporter.sendMail({
            from: `"${email.senderName || "We Learn"}" ${data.auth.user}`,
            to: email.recipient,
            subject: email.subject,
            html,
            headers:{
                ...(process.env.NODE_ENV==="production"?{
                    "Content-Transfer-Encoding": "base64"
                }:undefined)
            }
        });
        
        // Email Not sent
        if (sentInfo.accepted.length===0)
            throw new ApiError(`Couldn't send email to '${email.recipient}'`);
        
        return {
            status: true,
            message: "Email sent",
            ...(sentInfo?{
                emailSentResponse: sentInfo
            }:undefined)
        }
    } catch (error:any) {
        return {
            status: false,
            error: error.message,
            ...(sentInfo??undefined)
        }
    }
}