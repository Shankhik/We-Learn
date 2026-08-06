import { NextRequest, NextResponse } from "next/server";

export const POST = async (req:NextRequest) :Promise<NextResponse<Status>>=>{
    try {
        return NextResponse.json({
            status: true,
            message: "token generated"
        });
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            error: error.message
        },{
            status: error.httpCode || 500
        })
    }
}