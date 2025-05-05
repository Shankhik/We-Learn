'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { post } from "@/lib/fetchReq";
import { status } from "@/types/statusType";
import ApiLinks from "@/lib/apiLinks";
import { getCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/jwt";

type UserDetailsContext = {
    username?: string;
    displayName?: string;
    email?:string;
    profilePicture?:string|null;
    admin?:boolean;
    updateUserDetails: ()=>void
}
const userDetailsContext = createContext<UserDetailsContext>({
    updateUserDetails: ()=>{}
});

export const UserDetailsProvider = ({children}:{children:React.ReactNode})=>{
    const [trigger,setTrigger] = useState(false);

    type UserDetails = {
        username: string;
        displayName: string;
        email: string;
        profilePicture: string|null;
        admin: boolean;
    }
    const update = ():void =>{
        setTrigger(!trigger)
    }

    const [contextValue, setContextValue] = useState<UserDetailsContext>({
        updateUserDetails: update
    })

    useEffect(()=>{

        const loadDetails = async ()=>{
            const authCookie = getCookie('authToken').cookie
            let payload;
            if(authCookie){
                payload = verifyToken(authCookie).decoded
            }
            if(payload){
                const res:status = await post(ApiLinks.getUserDetails.this,{
                    username: payload.username
                })
                const details:UserDetails = res.user
                //console.log(details)
                setContextValue({
                    username: details.username,
                    displayName: details.displayName,
                    email: details.email,
                    profilePicture: details.profilePicture,
                    admin: details.admin,
                    updateUserDetails: update
                })
            }else{
                setContextValue({
                    updateUserDetails: update
                })
            }
        }
        loadDetails()
    },[trigger])

    return (
        <userDetailsContext.Provider value={contextValue}>
            {children}
        </userDetailsContext.Provider>
    )
}

export const useUserDetailsContext = ()=>{
    return useContext(userDetailsContext)
}