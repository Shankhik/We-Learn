// "use server"

import {Redis} from "ioredis";
import { ansiColor } from "../colorText";
import { serverLog } from "../colorText2";

function getRedisOptions() {
    const uri = process.env.REDIS_URI;
    if (!uri) {
        // Build-time / missing env: avoid `new URL(undefined)` at module load
        return {
            host: "localhost" ,//||"127.0.0.1",
            port: 6379,
            lazyConnect: true,
            maxRetriesPerRequest: 0,
            retryStrategy: () => null,
        };
    }
    const parsed = new URL(uri);
    return {
        username: parsed.username,
        password: parsed.password,
        host: parsed.hostname,
        port: parsed.port ? Number(parsed.port) : undefined,
        ...(parsed.protocol === "rediss:" ? { tls: {} } : {}),
        retryStrategy: (times = 5) => times,
        lazyConnect: true,
    };
}

const redis = new Redis(getRedisOptions()).on('error',(e: Error & {code:string})=>{
    serverLog("failed", "redis",{},`${e.message} [${e.code}]`)
    //console.log(ansiColor('red',` ✘ Redis error: ${e.code}`))
}).on("close",()=>{
    serverLog("failed", "redis",{color:"red"},"couldn't connect to database.")
    // console.log("Closed: Redis Client")
})

export default redis;

