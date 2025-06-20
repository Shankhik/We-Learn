import { NextRequest, NextResponse } from "next/server";
import { status } from "./types/statusType";
import { header } from "./lib/headers";

export async function middleware (req:NextRequest){
    const pathname = req.nextUrl.pathname
    const origin = req.headers.get('origin')

    // Paths thats requires userDetails
    if(
        pathname.startsWith('/api/courses') ||
        pathname.startsWith('/api/upload') ||
        pathname === '/api/update-user-details'
    ){
        const auth = req.cookies.get('authToken')?.value
        
        if(auth){
            const res = await (await fetch(`${req.nextUrl.origin}/api/jwt/verify`,{
                method:'POST',
                body:JSON.stringify({
                    token: auth
                })
            })).json() as status
            if (res.decoded) {
                req.headers.set("x-user-details", JSON.stringify(res.decoded))
                return NextResponse.next({
                    request:{
                        headers: req.headers,
                    }
                })
            }
        }

        // By default will Reject
        return NextResponse.json({
            status: false,
            error:'Unauthorized!'
        },{
            status: 401, headers: header(origin)
        })
        
    }

    return NextResponse.next()
}