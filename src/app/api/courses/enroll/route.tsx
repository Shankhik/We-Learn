import { header } from "@/lib/headers";
import { addEnrolledCourse, findEnrolledCourse } from "@/mongoDB/usercourses";
import { status } from "@/types/statusType";
import { NextRequest, NextResponse } from "next/server";

type ReqData = {
    username: string;
    courseId: string;
}
export async function POST(req:NextRequest):Promise<NextResponse<status>> {
    const origin = req.headers.get('origin');
    var res:status;
    const {username, courseId} = await req.json() as ReqData;
    const history = await findEnrolledCourse(username, courseId);
    
    //if not enrolled
    if (!history.courseHistory && !history.error){
        res = await addEnrolledCourse(username,courseId);
        if (res.status && !res.error){
            res = {
                status: true,
                message:`Enrolled in ${courseId}`,
                courseHistory: res.courseHistory
            }
        }
    } 
    else res = {
        status: false,
        message: `Already enrolled in ${courseId}`,
        courseHistory: history.courseHistory
    }
    
    return NextResponse.json(res,{
        status: 200,
        headers: header(origin)
    })
}