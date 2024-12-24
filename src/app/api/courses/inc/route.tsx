import { header } from "@/lib/headers";
import { incCompletedUpto } from "@/mongoDB/usercourses";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin')
    const reqData: {username: string; courseId: string} = await req.json()
    const res = await incCompletedUpto(reqData.username, reqData.courseId);
    return NextResponse.json(res, {
        status: 200,
        headers: header(origin)
    })
}