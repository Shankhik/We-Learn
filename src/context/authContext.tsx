'use client';

import { useContext, createContext, useState, ReactNode, useEffect } from "react";
import { getCookie } from "@/lib/cookies";
import { post } from "@/lib/fetchReq";
import { status } from "@/types/statusType";

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
        const fetch = async ()=>{
            const authTokenCookie = getCookie('authToken').cookie

            if(authTokenCookie){
                let payload = (await post('/api/jwt/verify',{
                    token: authTokenCookie 
                })).decoded as status['decoded']
                
                if (payload){
                    setAuthValue({
                        verified: true,
                        updateAuth: updateAuth,
                        user: {
                            username: payload.username||'',
                            email: payload.email||'',
                            admin: payload.admin||false
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
        }
        fetch()
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