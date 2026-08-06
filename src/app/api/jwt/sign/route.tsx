import { signToken } from "@/lib/jwt";
import { ApiError } from "@/lib/serverUtils/apiError";
import { NextRequest, NextResponse } from "next/server";

import { AuthToken } from "@/types/tokenType";

export const POST = async (req: NextRequest):Promise<NextResponse<Status>> => {
    const reqData = (await req.json()) as {
        payload: AuthToken;
        expireTime: number
    }
    const token = (await signToken(reqData.payload, reqData.expireTime)).token

    if(!token) throw new ApiError ("Couldn't sign the payload!",{
        httpCode: 500
    });

    try {
        return NextResponse.json({
            status: true,
            message: 'Signed the Payload',
            token: token
        })
    } catch (error:any) {
        return NextResponse.json({
            status: false, error: error.message
        },{
            status: error.httpCode || 500,
            // headers: header(req.headers.get('origin'))
        })
    }
}