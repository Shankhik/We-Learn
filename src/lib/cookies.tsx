'use client'

import { CookieMiscName, CookieNames } from '@/types/cookieType';
//import * as nookies from 'nookies';
import * as nextCookies from "cookies-next/client"

/**
 * Sets cookies.
 * @param {string} cookieName - Cookie Name.
 * @param {string} cookieValue - Cookie Value.
 * @param {number} expireTime - Expiration time in minutes
 * @returns {Status} Operation details.
 */
export const setCookie = <T extends string = CookieNames|CookieMiscName>(
    cookieName:CookieNames|CookieMiscName|T,
    cookieValue:string,
    expireTime?: number,
    httpOnly?: boolean
) : Status =>{
    const expT = (expireTime||60*5)*60 
    try {
        nextCookies.setCookie(cookieName,cookieValue,{
            maxAge:expT,
            path:"/",
            httpOnly
        })
        return {
            status: true,
            message: `Cookie ${cookieName} set!`
        }
    } catch (error:any) {
        return {
            status: false,
            error: `Error: ${error.message}`
        }
    }
}
export const getCookie = <T extends string = CookieNames|CookieMiscName>(
    cookieName: CookieNames|CookieMiscName|T
): Status =>{
    try {
        let cookie = nextCookies.getCookie(cookieName);
        
        if (cookie){
            return {
                status: true,
                message: `Got '${cookieName}' Cookie`,
                cookie
            }
        }else{
            return {
                status: false,
                message: `No '${cookieName}' Cookie found`,
            }
        }
        
    } catch (error:any) {
        console.log(error.message)
        return {
            status: false,
            error: `Error: ${error.message}`,
        }
    }
    
}
export const delCookie = (
    cookieName: CookieNames|CookieMiscName
): Status=>{
    try{
        nextCookies.deleteCookie(cookieName);
        
        return ({
            status: true,
            message: `Cookie '${cookieName}' removed`}
        )
    }catch(error: any){
        return({
            status: false,
            error: `Error: ${error.message}`
        })
    }
}