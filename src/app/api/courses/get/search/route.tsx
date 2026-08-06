import { mongoCollection } from "@/mongoDB/operations";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest):Promise<NextResponse<Status>> {
    try {
        // throw new ApiError("Method not implemented",{
        //     httpCode: httpStatusCode['not-implemented']
        // })
        // Auto decoded query
        const query = req.nextUrl.searchParams.get('keyword');
        const dbCollection = mongoCollection('Courses')?.collection!;

        const findRes = await dbCollection.find({
            courseName:{$regex:query??"",$options:'i'}
        },{
            projection:{
                _id: 0,
                courseId: 1,
                courseName: 1, skills: 1,
                author: 1, images: 1
            }
        }).toArray();

        return NextResponse.json({
            status: true,
            message: "method not implemented yet",
            courses: findRes,
        },{
            status: 200
        })
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            error: error.message,
        },{
            status: error.httpCode,
            statusText: error.httpCode === 501?
            "Ruko Zara Sabar Karo":undefined
            //"Ruko Zara, Sabar Karo"
        })
    }
}