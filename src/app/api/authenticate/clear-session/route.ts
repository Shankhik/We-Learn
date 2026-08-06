import { NextRequest, NextResponse } from "next/server";
import { getHashField, getSessionId } from "../utils";
import redis from "@/lib/redis/redisClient";

export async function GET (req: NextRequest) {
    try {
        const sessionCookie = req.cookies.get("SIGNUP_SESSION")?.value;
        if (sessionCookie) {
            const sessionId = (await getSessionId(sessionCookie))?.sessionId
            if(sessionId){
                const username = (await getHashField(sessionId,'username')).data;
                const email = (await getHashField(sessionId,'email')).data;
                await redis.del(
                    `signup-credential:${sessionId}`,
                    username ? `reserved-username:${username}`:'',
                    email? `reserved-email:${email}`:''
                );

                const res = NextResponse.json(true)
                res.cookies.delete("SIGNUP_SESSION")
                return res
            }
        }
        throw new Error("HUH")
        //
        
    } catch (error:any) {
        const res = NextResponse.json(true)
        res.cookies.delete("SIGNUP_SESSION")
        return res;
    }
}