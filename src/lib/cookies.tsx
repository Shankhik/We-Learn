'use client'

import { status } from '@/types/statusType';
import * as nookies from 'nookies';

/**
 * Sets cookies.
 * @param {string} cookieName - Cookie Name.
 * @param {string} cookieValue - Cookie Value.
 * @param {number} expireTime - Expiration time in minutes
 * @returns {status} Operation details.
 */
export const setCookie = (cookieName:string, cookieValue:string, expireTime?: number) : status =>{
    const expT = (expireTime||60*5)*60 
    try {
        nookies.setCookie(null, cookieName, cookieValue,{
            maxAge: expT,
            path: '/'
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
export const getCookie = (cookieName: string): status =>{
    let cookieValue;
    try {
        let cookies = nookies.parseCookies(null,{});
        cookieValue = cookies[cookieName]
        //console.log(cookieValue);
        if (cookieValue){
            return {
                status: true,
                message: `Got '${cookieName}' Cookie`,
                cookie: cookieValue
            }
        }else{
            return {
                status: false,
                message: `No '${cookieName}' Cookie found`,
            }
        }
        
    } catch (error:any) {
        return {
            status: false,
            error: `Error: ${error.message}`,
        }
    }
    
}
export const  delCookie = (cookieName: string): status=>{
    try{
        nookies.destroyCookie(null,cookieName,{path: '/'});
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