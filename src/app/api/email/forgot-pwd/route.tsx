import ForgotPwdEmail from "@/email/ForgotPwdEmail";
import { createEmailTransport } from "@/lib/email";
import { header } from "@/lib/headers";
import { status } from "@/types/statusType";
import { render } from "@react-email/components";
import { NextRequest, NextResponse } from "next/server";

type ReqDataType = {
    username: string;
    email: `${string}@${string}`;
    otp: `${number}${number}${number}${number}`
}

export async function POST (req:NextRequest):Promise<NextResponse<status>>{
    const origin = req.headers.get('origin');
    const {username, email, otp} = await req.json() as ReqDataType;

    const transporter = createEmailTransport();
    
    //converts React Email to Html
    const htmlEmail = await render(<ForgotPwdEmail user={username} otp={parseInt(otp)}/>)

    const mailDetails = {
        from: `"We Learn" shankhik.dev@zohomail.in`,
        to: email,
        subject: `OTP: ${otp}`,
        html: htmlEmail,
        headers: {
            "Content-Transfer-Encoding": "base64"
        }
    }

    let status: status;

    try {
        await transporter.sendMail(mailDetails)
        status={
            status: true,
            message:`sent to ${email}`
        }
        
    }catch(error:any){
        status= {
            status: false,
            error: error.message
        }
    }
    return NextResponse.json(status,{
        status: 200,
        headers: header(origin)
    })
}