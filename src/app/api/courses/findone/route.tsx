import { header } from "@/lib/headers";
import { findCourse } from "@/mongoDB/courses";
import { NextRequest, NextResponse } from "next/server";

type Request = {
    courseId: string;
    courseName?:string;
}
export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    const courseQuery:Request = await req.json();
    const status = await findCourse(courseQuery);
    return NextResponse.json(status,{
        status:200,
        headers: header(origin)
    })
}


