import { header } from "@/lib/headers";
import { updateLastLoaded } from "@/mongoDB/usercourses";
import { status } from "@/types/statusType";
import { NextRequest, NextResponse } from "next/server";
type ReqData ={
    username: string;
    courseId: string;
}
export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin')
    const reqData: ReqData = await req.json()
    const res = await updateLastLoaded(reqData.username,reqData.courseId)
    return NextResponse.json(res,{
        status: 200,
        headers: header(origin)
    })
}