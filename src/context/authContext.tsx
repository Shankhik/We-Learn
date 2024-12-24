'use client';

import { useContext, createContext, useState, ReactNode, Dispatch, SetStateAction, useEffect, useRef } from "react";
import { getCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/jwt";

//auth Context all data
export type authContextType ={
    verified: boolean;
    updateAuth: ()=>void;
    user?: {
        username: string;
        email: string;
        admin: boolean;
    }
}

export const authContext = createContext<authContextType>({verified: false, updateAuth: ()=>{}});

export const AuthProvider=({children} :{children: ReactNode})=>{
    const [trigger, setTrigger] = useState(0);
    const updateAuth = ():void => {
        if (trigger === 0) setTrigger(1)
        else setTrigger(0)
    }
    const [authValue,setAuthValue] = useState<authContextType>({
        verified: false,
        updateAuth: updateAuth
    });
    
    
    useEffect(()=>{
        const authTokenCookie = getCookie('authToken').cookie
        if(authTokenCookie){
            let payload = verifyToken(authTokenCookie).decoded
            if (payload){
                setAuthValue({
                    verified: true,
                    updateAuth: updateAuth,
                    user: {
                        username: payload.username,
                        email: payload.email,
                        admin: payload.admin
                    }
                })
            }else{
                setAuthValue({
                    verified: false,
                    updateAuth: updateAuth,
                })
            }
        }else{
            setAuthValue({
                verified: false,
                updateAuth: updateAuth
            })
        }
    },[trigger])
    
    return(
        <authContext.Provider value={authValue}>
            {children}
        </authContext.Provider>
    )
}
export const useAuthContext = ()=>{
    const {verified, updateAuth, user} = useContext (authContext)
    return {verified, updateAuth, user}
}
/*
export const getAuthContext = (): authContextType=>{
    const context = useContext(authContext).authDetails;
    let data:authContextType = {};
    if(context?.username){
        data.username = context.username
    }
    if(context?.email){
        data.email = context.email
    }
    if(context?.token){
        data.token = context.token
    }
    return data;
}
export const refreshAuthContext =()=>{
    const context = useContext(authContext).refreshTrigger;
    return context;
}
*/