import { header } from "@/lib/headers";
import { updateUserDetails } from "@/mongoDB/users";
import { User } from "@/types/databaseTypes";
import { NextRequest, NextResponse } from "next/server";
type ReqData = {
    username: string,
    fields: {
        [key in keyof User]: any
    }
}
export async function POST (req: NextRequest):Promise<NextResponse<Status>>{
    const origin = req.headers.get('origin')
    const {username, fields} = await req.json() as ReqData
    
    try {
        const res = await updateUserDetails( username, fields )
        return NextResponse.json(res,{
            status: 200,
            headers: header(origin)
        })
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            error: error.message
        },{
            status:500,
            headers: header(origin)
        })
    }
}