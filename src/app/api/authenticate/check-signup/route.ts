import { ApiError } from "@/lib/serverUtils/apiError";
import { parseReqJson } from "@/lib/serverUtils/jsonParsor";
import { NextRequest, NextResponse } from "next/server";
import {
    createSession, emailExists, getHashField, getSessionId, updateSession, usernameExists
} from "../utils";

import { 
    checkUsername as checkUsernameRegex,
    checkPassword as checkPasswordRegex,
    checkEmail as checkEmailRegex 
} from "@/lib/purify/check";

import { bcryptCompare, bcryptHash } from "@/lib/bcrypt";
import { generateOTP } from "@/lib/otp";
import { sendEmail } from "@/lib/email_legacy";

import OTPEmail from "@/react-emails/_OTPEmail";
import { timingsInMinutes } from "@/lib/time";
import { serverLog } from "@/lib/colorText2";

type ReqData = {
    username?: string,
    password?: string,
    email?: string,
    otp?: string
}

type TypeSeachParam = "username"|"password"|"email"|null

// -> in seconds
const expireTime = timingsInMinutes.signupSessionJwt * 60
const isDev = process.env.NODE_ENV!=="production";

export const POST = async (req: NextRequest): Promise<NextResponse<Status>>=>{
    try {
        const type = req.nextUrl.searchParams.get("type") as TypeSeachParam
        const reqData = await parseReqJson<ReqData>(req);
        
        if(!reqData) throw new ApiError("Invalid request data",{
            httpCode: 400
        })

        
        // Fetch Session ID from Cookies or create new
        const sessionCookie = req.cookies.get("SIGNUP_SESSION")?.value
        const sessionId = (await getSessionId(sessionCookie))?.sessionId

        switch (type){
        case 'username':
            return await handleUsername(sessionId, reqData.username)
        case 'password':
            return await handlePassword(sessionId, reqData.password)
        case 'email':
            return await handleEmail(sessionId, reqData.email, reqData.otp)
        default:
            throw new ApiError("Couldn't handle the request!")
        }
    } catch (error: any) {
        return NextResponse.json({
            status: false,
            error: error.message
        } satisfies Status, {
            status: error.httpCode||500
        })
    }
}

const handleUsername = async (
    sessionId: string|undefined,
    username: string|undefined
): Promise<NextResponse<Status>> => {
    try {
        // Username Validity Check
        if (username===undefined || !checkUsernameRegex(username))
        throw new ApiError("Invalid Username",{ httpCode: 400 });

        // Searching username in Redis
        let isFound = await usernameExists(username,"redis");
        
        // Error Check:
        // 1. Internal server error
        if (typeof isFound === "string") throw new ApiError("Something went wrong!",{
            httpCode: 500
        });
        if (isFound){
            if (sessionId){
                // Checking session id from cookie
                const data = await getHashField(sessionId,"username");
                
                // handles error:
                // 1. Session not found
                // 2. Interval server error
                if (data.error) throw new ApiError(data.error,{
                    httpCode: 500
                });

                const existingUsername = data.data;
                
                if (existingUsername &&
                    username === existingUsername
                ) isFound = false;
            }
        } else{
            // Searching username in MongoDB
            isFound = await usernameExists(username,"mongodb");
            // Error Check
            // 1. Internal Server Error
            if (typeof isFound === "string")
            throw new ApiError("Something went wrong!",{
                httpCode: 500
            });
        }
        
        if (isFound) {
            return NextResponse.json({
                status: false,
                message: "Username is unavailable"
            },{
                status: 404
            })
        } else {
            let mainError: ApiError|undefined = undefined;
            try{
                // Trying to update Session Data
                if (!sessionId) throw new Error("Creating a new Session");

                const res = await updateSession(sessionId,{
                    username
                });
                if (typeof res === "string"){ // note: may need to add <null> check
                    mainError = new ApiError(res);
                    throw new Error (res)
                }

                return NextResponse.json({
                    status: true,
                    message: "Username available"
                })

            }
            // If updating fails -> creating a new Session
            catch(error: any){
                
                // For catching serious errors [like err 500]
                if (mainError) throw mainError;
                
                // Creating new Session
                const creationRes = await createSession({
                    username
                },expireTime);

                // Something went wrong
                if(!creationRes.status || !creationRes.token)
                    throw new ApiError(
                        creationRes.error
                        || creationRes.message
                        || "Something went wrong. Please try again later!"
                    );

                const response = NextResponse.json({
                    status: true,
                    message: "Username available",
                });
                
                response.cookies.set('SIGNUP_SESSION',creationRes.token,{
                    path:"/",
                    maxAge: expireTime,
                    secure: !isDev, 
                    sameSite: !isDev?"strict":"lax",
                    httpOnly: true,
                })
                return response;
            }
        }
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            error: error.message
        },{
            status: error.httpCode || 500
        })
    }
}

