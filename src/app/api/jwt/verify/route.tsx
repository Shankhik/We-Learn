import { verifyToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";
//const delay = (time: number)=> new Promise((resolve)=> setTimeout(resolve, time))
export async function POST(req:NextRequest):Promise<NextResponse<Status>> {
    const reqData = (await req.json()) as {token:string}
    try {
        if(!reqData.token) throw new Error("No Token Found!");
        const decoded = (await verifyToken(reqData.token)).decoded
        if(!decoded) throw new Error('Invalid Token Signature!');
        
        return NextResponse.json({
            status: true,
            message: 'Valid token!',
            decoded: decoded
        },{
            status: 200, //headers: header(req.headers.get('origin'))
        })
    } catch (error:any) {
        let code = 500
        if (error.message === "No Token Found!") code = 400
        else if (error.message === "Invalid Token Signature!") code = 401

        return NextResponse.json({
            status: false,
            error: error.message
        },{
            status: 401, //headers: header(req.headers.get('origin'))
        })
    }
}