"use client";

import { useAuthContext } from "@/context/authContext";
import { useColorContext } from "@/context/colorScheme";
import { useCallback } from "react";
import { delCookie } from "../cookies";
import { useRouter } from "next/navigation";

export const useAppActions = ()=>{
    const { theme, setTheme } = useColorContext();
    const { updateAuth } = useAuthContext();
    const { push, replace } = useRouter();
    
    const cycleTheme = useCallback(()=>{
        if (theme === 'dark')
            setTheme('default');
        else if (theme === 'default')
            setTheme('light');
        else setTheme('dark')
    },[theme]);

    const logout = async (
        options?:{
            goto?: string,
            gotoMethod?: "push"|"replace"
        },
        afterUpdate?: ()=> any|Promise<any>
    )=>{
    try {
        const res = await (await fetch("/api/user/logout",{
            method: "GET"
        })).json() as Status;
        
        updateAuth({force:false, justLoggedOut: res.status??false});

        // delCookie("AUTH_TOKEN");
        // updateAuth();

        if (afterUpdate) await afterUpdate();
        if (options?.goto && options.goto!=="") {
            if (options.gotoMethod==="replace")
                replace(options.goto);
            else
                push(options.goto);
        }
    } catch (error:any) {
        
    }};

    const goto = (address: string, useReplace?: boolean)=>{
        if(!address) return;
        if(useReplace)
            replace(address);
        else
            push(address)
    }
    return {
        cycleTheme, logout, goto
    }
}