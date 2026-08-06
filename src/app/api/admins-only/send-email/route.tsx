import { sendEmail } from "@/lib/email/sendEmail";
import { checkEmail } from "@/lib/purify/check";
import { ApiError } from "@/lib/serverUtils/apiError";
import { parseReqJson } from "@/lib/serverUtils/jsonParsor";
import { NextResponse, NextRequest } from "next/server";

type ReqDataType = {
    senderName?: string,
    recipient?: string,
    subject?: string,
    html?: string
}
export async function POST (req: NextRequest): Promise<NextResponse<Status>>{
    try {
        const reqData = await parseReqJson<ReqDataType>(req);
        if (!reqData) throw new ApiError("Bad request body.", { httpCode: 400 });
        const {senderName, recipient, subject, html} = reqData;

        // Syntax Check
        if (!recipient || !checkEmail(recipient)){
            throw new ApiError("Invalid recipient email.",{ httpCode: 400 });
        }else if ( !subject || !html ){
            throw new ApiError("Bad email subject or html",{ httpCode: 400 });
        }

        const response = await sendEmail({
            senderName, recipient, subject
        }, html);

        if (!response.status) throw new ApiError((
            response.error||response.message
        )!);

        return NextResponse.json(response);
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            error: error.message,
        },{ status: error.httpCode || 500 });
    }
}