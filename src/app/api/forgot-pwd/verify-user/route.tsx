import ApiLinks from "@/lib/apiLinks";
import { bcryptHash } from "@/lib/bcrypt";
import { setCookie } from "@/lib/cookies";
import { post } from "@/lib/fetchReq";
import { header } from "@/lib/headers";
import { findUser } from "@/mongoDB/users";
import { forgotPwdDataType } from "@/types/authType";
import { status } from "@/types/statusType";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req:NextRequest):Promise<NextResponse<status>>{
    const origin = req.headers.get('origin');
    const reqData = await req.json() as forgotPwdDataType;

    let status: status;

    try{
        const userExists = (await findUser(reqData,reqData)).status;
        
        if (userExists){
            let otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
            //send email
            await post(ApiLinks.email.forgotPwd.this,{
                username:reqData.username,
                email:reqData.email,
                otp:`${otp}`
            })
            let hashed = (await bcryptHash(otp.toString())).hashed;
            status = {
                status: true,
                message: `email sent to: ${reqData.email}`,
                hashed: hashed
            }
        }else{
            status = {
                status: false,
                message: `No user found`
            }
        }
    }catch(e: any){
        status = {
            status: false,
            error: e.message
        }
    }
    
    return NextResponse.json(status, {
        status:200,
        headers: header(origin)
    })
}