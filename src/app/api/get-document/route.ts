import mongoCollection from "@/lib/mongodb/collection";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { ApiError } from "@/lib/serverUtils/apiError";
export async function GET(req: NextRequest):Promise<NextResponse<Status>> {
    try {
        const { collection } = await mongoCollection('Users');
        const res = await collection.findOne({username: "PeaceKeeperOP"})
        if (!res) throw new ApiError("Document not found", {httpCode: 404});
        

        //console.log(res._id.toString(), `t: ${ res?._id instanceof ObjectId}`);
        
        const t = []
        t.push(res._id);
        t.push(res._id);
        return NextResponse.json({
            status: true,
            data: t
        })
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            error: error.message
        },{
            status: error.httpCode || 500
        })
    }
}