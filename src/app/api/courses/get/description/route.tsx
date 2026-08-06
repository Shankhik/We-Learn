import { NextRequest, NextResponse } from "next/server";
import { mongoCollection } from "@/mongoDB/operations";
import { httpStatusCode } from "@/lib/fetchReq";
import { ApiError } from "@/lib/serverUtils/apiError";
import { jsonParse } from "@/lib/serverUtils/jsonParsor";

import type { AuthToken } from "@/types/tokenType";

// Middleware Protected
export async function GET (req: NextRequest):Promise<NextResponse<Status>> {
    
    const courseId = req.nextUrl.searchParams.get('id');
    
    const userDetails = jsonParse<AuthToken>(req.headers.get("x-user-details"),{
        check: "username"
    });

    try {
        /* |||||||||||||||||||||| Bad Request checks |||||||||||||||||||||| */
            
            /* Bad search params */
        if(!courseId) throw new ApiError (`Search param 'id' is missing`,{
            // Bad Request
            httpCode: 400
        });

            /* No/Bad x-user-details */ 
        if(userDetails.error) throw new ApiError ("Bad User Details",{
            // Bad Request
            httpCode: 400,
        });
        
        /* |||||||||||||||||||| Collecting Data from DB |||||||||||||||||||| */
        
        const courseCollection = mongoCollection('Courses')?.collection!
        const course = await courseCollection.findOne({
            courseId
        },{
            projection:{
                _id: 0, "modules.blocks":0,
                //description:0
            }
        })
        // console.log(c)
        // const courses = await courseCollection.aggregate([
        //     {$match: {
        //         courseId
        //     }},{
        //         $addFields:{
        //             modules: {
        //                 $map: {
        //                     input:"$modules",
        //                     as: "module",
        //                     in: {
        //                         title: "$$module.title"
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // ]).toArray();

            /* No Course found */
        if (!course) throw new ApiError(`Course '${courseId}' not found!`,{
            httpCode: httpStatusCode["not-found"]
        })

        return NextResponse.json({
            status: true,
            message: `Course[${courseId}] found!`,
            course: course
        });

    } catch (error:any) {
        return NextResponse.json({
            status: false,
            error: error.message
        },{
            status: error.httpCode||500
        })
    }
}