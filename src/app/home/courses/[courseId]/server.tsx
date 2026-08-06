"use server";

import { verifyToken } from "@/lib/jwt";
import { generateAbsUrl } from "@/lib/serverUtils/url";
import { revalidateTag } from "next/cache";
import { cookies as clientCookies } from "next/headers";

export const getDescription = async (
    courseId: string,
)=>{

    // Gets AUTH_TOKEN from req header cookies
    const authToken = (await clientCookies()).get("AUTH_TOKEN")?.value

    const url = await generateAbsUrl(`api/courses/get/description?id=${courseId}`)
    
    const isVerified = (await verifyToken(authToken??null)).status;

    // Breaks and return undefined if not verified.
    if (!isVerified) return "NOT-VERIFIED";
    
    // New Header for fetch() req
    let newHeader = new Headers();

    // Adds Authorization Token from auth cookie
    if(authToken) newHeader.append("Authorization",`Bearer ${authToken}`);
    
    const response = await fetch(url,{
        // Adds Auth Token Cookie [ verification -> Endpoint ]
        headers: newHeader,
        // Caches data only if verified
        ...(isVerified?{
            next:{
                tags:[`course-details-${courseId}`],
                revalidate: 60*5 // 5 minutes
            }
        }:{})
    })

    if (response.status>=400 && response.status<500) {
        if(response.status<=401) return "NOT-VERIFIED";
        return undefined;
    }

    return (await response.json() as Status).course
}

export const refetchDescription = async (courseId: string)=>{
    revalidateTag(`course-details-${courseId}`,"max")
}