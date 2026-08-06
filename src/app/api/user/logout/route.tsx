import { serverLog } from "@/lib/colorText2";
import { ApiError } from "@/lib/serverUtils/apiError";
import { jsonParse } from "@/lib/serverUtils/jsonParsor";

import { NextRequest, NextResponse } from "next/server";

import type { AuthToken } from "@/types/tokenType";

export async function GET (req: NextRequest):Promise<NextResponse<Status>>{
    try {
        const {data: userCredentials, error: userError} = jsonParse<AuthToken>(req.headers.get("x-user-details"),{
            check: "username",
        });

        if (userError || userCredentials===null) throw new ApiError("Bad User Details header",{
            httpCode: 400 // Bad Request
        });

        const response= NextResponse.json({
            status: true,
            message: `${userCredentials.username} Logged out`,
        } satisfies Status,{
            status: 200
        });

        response.cookies.delete("AUTH_TOKEN");
        serverLog("success","logout",{},userCredentials.username)
        return response;
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            error: error.message
        },{
            status: error.httpCode || 500
        })
    }
}