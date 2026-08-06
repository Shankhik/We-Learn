import { NextRequest, NextResponse } from "next/server";

type ReqData = {
    email: "otp"|"welcome", subject: string,
    otp: string, username: string, purpose: string
}
export default async function POST (req: NextRequest): Promise<NextResponse<Status>>{
    try {
        const reqBody: ReqData = await req.json();
        return NextResponse.json({
            status: true,
            message: `Email "${reqBody.subject}" sent to : ${reqBody.username}`
        })
    } catch (error: any) {
        return NextResponse.json({
            status: false,
            error: error.message
        },{
            status: error.httpCode || 500
        });
    }
}
// const HandleOTP = async (
//     username?: string, otp?: string, purpose?: string
// )=>{
//     if (!username || !otp || !purpose )
//         throw new ApiError("Bad Email[OTP] request",{httpCode:400})
// }