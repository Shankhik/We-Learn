import { header } from "@/lib/headers";
import { findAllCourses } from "@/mongoDB/courses";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
    const origin = req.headers.get('origin');
    const status = (await findAllCourses());
    return NextResponse.json(status,{
        status:200,
        headers: header(origin)
    })
}