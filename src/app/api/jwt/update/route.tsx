import { updateToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";
import { ReqDataType } from "@/lib/apiReqDataType";
import { httpStatusCode } from "@/lib/fetchReq";

export async function POST(req:NextRequest): Promise<NextResponse<Status>> {
    const statusCode = httpStatusCode["internal-server-error"];
    try {
        const reqData = await req.json() as ReqDataType['jwt']['update'];
        if(!reqData.cookieName && !reqData.token)
            throw new Error("Bad request body!");

        const token = reqData.token || req.cookies.get(reqData.cookieName)?.value ;
        if(!token) throw new Error("Cookie not found!");
        
        const now = Math.floor(Date.now() / 1000);
        let maxAge: number|undefined;

        const newTokenRes = await updateToken(token,reqData.updateFields);
        if(!newTokenRes.token) throw new Error("Couldn't update token!");
        if(newTokenRes.exp){
            maxAge = newTokenRes.exp - now
        }
        const res:NextResponse<Status> = NextResponse.json({
            status: true, message: "Token updated!",
            token: newTokenRes.token
        })
    
        res.cookies.set(reqData.cookieName||'AUTH_TOKEN',newTokenRes.token,{
            maxAge: maxAge,
            path:"/"
        });
        return res

    } catch (error:any) {
        const res = NextResponse.json({
            status: false, error: error.message
        },{
            status: statusCode
        })
        return res
    }
}