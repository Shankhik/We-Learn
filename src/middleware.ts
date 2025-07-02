import { NextRequest, NextResponse } from "next/server";
import { status } from "./types/statusType";
import { header } from "./lib/headers";
import { apiLink } from "./lib/fetchReq";

export async function middleware (req:NextRequest){
    const pathname = req.nextUrl.pathname
    
    // Paths thats requires userDetails
    if(
        pathname.startsWith('/api/courses') ||
        pathname.startsWith('/api/upload') ||
        pathname === '/api/update-user-details'
    ){
        // Getting Cookie
        const auth = req.cookies.get('authToken')?.value

        // If Cookie is found
        if(auth){
            // Verifying the JWT cookie
            const res = await (await fetch(apiLink('jwt/verify'),{
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
            status: 401, headers: header(req.headers.get('origin'))
        })
    }

    return NextResponse.next()
}

const protectedApiRoutes = async (req:NextRequest) =>{
    
}