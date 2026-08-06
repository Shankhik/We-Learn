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
            media: req.nextUrl.searchParams.get('media') as 'image'|'video'|null,
            v: req.nextUrl.searchParams.get('v'),
            tf: req.nextUrl.searchParams.get('tf')
        }

        const url = new URL(
            `https://res.cloudinary.com/${cldName}/${searchParams.media}/upload/`
            + `${searchParams.tf ?? 'f_auto,q_auto'}/`
            + `${searchParams.v ? `v${searchParams.v}/`: ''}${publicId}`
        )

        const res = await fetch(url,{
            headers: {
                // "__cld_token__": urlComponents.token ?? ''
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
