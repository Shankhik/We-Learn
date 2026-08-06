import { NextResponse, NextRequest } from "next/server";
import { ApiError } from "@/lib/serverUtils/apiError";
import { getSessionData, getSessionId } from "../utils";

export async function GET (req: NextRequest): Promise<NextResponse<Status>> {
    try {
        const sessionCookie = req.cookies.get("SIGNUP_SESSION")?.value;
        if (!sessionCookie) throw new ApiError("Session not found",{
            httpCode: 500
        });
        
        const sessionId = (await getSessionId(sessionCookie))?.sessionId;
        if (!sessionId) throw new ApiError("Session not found");
        
        const sessionData = await getSessionData(sessionId);

        if (!sessionData) throw new ApiError("Session not found");
        
        return NextResponse.json({
            status: true,
            message: "Session Fetched",
            data: sessionData
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