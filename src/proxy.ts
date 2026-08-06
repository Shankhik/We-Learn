import { NextRequest, NextResponse } from "next/server";

import { jwtVerify } from "jose";

import type { JWTPayload, JWTVerifyResult } from "jose";
import type { AuthToken } from "./types/tokenType";

type PathDetails = { route: string, onlyAdmin?: boolean }
type SecurePaths = {
    api: PathDetails[],
    page: PathDetails[]
}

const protocol = process.env.NODE_ENV === "development"? "http": "https";
const generateAbsRoute = (host:string, pathname: string)=>{
    return `${protocol}://${host}${pathname}`
}
const securePaths: SecurePaths = {
    /* IMP: Add ' / ' at the end for 'start-with' paths */
    api: [
        { route: "/api/admins-only/" , onlyAdmin: true},
        { route: "/api/courses/" },
        { route: "/api/upload/" },
        { route: "/api/update-user-details" },
        { route: "/api/user/" },
    ] ,
    page: [
        { route: "/home/"},
        { route: "/admin-panel", onlyAdmin: true },
        { route: "/admin-panel/", onlyAdmin: true },
    ]
}

const removeCookie = (cookies: string|null, replaceCookie: string = 'AUTH_TOKEN')=>{
    if(!cookies) return "";
    return cookies?.split(";").map(c=> c.trim())
    .filter(c=> !c.startsWith(`${replaceCookie}=`))
    .join("; ");
}

const verifyToken = async (
    token: string | undefined | null
) =>{
    try {
        if (!token) throw new Error("Bad Token");
        const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
        
        const result = await jwtVerify(token,secret);

        // Wont need it as it will throw an error is failed
        if (!result.payload) return null;

        return result.payload as AuthToken|null;
    } catch (error:any) {
        return null;
    }
}

export default async function proxy (req: NextRequest){
    const auth = {
        cookie: req.cookies.get("AUTH_TOKEN")?.value,
        header: req.headers.get("authorization")?.slice(7)
    }

    // Appending pathname
    req.headers.append("x-pathname", req.nextUrl.pathname)
    
    // Appendind auth token without 'Bearer'
    if (auth.header)
        req.headers.set("authorization", auth.header);
    else if (auth.cookie)
        req.headers.set("authorization", auth.cookie);

    // Deleting AUTH_TOKEN cookie
    req.headers.set(
        "cookie",
        removeCookie(req.headers.get("cookie"))
    );

    const userCredential = await verifyToken(auth.header || auth.cookie)

    // if (req.nextUrl.pathname === "/")
    //     console.log(userCredential)
    // [ Appends | Deletes ] token-credential
    if (userCredential)
        req.headers.append("x-user-details", JSON.stringify(userCredential));
    else req.headers.delete("x-user-details");

    let securePath = securePaths.page.find(p => (
        req.nextUrl.pathname === p.route ||
        req.nextUrl.pathname.startsWith(p.route)
    )) || securePaths.api.find(p =>(
        req.nextUrl.pathname === p.route ||
        req.nextUrl.pathname.startsWith(p.route)
    ));

    // For Api Routes
    if (securePath?.route.startsWith("/api")){
        if (!userCredential || (securePath.onlyAdmin && !userCredential.admin))
            return NextResponse.json({
                status: false,
                error: userCredential
                    ? "Authorization Failed"
                    : "Authentication Failed"
            } satisfies Status,{
                status: 401
            }
        );
    }
    // For Pages Routes
    else if(securePath){
        if (!userCredential)
        return NextResponse.redirect(
            generateAbsRoute(
                req.headers.get("host")!,
                `/auth/login?redirect=${encodeURIComponent(req.nextUrl.pathname)}`
            )
        );

        else if (securePath.onlyAdmin && !userCredential.admin )
        return NextResponse.rewrite(
            generateAbsRoute(
                req.headers.get("host")!,
                "/unauthorized?note=ACCESS&reason=ADMINS ONLY"
            )
        );
    }
    
    return NextResponse.next({
        request: { headers: req.headers }
    });
}
// export async function proxy1 (req:NextRequest){

//     const pathname = req.nextUrl.pathname;
//     // Forwards pathname for server components/actions
//     req.headers.set("x-pathname", pathname);
    
    
//     // Need to check exact path first; then a child route
//     let securePath = securePaths.api.find(p => (
//         pathname === p.route ||
//         pathname.startsWith(p.route)
//     )) || securePaths.page.find(p =>(
//         pathname === p.route ||
//         pathname.startsWith(p.route)
//     ));
    
//     // If non-secure path: just forward
//     if (!securePath) return NextResponse.next({
//         request:{
//             headers: req.headers,
//         },
//     });

//     /* - - -- - - - - - - Security Check - - -- - - - - - - */

//     const reqData = {
//         authCookie: req.cookies.get('AUTH_TOKEN')?.value,
//         // Should be without 'Bearer'
//         authHeader: req.headers.get("authorization")
//     }

//     // If authorization header is found
//     if (reqData.authHeader){
//         // Removing "Bearer"
//         reqData.authHeader = reqData.authHeader.slice(7);
//         // No need to append to req header
//     } else{
//         if (reqData.authCookie){
//             // Sets just token
//             reqData.authHeader = reqData.authCookie
//         };
//     }

//     const payload = await verifyToken(reqData.authHeader) as AuthToken|null;
//     // console.log(payload)
//     // For API Routes
//     if (securePath.route.startsWith("/api")){

//         // Checks: Authentication | Authorization 
//         if (!payload || (securePath.onlyAdmin && !payload.admin)) {
//             return NextResponse.json({
//                 status: false,
//                 message: !payload
//                     ? "You need to authenticate first."
//                     : "You are not authorized for this action.",
//                 error: 'Unauthorized!'
//             },{
//                 status: 401,
//             })
//         }
//     }

//     // For Page Routes
//     else{
        
//         // If not authenticated
//         if (!payload)
//             return NextResponse.redirect(generateAbsRoute(
//                 req.headers.get("host")||"",
//                 `/auth/login?redirect=${encodeURIComponent(pathname)}`
//             ));

//         // if not an Admin
//         if (!payload.admin && securePath.onlyAdmin)
//             return NextResponse.rewrite(
//                 generateAbsRoute(req.headers.get("host")!,
//                 "/unauthorized?note=ACCESS&reason=ADMINS ONLY"
//             ),{
//                 // status: 401 // Won't work -> breaks routing
//             });
//     }
    
//     // Adds user-details header
//     req.headers.set("x-user-details",JSON.stringify(payload));

//     // Appends "Authorization" header for secure paths
//     // req.headers.set("Authorization",`Bearer ${reqData.authHeader}`)

//     // Removes Auth header
//     req.headers.delete("Authorization");

//     // Removes cookie header for api routes
//     if (pathname.startsWith("/api"))
//         req.headers.delete("Cookie");

//     // Forwards with auth and user-details headers
//     return NextResponse.next({
//         request:{
//             headers: req.headers,
//         }
//     })    
// }

