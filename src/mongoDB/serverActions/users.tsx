"use server";

import { mongoCollection } from "../operations";
import { RedisType } from "@/types/redisTypes";
import { ansiColor } from "@/lib/colorText";
import { timingsInMinutes } from "@/lib/time";
import serverLog from "@/lib/serverUtils/log";
import { ApiError } from "@/lib/serverUtils/apiError";
import { getOneCourse } from "./courses";
import { UpdateResult } from "mongodb";
import { User, UserTrack } from "@/types/databaseTypes";

import redisClient from "@/lib/redis/redisClient";

type RedisKeysNames = keyof RedisType['KeyMap'];
type RedisKey<N extends RedisKeysNames> = RedisType['KeyMap'][N];

const setRedisCache = async <
    V extends unknown = User,
    T extends RedisKeysNames = RedisKeysNames,
>(
    key: RedisKey<T>,
    value: V,
    ttl?: number
) : Promise<
    number | `Error: ${string}`
> =>{
    try {
        const args:Array<string|number> = [];
        if (ttl) args.push("EX", ttl);

        const res = await redisClient.hset(
            key, value as object,// ...args as any
        );

        if (ttl) await redisClient.expire(key,ttl);
        return res

    } catch (error:any) {
        return `Error: ${error.message}`
    }
}


const getRedisCache = async <
    R extends unknown = User,
    T extends RedisKeysNames = RedisKeysNames,
>(
    key: RedisKey<T>,
): Promise<
    `Error: ${string}`| R | null
> =>{
    try {
        const res = await redisClient.hgetall(key);
        if (Object.keys(res).length===0) return null;
        return res as R;
    } catch (error:any) {
        return `Error: ${error.message}`
    }
}

export async function getUserCredentials(username: string, options?:{
    useRedis?: boolean,
    // Fetch + Cache current value
    revalidate?: boolean
    //cacheIfFound?: boolean
}) {
    const ex = timingsInMinutes.redis.userCredential * 60;

    type HashSetUser = Merge<User,{
        profilePicture?: string|number|null
    }>;
    
    /* Tries to fetch from Redis Cache */
    if (options?.useRedis && !options.revalidate){
        const cache = await getRedisCache<HashSetUser>(`user-cred:${username}`);
        // console.log(cache)
        // Returns Cached data if found
        if (cache && typeof cache !== "string"){
            // Parses Profile Picture
            if (cache.profilePicture==="")
                cache.profilePicture = null;
            else
                cache.profilePicture = Number(cache.profilePicture);
            
            // Parsin admin
            if (cache.admin){
                if (cache.admin as any === "true") cache.admin = true;
                else cache.admin = false;
            }
                
            return cache as User;
        }

        // Or else retreive it from Mongo
    }
    
    const coll = mongoCollection("Users")?.collection!

    const details = await coll.findOne({username},{
        projection:{
            _id: 0,
            // No way this is needed
            password: 0,
            // Already in AuthToken
            username: 0, //admin:0
        }
    })

    // Returns null if nothing is found
    if (!details) return null;
    // console.log("f(getUserCredential):", details);
    /* Cache the fetched data */
    if (options?.useRedis){
        
        // Setting user credentials
        const res = await setRedisCache(
            `user-cred:${username}`,
            details, ex
        )
        
        // console.log(res, "type:", typeof res)
        // N = number of fields affected
        if (typeof res === "number" && res > 0)
            serverLog("success","redis",null,
            `[user-cred:${username}] EX:${ansiColor('yellow',`${ex}s`)}`)
    }
    
    return details as RedisType['UserCredentials'];
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
○ For marking a module completed
-> Also marks course as completed if all modules are completed */ 
export async function markAsRead (
    username: string,
    courseId: string
):Promise<Status> {
    try {
        const coll = mongoCollection("UserTracks")?.collection!;
        const data = await coll.findOne({username,"enrolled.courseId":courseId})
        if(!data) throw new ApiError("Not enrolled in course or invalid username");

        const course = await getOneCourse({courseId},{projection:{
            _id: 0, "modules.title":1
        }},{
            key:"include:modules-title",
            time: 60*20
        });
        if(!course.data) throw new ApiError("No such course found");
        
        const modulesLength = course.data.modules.length;
        let track = data.enrolled.filter(course=> course.courseId === courseId).at(0)!
        
        let res: UpdateResult<UserTrack>|undefined;

        // Can increment safely
        if (track.completedUpto+1 <= modulesLength){
            
            if (track.completedUpto+1 < modulesLength)
                track.completedUpto += 1;
            else{
                track.completedUpto = modulesLength;
                track.completionDate = new Date();
            }
                
            res = await coll.updateOne({
                username, "enrolled.courseId": courseId
            },{
                // ...(
                //     // If marking this module complete doesn't complete the course
                //     track.completedUpto+1 < modulesLength?
                //     // Marks module complete
                //     {$inc: {"enrolled.$.completedUpto":1}}:
                //     // Marks (module + course) complete
                //     {$set: {
                //         "enrolled.$.completedUpto": modulesLength,
                //         "enrolled.$.completionDate": new Date()
                //     }}
                // ),
                $set: {
                    "enrolled.$.completedUpto": track.completedUpto,
                    ...(!track.completionDate? undefined:{
                        "enrolled.$.completionDate": track.completionDate
                    })
                    //"enrolled.$.completionDate": track.completionDate
                }
            });
        }else{
            if(track.completionDate === undefined){

                track.completionDate = new Date();

                res = await coll.updateOne({
                    username, "enrolled.courseId": courseId
                },{
                    $set:{
                        "enrolled.$.completionDate": track.completionDate//new Date()
                    }
                })
            }
        }
        if(!res || !res.acknowledged) throw new Error("The course has been already completed");
        
        return {
            status: true,
            message: "Module marked as read!",
            data: track
        }
        
    } catch (error:any) {
        return {
            status: false,
            error: error.message
        }
    }
}