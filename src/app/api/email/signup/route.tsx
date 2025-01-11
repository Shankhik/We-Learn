import { NextRequest, NextResponse } from "next/server";
import { header } from "@/lib/headers";
import { status } from "@/types/statusType";
import {render} from '@react-email/components';
import SignupEmail from "@/email/SignupEmail";
import { createEmailTransport } from "@/lib/email";

type ReqDataType = {
    username: string;
    email: `${string}@${string}`
}
export async function POST(req: NextRequest):Promise<NextResponse<status>>{
    const origin = req.headers.get('origin');
    const {username, email} = await req.json() as ReqDataType
    
    const transporter = createEmailTransport();
    
    //converts React Email to Html
    const htmlEmail = await render(<SignupEmail user={username}/>)

    const mailDetails = {
        from: `"We Learn" shankhik.dev@zohomail.in`,
        to: email,
        subject: `Welcome ${username}`,
        html: htmlEmail,
        headers: {
            "Content-Transfer-Encoding": "base64"
        }
    }

    let status:status;

    try {
        const res = await transporter.sendMail(mailDetails)
        
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