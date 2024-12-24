import { header } from "@/lib/headers";
import { createNewUserHistory, checkCourseHistoryDoc, findEnrolledCourse, addEnrolledCourse } from "@/mongoDB/usercourses";
import { status } from "@/types/statusType";

import { NextRequest, NextResponse } from "next/server";

type ReqData = {
    username: string;
    courseId: string;
}
//const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export async function POST (req: NextRequest):Promise<NextResponse<status>> {
    const origin = req.headers.get('origin');
    const {username, courseId} = await req.json() as ReqData;
    
    //checking if document exists

    /*
    const document = await checkCourseHistoryDoc(username,courseId)
    if ( !document.status && !document.error ){
        //creating document
        await createNewUserHistory(username);
        
    }
    */

    let enrolled = await findEnrolledCourse(username, courseId);

    return NextResponse.json(enrolled,{
        status: 200,
        headers: header(origin)
    })
}