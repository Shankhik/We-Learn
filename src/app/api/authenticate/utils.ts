import redis from "@/lib/redis/redisClient"
import mongoCollection from "@/lib/mongodb/collection";
import { randomBytes } from "node:crypto";

import { signToken, verifyToken } from "@/lib/jwt";
import { SignupToken } from "@/types/tokenType";
import { NextResponse } from "next/server";
import { timingsInMinutes } from "@/lib/time";
import { serverLog } from "@/lib/colorText2";

export type SignupCredential = {
    key: `signup-credential:${string}`,
    hset: {
        username: string|0,
        password: string|0,
        email: string|0,
        otp: string|0,
        verified: 1|0
    }
}
const isDev = process.env.NODE_ENV !== 'production';

export const setAuthCookie = (
    response: NextResponse, token: string,
    options?:{
        maxAge: number
    },
    returnBack: boolean = false
)=>{
    response.cookies.set("AUTH_TOKEN", token,{
        maxAge: (options?.maxAge||timingsInMinutes.jwt) * 60,
        path: "/",
        secure: !isDev,
        sameSite: !isDev?"strict":"lax",
        httpOnly: true,
    });

    if (returnBack) return response;
};

export const getHashField = async (
    sessionId: string|undefined,
    fieldname: string
): Promise<Status<string>>=>{
    try {
        if (!sessionId) return {
            status: false,
            message: "SessionId not found!"
        };
        if (await redis.exists(`signup-credential:${sessionId}`)<1)
            throw new Error("Session may have expired!");
        const data = await redis.hget(`signup-credential:${sessionId}`,fieldname);
        if (data) return {
            status: true,
            message: 'Field found!',
            data
        }
        return {
            status: false,
            message: 'Session may have expired'
        }
    } catch (error:any) {
        return {
            status: false,
            error: error.message
        };
    }
}

export const getSessionId = async (token: string|undefined)=>{
    try {
        if(!token) return null;

        const response = await verifyToken(token);

        if (!response.status || !response.decoded) return null;

        const exists = await redis.exists(`signup-credential:${response.decoded.sessionId}`);

        if (!exists) return null;

        return response.decoded as SignupToken;
    } catch (error:any) {
        return null;
    }
}

export const usernameExists = async( username: string, searchIn: "redis"|"mongodb")=>{
    try {
        let doesExists: boolean;
        if (searchIn === "redis"){
            doesExists = await redis.exists(`reserved-username:${username}`)>0
        } else{
            const { collection } = await mongoCollection("Users")
            doesExists = (await collection.countDocuments({
                username, createdAt: { $ne: null as any }
            }))>0
        }
        return doesExists
    } catch (error:any) {
        return error.message as string;
    }
}

export const emailExists = async(email: string)=>{
    try {
        let doesExists: boolean;
        const { collection } = await mongoCollection("Users");
        doesExists = (await collection.countDocuments({ 
            email, createdAt: { $ne: null as any }
        }))>0;
        if (doesExists) return true;

        return !!(await redis.exists(`reserved-email:${ email }`));
    } catch (error:any) {
        return error.message as string;
    }
}
export const createSession = async (
    fields: Partial<SignupCredential['hset']> & { username: string|number },
    expireIn: number
): Promise<Status> =>{
    try {
        const sessionId = randomBytes(4).toString("hex");
        const keys = {
            credential: `signup-credential:${sessionId}` satisfies SignupCredential['key'],
            reserved: `reserved-username:${fields.username}`
        }
        
        // Setting Credential
        await redis.hset(
            keys.credential, {
                // username: 0, -> Will be overwritten
                password: 0,
                email: 0,
                otp: 0,
                verified: 0,
                ...fields
            } satisfies SignupCredential['hset']
        );
        // Setting Reserved Username
        await redis.set(keys.reserved,sessionId)

        // Setting TTL
        await redis.expire(keys.reserved, expireIn);
        await redis.expire(keys.credential, expireIn);
        
        return {
            status: true,
            message: "New session created.",
            token: (await signToken(
                {sessionId: sessionId},
                timingsInMinutes.signupSessionJwt
            )).token
        }

    } catch (error:any) {
        // means actual Error
        return {
            status: false,
            error: error.message
        }
    }
}
export const handleEmail = async (sessionId: string, email: string)=>{
    try {
        let prevEmail = await redis.hget(`signup-credential:${sessionId}`,"email");
        
        // If Email hasn't been initialized
        if (prevEmail === "0") prevEmail = null;
        
        // If prev email
        if (prevEmail && await redis.exists(`reserved-email:${prevEmail}`)){
            await redis.rename(
                `reserved-email:${prevEmail}`,
                `reserved-email:${email}`
            );
        } else {
            await redis.set(`reserved-email:${email}`,sessionId);
            const expTime = await redis.ttl(`signup-credential:${sessionId}`);
            if (expTime>0){
                await redis.expire(`reserved-email:${email}`, expTime);
            }
        }
        return true;
    } catch (error:any) {
        return error.message as string;
    }
}
export const updateSession = async (
    sessionId: string,
    fields: Partial<SignupCredential['hset']>
)=>{
    try {
        const key = `signup-credential:${sessionId}` satisfies SignupCredential['key'];
        const keyExists = await redis.exists(key)>0;

        if (!keyExists) throw new Error("Session may have expired!");

        let existingUsername: string|null = null;
        let existingEmail: string|null = null;

        if (fields.username !== undefined){
            existingUsername = await redis.hget(key,'username');

            // If existing reserved username is not found
            if (existingUsername === null) return null;
        }

        if (
            fields.username !== undefined && 
            fields.username !== existingUsername
        ){
            try {
                isDev && console.log(`renaming from ${existingUsername} -> ${fields.username}`)
                await redis.rename(
                    `reserved-username:${existingUsername}`,
                    `reserved-username:${fields.username}`
                )
            } catch (error:any) {
                return null;
            }
        }
        
        if (typeof fields.email === "string"){
            
            let prevEmail = await redis.hget(`signup-credential:${sessionId}`,"email");
            // If Email hasn't been initialized
            if (prevEmail === "0") prevEmail = null;
        
            // If prev email
            if (
                prevEmail && 
                (0 < await redis.exists(`reserved-email:${prevEmail}`))
            ){
                if (prevEmail !== fields.email){
                    await redis.rename(
                        `reserved-email:${prevEmail}`,
                        `reserved-email:${fields.email}`
                    );
                    serverLog("message","email",{
                        symbolColor:"green"
                    },prevEmail, "->", fields.email);
                }
            } else {
                await redis.set(`reserved-email:${fields.email}`,sessionId);
                const expTime = await redis.ttl(`signup-credential:${sessionId}`);
                if (expTime>0){
                    await redis.expire(`reserved-email:${fields.email}`, expTime);
                }
            }
        }
        await redis.hset(key, fields);

        return true;
    } catch (error:any) {
        // means actual Error
        return error.message as string
    }
}

export const getSessionData = async (sessionId: string|undefined, getPassword: boolean=false)=>{
    try {
        if (!sessionId) return null;
        const key = `signup-credential:${sessionId}` satisfies SignupCredential['key'];
        if (await redis.exists(key)<1) return null;

        const data = await redis.hgetall(key) as unknown as Partial<SignupCredential['hset']>;
        
        delete data.otp;
        
        if (!getPassword)
            delete data.password;

        for (const key in data){
            if (data[key as keyof typeof data] === "0" as any)
                data[key as keyof typeof data] = 0;
        }

        if (data.verified === "1" as any) data.verified = 1;

        return data;
    } catch (error:any) {
        return null
    }
}