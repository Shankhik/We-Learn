import { serverLog } from "@/lib/colorText2";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse<Status>>{
    // console.log("Request cookies:",req.cookies)
    //const e = req.headers.entries().map((v)=>)
    serverLog("message","check",{symbolColor: undefined},`Server is running fine`)
    const response = NextResponse.json({
        status: true,
        message: "We-Learn Api is running",
        data: {
            cookies: req.cookies.toString() ?? null,
            auth: req.headers.get("authorization")
        }
    },{
        status: 200
    });
    return response;
}