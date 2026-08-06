import { ApiError } from "@/lib/serverUtils/apiError";
import { NextRequest, NextResponse } from "next/server";
import { getSessionId, getSessionData, setAuthCookie } from "../utils";
import { parseReqJson } from "@/lib/serverUtils/jsonParsor";
import { bcryptCompare } from "@/lib/bcrypt";

// Regex Checker
import { checkUsername, checkEmail, checkPassword } from "@/lib/purify/check";

// Types
import { signToken } from "@/lib/jwt";
import { timingsInMinutes } from "@/lib/time";
import { createTrack } from "@/mongoDB/userTrack";
import { addUser, checkAdmin } from "@/mongoDB/users";
import { serverLog } from "@/lib/colorText2";
import mongoCollection, { DbCollections } from "@/lib/mongodb/collection";

function throwError<T>(
    value: T | null | undefined,
    message = "No signup-session found!",
    httpCode = 500,
    options?: {
        callback?: ()=> any   
    }
): asserts value is T {
    if (!value) {
        if (options?.callback)
            options.callback();
        throw new ApiError(message,{
            httpCode
        });
    }
}
// Rate limiter flexible;


export async function POST(req:NextRequest):Promise<NextResponse<Status>> {
    try {
        const sessionCookie = req.cookies.get("SIGNUP_SESSION")?.value;
        throwError(sessionCookie);

        const sessionId = (await getSessionId(sessionCookie))?.sessionId;
        throwError(sessionId);
        
        type ReqData = { password: string }
        const reqData = await parseReqJson<ReqData>(req);
        throwError(reqData, "Password not found!", 400);
        
        // boolean -> found / not-found;
        let incompleteDataFound:boolean = false;
        const sessionData = await getSessionData(sessionId,true);

        type DataKeys = keyof typeof sessionData;
        
        for (const key in sessionData){
            if(sessionData[key as DataKeys]===0){
                incompleteDataFound = true;
                break;
            }
        }
        
        if (!sessionData || incompleteDataFound) throw new ApiError("Signup session may have expired!");

        // A secondary data check
        if (!(await bcryptCompare(reqData.password,String(sessionData.password))).status){
            throw new ApiError("Password doesn't match with the session password");
        }
        
        const currentDate = new Date();

        const userDocument: DbCollections['Users'] = {
            username: sessionData.username as string,
            displayName: sessionData.username as string,
            password: sessionData.password as string,
            email: sessionData.email as string,
            profilePicture: null,
            admin: checkAdmin(sessionData.username as string, sessionData.password as string),
            
            createdAt: currentDate,
            lastUpdate: {
                username: currentDate,
                password: currentDate,
                email: currentDate,
                displayName: currentDate,
            }
        };

        /* - - - - - - - - - - Old - - - - - - - - - - */
        // Creating User Track Record
        // await createTrack(userDocument.username);
        /* - - - - - - - - - - - - - - - - - - - - - - */

        // Creating User
        const { collection } = await mongoCollection("Users");
        const insertionRes = await collection.insertOne(userDocument);

        //const insertionRes = await addUser(userDocument);

        const token = (await signToken({
            // _id: insertionRes.documentId, // Old
            _id: insertionRes.insertedId.toString(),
            username: userDocument.username,
            admin: userDocument.admin
        },timingsInMinutes.jwt)).token!;

        // Implement -> Send Email Confirmation

        const response = NextResponse.json({
            status: true,
            message: "Signup Successfull",
            data: sessionData
        });

        setAuthCookie(response, token);

        serverLog("success","signup",{}, userDocument.username);

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