import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const shouldWait = req.nextUrl.searchParams.get("wait")
    } catch (error:any) {
        
    }
}