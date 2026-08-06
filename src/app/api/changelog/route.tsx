import { getChangelog } from "@/mongoDB/serverActions/changelog";
import { NextRequest, NextResponse } from "next/server";

type Version = Exclude<Parameters<typeof getChangelog>[0],undefined>|null
export const GET = async (req: NextRequest):Promise<NextResponse<Status>>=>{
    try {
        const ver = req.nextUrl.searchParams.get("version") as Version
        
        // Validation is done in the function
        const changelog = await getChangelog(ver??undefined)

        return NextResponse.json({
            status: true,
            message: `current version: ${changelog.version}`,
            document: changelog
        })
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            error: error.message || "No changelog document found!",
        },{
            status: error.httpCode || 500
        })
    }
}