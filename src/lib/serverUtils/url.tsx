"use server";

import { headers } from "next/headers";

/**
 * Generates absolute URL path
 * @param pathname - Path after the domain name
 */
export const generateAbsUrl = async (pathname:string)=>{
    pathname = pathname.startsWith("/")?pathname.slice(1):pathname;
    const host = (await headers()).get("host");
    const protocol = process.env.NODE_ENV === 'development'?"http":"https"
    //console.log(`${protocol}://${host}/${pathname}`)
    return `${protocol}://${host}/${pathname}`
}