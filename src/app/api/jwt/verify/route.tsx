import { header } from "@/lib/headers";
import { verifyToken } from "@/lib/jwt";
import { status } from "@/types/statusType";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest):Promise<NextResponse<status>> {
    const reqData = (await req.json()) as {token:string}
    try {
        if(!reqData.token) throw new Error("No Token Found!");
        const decoded = verifyToken(reqData.token).decoded
        if(!decoded) throw new Error('Invalid Token Signature!');
        
        return NextResponse.json({
            status: true,
            message: 'Valid token!',
            decoded: decoded
        },{
            status: 200, headers: header(req.headers.get('origin'))
        })
    } catch (error:any) {
        console.log(error.message)
        return NextResponse.json({
            status: false,
            error: error.message
        },{
            status: 500, headers: header(req.headers.get('origin'))
        })
    }
}