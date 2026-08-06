"use server"

/*
    This function fetched data of the user.
    Gets Username from the token after verifying
    Return null: verfication fails/user-credentials not found
*/

import { headers } from "next/headers"

/* Server Actions */
import { verifyToken } from "@/lib/jwt"
// import { getUserCredentials } from "@/mongoDB/serverActions/users";
import { getUserCredentials as getCredentials } from "@/lib/actions/user";

export default async function verifyUser(
    // This Param Overwrites Manual Cookie Check
    jwt: string|undefined,
    fetchCurrent?: boolean
){
    // Token is saved in authorization header | parsed by proxy.ts
    const AUTH_TOKEN = (await headers()).get("authorization");
    
    const payload = (await verifyToken(jwt||AUTH_TOKEN)).decoded;
    if (!payload || !payload._id || !payload.username) return null;
    
    const userCred = await getCredentials(payload.username,{
        redis: { revalidate: fetchCurrent || false}
    });

    return userCred;
}
