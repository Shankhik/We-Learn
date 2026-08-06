import { ApiError } from "@/lib/serverUtils/apiError";
import { parseReqJson } from "@/lib/serverUtils/jsonParsor";
import { NextRequest, NextResponse } from "next/server";

import { checkUsername } from "@/lib/purify/check";
import mongoCollection from "@/lib/mongodb/collection";

type ReqData = {
    username?: string
}
export async function POST(req: NextRequest): Promise<NextResponse<Status>> {
    try {
        const type = req.nextUrl.searchParams.get("type")as "username"|null;
        const reqData = await parseReqJson<ReqData>(req);
        
        if (!reqData) throw new ApiError("Bad request data!",{httpCode: 400});

        switch(type){
            case "username":
                return await handleUsername(reqData.username);
            default:
                throw new ApiError("Can't handle the request",{
                    httpCode: 400
                });
        }
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            error: error.message
        },{
            status: error.httpCode || 500
        });
    }
}

const handleUsername = async(username?: string):Promise<NextResponse<Status>> =>{
    try {
        if (!username) throw new ApiError("Missing username attribute!",{
            //httpCode: 400
        });

        // Invalid Format Checker
        if (!checkUsername(username)) throw new ApiError(
            "Username can't be empty nor can it contain whitepaces. \nIt can only contain (a-z) (A-Z) (0-9) \- _ @ # $ % & *",{
            httpCode: 400
        });

        // Check Username Availabilty from DB
        const { collection } = await mongoCollection("Users")
        const userExists = await collection.countDocuments({
            username,
            // Prevents from pulling old accounts
            createdAt: { $exists: true }
        });

        if ( userExists !== 1) throw new ApiError(
            "Username does't exists!", {httpCode: 404}
        );

        return NextResponse.json({
            status: true,
            message: "Username exists!"
        });
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            error: error.message
        },{
            status: error.httpCode || 500
        });
    }
}

const handlePassword = async(password: string)=>{
    try {
        
    } catch (error:any) {
        
    }
}