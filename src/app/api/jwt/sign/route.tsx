import { header } from "@/lib/headers";
import { signToken, tokenType } from "@/lib/jwt";
import { status } from "@/types/statusType";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest):Promise<NextResponse<status>> => {
    const reqData = (await req.json()) as {
        payload: tokenType|object;
        expireTime: number
    }
    const token = signToken(reqData.payload).token

    if(!token) throw new Error ("Couldn't sign the payload!");

    try {
        return NextResponse.json({
            status: true,
            message: 'Signed the Payload',
            token: token
        },{
            status: 200, headers: header(req.headers.get('origin'))
        })
    } catch (error:any) {
        return NextResponse.json({
            status: false, error: error.message
        },{
            status: 500, headers: header(req.headers.get('origin'))
        })
    }
}