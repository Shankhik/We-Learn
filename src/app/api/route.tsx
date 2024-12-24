import { header } from "@/lib/headers";
import { findUsers } from "@/mongoDB/users";
import { status } from "@/types/statusType";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse<status>>{
    const origin = req.headers.get('origin');
    //const host = req.headers.get('host');
    const status = await findUsers();
    //console.log('origin: '+ origin);
    //console.log('host: '+ host);
    return NextResponse.json(status,{
        status: 200,
        headers: header(origin)
    })
}