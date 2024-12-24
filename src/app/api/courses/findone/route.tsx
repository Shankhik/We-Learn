import { header } from "@/lib/headers";
import { findAllCourses, findCourse } from "@/mongoDB/courses";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    const courseQuery:{courseId: string; courseName?:string;} = await req.json();
    const status = await findCourse(courseQuery);
    return NextResponse.json(status,{
        status:200,
        headers: header(origin)
    })
}


