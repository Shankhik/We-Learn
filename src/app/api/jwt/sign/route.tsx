import { header } from "@/lib/headers";
import { signToken, tokenType, verifyToken } from "@/lib/jwt";
import { status } from "@/types/statusType";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest):Promise<NextResponse<status>> {
    const reqData = (await req.json()) as {payload:tokenType,expireTime?:number}
    try {
        const token = signToken(reqData.payload,reqData.expireTime).token
        if(!token) throw new Error(`Couldn't sign the payload!`);

        return NextResponse.json({
            status: true,
            message: 'Payload Signed!',
            token
        },{
            status: 200, headers: header(req.headers.get('origin'))
        })
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            error: error.message
        },{
            status: 500, headers: header(req.headers.get('origin'))
        })
    }
}