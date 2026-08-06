import OTPEmail from "@/react-emails/_OTPEmail";
import { ReqDataType } from "@/lib/apiReqDataType";
import { bcryptCompare } from "@/lib/bcrypt";
import { createEmailTransport, sendEmail } from "@/lib/email_legacy";
import { timingsInMinutes } from "@/lib/time";
import { createOtp, findOtp, generateOTP } from "@/mongoDB/otps";
import { NextRequest, NextResponse } from "next/server";

// Add Later:
// -> Check existing OTPs of the same type and delete it before issuing
export async function POST(req: NextRequest):Promise<NextResponse<Status>> {
    try {
        const reqBody: ReqDataType['otp'] = await req.json();
        const mode = req.nextUrl.searchParams.get('mode')

        if(!mode) throw new Error("Search query ('mode') not given!");
        
        let issueRes: Status|undefined;
        let findRes: Status|undefined;
        let otpDetails: Status['otp'];
        let response: NextResponse<Status>;

        switch(mode){
        case "issue":
            response = await otpIssue(reqBody)
            break;

        case "verify":
            response = await otpVerify(reqBody);
            break;

        default:
            throw new Error("Search query ('mode') must be 'issue' or 'verify' !")
        }

        return response;

    } catch (error:any) {
        return NextResponse.json({
            status: false, error: error.message
        },{
            status: 500,
        })
    }
}

// For Verifying
const otpVerify = async(reqBody:ReqDataType['otp']) :Promise<NextResponse<Status>>=>{
    if(!reqBody.username || !reqBody.purpose || !reqBody.otp)
        throw new Error("Fields 'username' or 'purpose' missing!");
    
    if(!reqBody.otp) throw new Error("Provide an OTP to verify!");
    
    // Getting OTP
    const findRes = await findOtp(reqBody.username, reqBody.purpose);

    // If OTP details not found
    if (!findRes.otp) return NextResponse.json({
        status: false, message:"No OTP found!"
    });

    // If hashed OTP not found
    if (!findRes.otp.hashedOtp)
        throw new Error("Something went wrong!");

    const samePwd = (await bcryptCompare(reqBody.otp, findRes.otp.hashedOtp)).status
    
    // For incorrect OTP
    if (!samePwd) return NextResponse.json({
        status: false, message:"Incorrect OTP"
    })

    const response = NextResponse.json({
        status: true,
        message: "OTP verified",
    } as Status)

    // Removing Cookies
    response.cookies.set("OTP_PURPOSE","",{maxAge: 0})
    response.cookies.set("OTP_EXP","",{maxAge: 0})

    return response
}

// For Issuing
const otpIssue = async(reqBody:ReqDataType['otp']) :Promise<NextResponse<Status>>=>{
    
    if(!reqBody.username || !reqBody.purpose || !reqBody.email)
        throw new Error("Fields 'username', 'purpose' or 'email' missing!");
    
    // Generating OTP
    const otp = generateOTP(6);

    // Creating OTP document
    const issueRes = await createOtp(otp, reqBody.username,reqBody.purpose);
    
    // If creation fails -> EXIT
    if (!issueRes.otp) throw new Error(issueRes.error||issueRes.message);
    
    // Getting otp details
    const otpDetails = issueRes.otp;
    if(!otpDetails.expiresAt) throw new Error("Couldn't issue OTP!");

    // Sending Email
    await sendEmail(
        <OTPEmail username={reqBody.username}
        otp={otp} purpose="Email Change"/>,
        reqBody.email, `OTP for Verification`,
    )

    // Initializing Response
    const response = NextResponse.json({
        status: true, message: "OTP issued"
    },{
        status: 200
    })

    // Setting Cookies
    // OTP Expire time
    response.cookies.set(
        "OTP_EXP",
        otpDetails.expiresAt.toString() // Number -> Plain String
    ,{
        // converting to seconds
        maxAge: timingsInMinutes.opts * 60,
        path: '/'
    })
    
    // OTP purpose
    response.cookies.set(
        "OTP_PURPOSE",
        otpDetails.purpose
    ,{
        // converting to seconds
        maxAge: timingsInMinutes.opts * 60,
        path: '/'
    })
    return response
    
}