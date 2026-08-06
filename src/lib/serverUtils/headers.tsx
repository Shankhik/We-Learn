"use server";

import { headers } from "next/headers";

/**
 * Returns value of the given headers from request headers.
 * @param headersNames Input the headers needed
 * @returns Object[header-name: string|undefined]
 */
export const getReqHeaders = async <
    const T extends readonly string[]
> (...headersNames: T): Promise<{[K in T[number]]?: string|undefined}> =>{
    //let newHeaders = new Object();
    const h = await headers();

    const newHeaders = Object.fromEntries(headersNames.map(key=>{
        return [key, h.get(key)||undefined]
    })) as {[K in T[number]]?: string|undefined};
    
    return newHeaders;
}
