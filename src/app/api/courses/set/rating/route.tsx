import type { ReqDataType } from "@/lib/apiReqDataType";
import type { AuthToken } from "@/types/tokenType";

import { verifyAuthHeader } from "@/lib/jwt";
import { rate } from "@/mongoDB/userTrack";
import { NextRequest, NextResponse } from "next/server";
import { jsonParse } from "@/lib/serverUtils/jsonParsor";
import { ApiError } from "@/lib/serverUtils/apiError";

// Protected by middleware
export async function POST (req: NextRequest):Promise<NextResponse<Status>> {
    try {
        const reqData = await req.json() as ReqDataType['courses']['set']['rate']

        const userDetails = jsonParse<AuthToken>(req.headers.get("x-user-details"),{
            check: "username", httpCode:400
        });
        // If Parsing fails
        if (userDetails.error) throw userDetails.error;

        const ratingAck = await rate(
            userDetails.data?.username!,
            reqData.courseId,
            reqData.rating
        )

        if (!ratingAck.acknowledged) throw new ApiError("Couldn't rate");
        
        return NextResponse.json({
            status: true,
            message: `Rated`
        })

    } catch (error:any) {
        return NextResponse.json({
            status: false,
            error: error.message
        },{
            status: error.httpCode||500,
        })
    }
}