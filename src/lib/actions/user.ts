"use server";

import { User } from "@/types/mongoDBTypes";
import redis from "../redis/redisClient";
import { parseRedis } from "../redis/parser";
import mongoCollection from "../mongodb/collection";
import { timingsInMinutes } from "../time";

type Credential = Pick<User,'_id'|'username'|'email'|'displayName'|'admin'|'profilePicture'>;

export async function getUserCredentials (
    username: string | undefined,
    options?: {
        _id?: string,
        redis?: { revalidate: boolean }
    }
){
    try {
        if (!username) return null;
        let cache: null|string = null;

        if (options?.redis && !options?.redis.revalidate){
            cache = await redis.get(`user-cred:${username}`);
            
            if (cache) // If cache is found -> returns
            // parsed cache can be null when
            // redis key value = "null"
            return parseRedis<Credential>(cache)
            // return null
        }

        const { collection } = await mongoCollection("Users");
        
        const cred = await collection.findOne({
            username, createdAt: { $exists: true }
        }, {
            projection:{
                password: 0,
                enrollments: 0,
                createdAt: 0,
                lastUpdate: 0
            } satisfies {[key in keyof Required<Omit<User, keyof Credential>>]: 0|1}
        });

        if (cred?._id)
            cred._id = cred._id.toString() as any;

        // Setting Redis Cache
        if (options?.redis) await redis.set(
            `user-cred:${username}`,
            JSON.stringify(cred),
            // Expiry Time
            "EX", timingsInMinutes.redis.userCredential*60
        );
        if (!cred) return cred as null;
        
        if ( // if the given _id doesn't match database document _id
            typeof options?._id === "string" 
            && options._id !== cred?._id.toString()
        ) return null;
        
        return cred as Credential;
    } catch (error:any) {
        return null;
    }
}
export const createAccount = async()=>{
}

export const deleteAccount = async()=>{
}