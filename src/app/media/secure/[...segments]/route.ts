import { serverLog } from "@/lib/colorText2";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const cldName = process.env.CLD_NAME;

type Params = {
    segments: string[]
}

type SearchParams = 'type'

const CLD_COOKIE_NAMES = ['CLD_GENERAL','CLD_COURSE'] as const;
const getAuthCookie = (req: NextRequest) : {
    [key in typeof CLD_COOKIE_NAMES[number]] : string|undefined
}=>{
    return {
        CLD_GENERAL: req.cookies.get('CLD_GENERAL')?.value,
        CLD_COURSE: req.cookies.get('CLD_COURSE')?.value,
    }
}
export const GET = async (
    req: NextRequest,
    { params, 
    // searchParams is not allowed in route handlers
    }: AsyncPageProps<SearchParams, Params>
)=>{
    try {
        const publicId = (await params).segments.join("/")
        
        const searchParams = {
            tokenName : req.nextUrl.searchParams.get('auth') as typeof CLD_COOKIE_NAMES[number] | null,
            mediaType: req.nextUrl.searchParams.get('type') as 'image'|'video'|null,
            version: req.nextUrl.searchParams.get('v'),
            transformations: req.nextUrl.searchParams.get('t')
        }
        
        // If valid auth cookie is not selected
        // if (!CLD_COOKIE_NAMES.includes((searchParams.tokenName??'') as any)){
        //     return NextResponse.json({
        //         status: false, message: "Invalid auth token"
        //     },{status: 404});
        // }

        const AUTH_COOKIE = req.cookies.get(searchParams.tokenName as string ?? '')?.value
        
        if (!AUTH_COOKIE){}
        const urlComponents = {
            t: searchParams.transformations ?? 'f_auto,q_auto',
            v: searchParams.version
            ? `v${searchParams.version}/`
            : '',
            token: searchParams.tokenName
            ? req.headers.get(searchParams.tokenName)
            : null
        }

        const url = new URL(`https://res.cloudinary.com/${cldName}/${searchParams.mediaType}/upload/${urlComponents.t}/${urlComponents.v}${publicId}`)

        const res = await fetch(url,{
            headers: {
                "__cld_token__": urlComponents.token ?? ''
            }
        });
        
        // if (!res.ok){
        //     return NextResponse.json(null)
        //     // Return not allowed image
        // }
        return res;

    } catch (error:any) {
        return NextResponse.json({
            status: false,
            error: error.message
        },{status: 500});
        // return NextResponse.json({},{status:500});
    }
}

const handle_CLD_GENERAL = ()=>{
    try {
        
    } catch (error:any) {
        
    }
}