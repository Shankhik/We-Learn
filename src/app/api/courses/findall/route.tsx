import { header } from "@/lib/headers";
import { findAllCourses } from "@/mongoDB/courses";
import { status } from "@/types/statusType";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const origin = req.headers.get('origin');
    const paramSearch = req.nextUrl.searchParams
    const params = {
        page: paramSearch.get('page')? Number(paramSearch.get('page')):undefined,
        limit: paramSearch.get('limit')? Number(paramSearch.get('limit')):undefined,
    }
    try {
        const status = await findAllCourses({
            skip: params.page && params.limit ? (params.page-1)*params.limit : undefined,
            limit: params.limit || undefined,
        })
        return NextResponse.json(status,{
            status:200,
            headers: header(origin)
        })
    } catch (error:any) {
        return NextResponse.json({
            status: false, error: error.message
        },{
            status:500,
            headers: header(origin)
        })
    }
    
}