const handlePassword = async(
    sessionId: string|undefined,
    password: string|undefined
)=>{
    try {
        if (!sessionId) throw new ApiError("Session may have expired!");

        // Checking Password Validity
        if (!password || !checkPasswordRegex(password)) throw new ApiError("Invalid Password",{
            httpCode: 400
        });

        const hashedPassword = (await bcryptHash(password)).hashed!

        const res = await updateSession(sessionId,{password: hashedPassword});
        
        if (res === null) return NextResponse.json({
            status: true,
            message: "Password Invalid"
        })

        // Error catching for:
        // 1. Session not found.
        // 2. Any Internal Errors.
        if (typeof res === "string") throw new ApiError(res);
        
        return NextResponse.json({
            status: true,
            message: "Password Valid"
        })
    } catch (error:any) {
        // serverLog("failed","signup error",{},error.message)
        return NextResponse.json({
            status: false,
            error: error.message
        },{
            status: error.httpCode || 500
        })
    }
}

const handleEmail = async (
    sessionId: string|undefined,
    email: string|undefined,
    otp: string|number|undefined
): ReturnType<typeof POST>=>{
    try {
        if (!sessionId) throw new ApiError("Session may have expired!",{
            httpCode: 500
        });

        if (otp) {
            otp = String(otp);
            
            let sessionHashedOtp = (await getHashField(sessionId,"otp")).data as string|undefined;

            if (!sessionHashedOtp || sessionHashedOtp==="0") throw new ApiError(
                "Session may have ended!",{
                httpCode: 500
            });

            const isVerified = (await bcryptCompare(otp, sessionHashedOtp)).status

            if (!isVerified) {
                // resets Verified
                await updateSession(sessionId,{
                    verified:0
                });
                return NextResponse.json({
                    status: false,
                    message: "Incorrect OTP"
                }, {
                    status: 404
                });
            }

            await updateSession(sessionId,{
                verified:1
            });

            return NextResponse.json({
                status: true,
                message: "OTP verified"
            });

        } else {
            if (!email || !checkEmailRegex(email)) throw new ApiError("Invalid Email Address",{
                httpCode: 400
            });

            const alreadyInUse = await emailExists(email);
            if (typeof alreadyInUse === "string") throw new ApiError(alreadyInUse);
            
            if (alreadyInUse){
                const sessionEmail = (await getHashField(sessionId, "email")).data;
                if (sessionEmail !== email) {
                    serverLog("message","email",{
                        symbolColor:"red"
                    }, `${email} is already taken`);
                    throw new ApiError("Email is already taken",{
                        httpCode: 404
                    });
                }
            } 

            const newOtp = generateOTP()
            const hashedOtp = (await bcryptHash(newOtp)).hashed!

            // Setting OTP
            const res = await updateSession(sessionId,{
                otp: hashedOtp,
                email: email,
                verified: 0
            });

            if (process.env.NODE_ENV==='production')
                sendEmail(
                    OTPEmail({title: "Signup Verification", otp: newOtp}),
                    email, "Signup Verification"
                );
            else serverLog("message","otp",{color:"yellow"},`${newOtp} | ${email} | ${sessionId}`);
            
            return NextResponse.json({
                status: true,
                message: "Email Sent",
            });
        }

    } catch (error:any) {
        return NextResponse.json({
            status: false,
            error: error.message
        },{
            status: error.httpCode||500
        })
    }
}
