import { header } from "@/lib/headers";
import { findAllCourses } from "@/mongoDB/courses";
import { status } from "@/types/statusType";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest):Promise<NextResponse<status>> {
    try {
        const response = await findAllCourses();
        return NextResponse.json(response,{
            status:200,
            headers: header(req.headers.get('origin'))
        })
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            error: error.message
        },{
            status:500,
            headers: header(req.headers.get('origin'))
        })
    }
    
}