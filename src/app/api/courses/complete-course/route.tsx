import { header } from "@/lib/headers";
import { completeCourse, findEnrolledCourse } from "@/mongoDB/usercourses";
import { status } from "@/types/statusType";
import { NextRequest, NextResponse } from "next/server";
type ReqData = {
    username: string;
    courseId: string;
}
export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    const {username, courseId} = await req.json() as ReqData;
    let res: status
    let courseHistory = (await findEnrolledCourse(username, courseId)).courseHistory;
    const time = {
        hour: courseHistory?.completionDate?.getHours(),
        minute: courseHistory?.completionDate?.getMinutes(),
        second: courseHistory?.completionDate?.getSeconds()
    }
    if (courseHistory?.completionDate===null){
        let ack = await completeCourse(username,courseId)
        res = ack
    }
    else{
        res = {
            status: false,
            message: `${courseId} already completed! [${courseHistory?.completionDate.toDateString()}] [${time.hour}:${time.minute}:${time.second}]`
        }
    }

    return NextResponse.json(res,{
        status: 200,
        headers: header(origin)
    })
}