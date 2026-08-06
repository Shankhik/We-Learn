"use server";

import {JwtPayload, sign, verify} from 'jsonwebtoken'
import { ApiError } from './serverUtils/apiError';
import { httpStatusCode } from './fetchReq';
import type { AuthToken, SignupToken } from '@/types/tokenType';
import { timingsInMinutes } from './time';

const secretKey = process.env.JWT_SECRET_KEY||'';

/**
 * Signs a AuthToken payload
 * @param {AuthToken} payload - Takes in an Auth-Token payload
 * @param {number} expireTime - Token expire time in minutes
 * @returns {Status} Return Status object with 'token' string
 */
export const signToken = async (payload: AuthToken|SignupToken, expireTime:number): Promise<Status> =>{
    const expT = expireTime*60 ;
    try{
        const token = sign(payload, secretKey,{
            algorithm: 'HS256',
            expiresIn: expT,
            issuer: 'we-learn'
        })
        
        let status:Status = {
            status: true,
            message: "Token Created",
            token: token
        }
        return status
    }catch(error:any){
        let status:Status = {
            status: false,
            error: `Error: ${error.message}`
        }
        return status
    }
}
export const verifyToken = async (token: string|undefined|null): Promise<Status> =>{
    try {
        if(!token) throw new Error("Invalid Token");
        const decoded = verify(token, secretKey, { algorithms: ['HS256'] }) as AuthToken|SignupToken;
        
        if(decoded) /* undefined = tampered */{
            return {
                status: true,
                message: `Token Verified`,
                decoded: decoded
            }
        }
        else{
            return {
                status: false,
                message: `Token Not Genuine`,
            }
        }
    } catch (error:any) {
        return {
            status: false,
            error: `Error: ${error.message}`
        }
    }
}
export const updateToken = async <T extends AuthToken|SignupToken> (
    token: string, updateFields: T
): Promise<Status & { exp?: number }> => {
    try{
        const decoded = (await verifyToken(token)).decoded;
        if(!decoded) throw new Error("Signature invalid!");

        const exp = decoded.exp;
        
        const newIat = Math.floor(Date.now() / 1000);

        const newTokenPayload = {
            ...decoded,
            ...updateFields,
            iat: newIat,
            ...(exp? {exp} : {})
        }

        const newToken = sign(newTokenPayload,secretKey,{
            algorithm:'HS256',
        })
        return {
            status: true,
            message: "Token updated!",
            token: newToken,
            exp: exp
        }
    }catch(e: any){
        return {
            status: false,
            error: e.message
        }
    }
}

/**
 * 
 * @param authHeader - Authoriztion Token
 * @param failedMessage - Error message to show if verification fails
 * @returns AuthToken or throws an ApiError (Error + httpCode)
 */
export const verifyAuthHeader = async (
    authHeader: string|null,
    failedMessage?: string
) =>{
    if(!authHeader) throw new ApiError("Authorization header not found!",{
        httpCode: httpStatusCode['bad-request']
    });
    
    // Removes "Bearer "
    const token = authHeader.slice(7)

    const decoded =  (await verifyToken(token)).decoded

    if(!decoded) throw new ApiError(failedMessage||"JWT verification failed",{
        httpCode: httpStatusCode.unauthorized
    });

    return decoded
}