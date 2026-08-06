import { mongoCollection } from "@/mongoDB/operations";
import { enroll, getTrackRecord } from "@/mongoDB/userTrack";
import { httpStatusCode } from "@/lib/fetchReq";
import { jsonParse } from "@/lib/serverUtils/jsonParsor";
import { ApiError } from "@/lib/serverUtils/apiError";
import { NextRequest, NextResponse } from "next/server";

import type { AuthToken } from "@/types/tokenType";

// Note: DON'T server cache it.
// Middleware Protected
export async function GET (req:NextRequest):Promise<NextResponse<Status>> {
    try {
        const userDetails = jsonParse<AuthToken>(req.headers.get("x-user-details"),{
            check: "username"
        })
        if(userDetails.error) throw new ApiError("Bad User Details header",{
            httpCode: 400 // Bad Request
        });

        const trackRecord = await getTrackRecord(
            userDetails.data?.username!
        );

        // Returns the track record if document found
        return NextResponse.json({
            status: true,
            message: "Found Track Record",
            data: trackRecord
        })
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            error: error.message,
        },{
            status: error.httpCode||500
        })
    }
}