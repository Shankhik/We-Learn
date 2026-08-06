import { bcryptCompare } from "@/lib/bcrypt";
import { signToken } from "@/lib/jwt";
import { ApiError } from "@/lib/serverUtils/apiError";
import { parseReqJson } from "@/lib/serverUtils/jsonParsor";
import mongoCollection from "@/lib/mongodb/collection";
import { NextRequest, NextResponse } from "next/server";
import { setAuthCookie } from "../utils";
import { serverLog } from "@/lib/colorText2";
import { timingsInMinutes } from "@/lib/time";

type ReqData = {
    username?: string, password?: string
}

function throwUndefinedError<T>(
    value: T | null | undefined,
    valueName: string,
    httpCode = 400,
    options?: {
        callback?: ()=> any   
    }
): asserts value is T {
    if (!value) {
        if (options?.callback)
            options.callback();
        throw new ApiError(`${valueName} not found!`,{
            httpCode
        });
    }
}

export async function POST(req: NextRequest): Promise<NextResponse<Status>> {
    try {
        const reqData = await parseReqJson<ReqData>(req);
        throwUndefinedError(reqData,"Request-data");
        
        // Incomplete data check
        if (!reqData.password || !reqData.username) throw new ApiError(
            "Username or Password not found!",{ httpCode: 400 }
        );

        const { collection } = await mongoCollection("Users");
        //const coll = mongoCollection('Users')?.collection!

        // Find User Document [with _id]
        const userAccount = await collection.findOne({
            username: reqData.username,
            createdAt: {
                $exists: true
            }
        }, {
            projection: {
                _id: 1, username: 1, password: 1,
                admin: 1,
                // _id: 0
            }
        });
        
        // If User Document is not found
        throwUndefinedError(userAccount,"User account", 404)
        
        // Check Password
        if (!(await bcryptCompare(reqData.password, userAccount.password)).status){
            throw new ApiError("Incorrect Password.",{
                httpCode: 417 // expectation failed
            });
        }

        // Creating Token
        const token = (await signToken({
            _id: userAccount._id.toString(),
            username: userAccount.username,
            admin: userAccount.admin || false
        },timingsInMinutes.jwt)).token!;

        const response = NextResponse.json({
            status: true,
            message: "Login Successfull"
        } satisfies Status);

        // Add Auth Cookie
        setAuthCookie(response, token);

        serverLog("success","login",{},userAccount.username);
        
        return response;

    } catch (error:any) {
        return NextResponse.json({
            status: false,
            error: error.message
        },{
            status: error.httpCode || 500
        });
    }
}