import { NextRequest, NextResponse } from "next/server";
import { header } from "@/lib/headers";
import { status } from "@/types/statusType";
import { mongoServer } from "@/mongoDB/mongoServer";
import { Course } from "@/types/databaseTypes";


export async function POST(req: NextRequest): Promise<NextResponse<status>> {
    const origin = req.headers.get("origin")
    const params = searchParams(req.url)

    try {
        if(!params || !params['page'] || !params['limit']) throw new Error('Missing Params');

        const db = mongoServer.db('E-Learning');
        const courses = db.collection('courses');

        const allCourses = await courses.find({})
        .skip(Number(params['limit'])*(Number(params['page'])-1))
        .limit(Number(params['limit']))
        .toArray() as Course[];

        return NextResponse.json({
            status:true,
            message: 'fetched few',
            courses: allCourses
        },{
            status:200,
            headers: header(origin)
        })
    } catch (error:any) {
        return NextResponse.json({
            status:false,
            message: error.message
        },{
            status:500,
            headers: header(origin)
        })
    }
}

function searchParams (url:string){
    const urlObject = new URL(url)
    const params = urlObject.searchParams

    if(params.size===0) return null;

    let data: Record<string, string> = {}

    params.forEach((param, key)=>{
        Object.defineProperty(data,key,{
            value: param,
            writable:true,
            enumerable:true,
            configurable:true
        })
    })
    
    return data
}