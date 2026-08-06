import { ApiError } from "@/lib/serverUtils/apiError";
import { jsonParse, parseReqJson } from "@/lib/serverUtils/jsonParsor";
import { markAsRead } from "@/mongoDB/serverActions/users";
import { NextRequest, NextResponse } from "next/server";

import type { ReqDataType } from "@/lib/apiReqDataType";
import type { AuthToken } from "@/types/tokenType";

type ReqData = ReqDataType['user']['track-record']['mark-as-read']['_body']

export async function POST(req: NextRequest): Promise<NextResponse<Status>> {
    try {
        const userDetails = jsonParse<AuthToken>(req.headers.get("x-user-details"),{
            check: "username"
        });
        if(userDetails.error) throw new ApiError("Bad User Details",{
            httpCode: 400 //Bad request
        })

        const reqBody = await parseReqJson<ReqData>(req);
        if(!reqBody || !reqBody.courseId) throw new ApiError("Bad req body",{
            httpCode: 400 // bad Request
        });
        
        const res = await markAsRead(userDetails.data?.username||"",reqBody.courseId||"");

        if (!res.status) throw new ApiError(res.error||res.message||"Couldn't mark the module as read",{
            httpCode: 500
        });

        return NextResponse.json(res);
        
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            message: error.message
        },{status: error.httpCode||500})
    }
}