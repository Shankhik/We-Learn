import { httpStatusCode } from "@/lib/fetchReq";
import { ApiError, getReqData } from "@/lib/serverUtils/apiError";
import { jsonParse } from "@/lib/serverUtils/jsonParsor";
import { mongoCollection } from "@/mongoDB/operations";
import { enroll } from "@/mongoDB/userTrack";
import { NextRequest, NextResponse } from "next/server";

import type { AuthToken } from "@/types/tokenType";

// Middleware Protected
export const POST = async (req:NextRequest): Promise<NextResponse<Status>>=>{
    try {
        const userDetails = jsonParse<AuthToken>(req.headers.get("x-user-details"),{
            check: "username"
        })

        if (userDetails.error) throw new ApiError("Bad User Details header",{
            httpCode: 400 // Bad Request
        });

        const reqData = await getReqData<{
            courseId: string
        }>(req);
        
        if (reqData.error) throw reqData.error;
        const collection = mongoCollection('Courses')?.collection!;

        const price = (await collection.findOne({courseId: reqData.data?.courseId},{
            projection: {
                _id: 0, price:1
            }
        }))?.price;

        if (!price) throw new ApiError("Course not found!",{
            httpCode: httpStatusCode['bad-request']
        });

        if (price.cost>0 && process.env.NODE_ENV==='development')
            throw new ApiError("Purchase feature hasn't been implemented yet!",{
            httpCode: 501
        });
        
        const enrollRes = await enroll(
            userDetails.data?.username,
            reqData.data?.courseId
        )
        if (!enrollRes.acknowledged) throw new ApiError ("Couldn't enroll user in the course",{
            httpCode: 409 // conflict
        });

        // throw new ApiError("Method not implemented yet!",{
        //     httpCode: httpStatusCode["not-implemented"]
        // });
        
        return NextResponse.json({
            status: true,
            message: "Enrollment successfull!",
        })
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            error: error.message||"",
        },{
            status: error.httpCode||500
        })
    }
}
