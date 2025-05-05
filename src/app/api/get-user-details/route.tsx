import { header } from "@/lib/headers";
import { NextRequest, NextResponse } from "next/server";
import { getUserDetails } from "@/mongoDB/users";
import { status } from "@/types/statusType";
type ReqData = {
    username: string;
}
export async function POST (req: NextRequest): Promise<NextResponse<status>>{
    const origin = req.headers.get('origin')
    const reqData = (await req.json()) as ReqData;
    try {
        const userData = (await getUserDetails(reqData.username)).user
        
        // if user isnt found
        if(!userData) {
            return NextResponse.json({
                status: false,
                message: 'No User Found'
            },{
                status: 200, headers: header(origin)
            }) 
        }

        return NextResponse.json({
            status: true,
            message: 'Found UserDetails',
            user: userData
        },{
            status: 200, headers: header(origin)
        })
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            error: error.message
        },{
            status:500, headers: header(origin)
        })
    }
}