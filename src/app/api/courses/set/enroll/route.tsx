import type { AuthToken } from "@/types/tokenType";

import { httpStatusCode } from "@/lib/fetchReq";
import { jsonParse } from "@/lib/serverUtils/jsonParsor";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse<Status>> {
    try {
        const userDetails = jsonParse<AuthToken>(req.headers.get("x-user-details"),{
            httpCode: httpStatusCode["bad-request"],
            check: "username"
        });

        if(userDetails.error) throw userDetails.error;

        return NextResponse.json({
            status: false,
            message: "Not implemented yet!"
        },{
            status: httpStatusCode["not-implemented"]
        })
    } catch (error: any) {
        return NextResponse.json({
            status: false,
            error: error.message,
        },{
            status: error.httpCode||500
        })
        
    }
}