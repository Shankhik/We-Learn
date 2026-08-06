"use client";

import { use, useEffect, useEffectEvent, useRef, useState } from "react";
import { useRouter, redirect } from "next/navigation";
import { ModulesBlock } from "./components/ModuleSegment";

export function SimpleRedirect ({children, condition, url}:{
    children?: React.ReactNode
    condition: boolean,
    url: string
}) {
    if (condition)
        redirect(url);

    return children
}
export default function AutoRedirect ({
    verified, children, verificationPromise, message, timer, disabled, options
}:{
    children?: React.ReactNode,
    verified?: boolean,
    verificationPromise?: Promise<string|undefined>
    message?: React.ReactNode,
    timer?: number,
    options?:{
        redirectPath?: string,
        redirectCode?: string
    }
    //redirectPath?: string,
    // Use this with AuthMounted
    disabled?: boolean
}){
    const username = verificationPromise?
        use(verificationPromise): undefined;
        
    if (disabled) return null;
    
    return username || verified ? children:
    <Redirect timer={timer} options={options}>
        {message}
    </Redirect>
}

const Redirect = ({children, timer, options}:Pick<
    React.ComponentProps<typeof AutoRedirect>,
    "children"|"timer"|"options"
>)=>{
    const { replace: replacePath, push } = useRouter()
    const [timeLeft, setTimeLeft] = useState(timer||5);
    const intervalRef = useRef<NodeJS.Timeout>(null);

    const countdown = useEffectEvent(()=>{
        setTimeLeft (prev=> prev-1);
        if (timeLeft < 2){
            push(options?.redirectPath||"/auth/login")
            //replacePath("/auth/login");
        }
    });

    useEffect(()=>{
        setTimeLeft(prev => timer||prev);
        if(!intervalRef.current){
            intervalRef.current = setInterval(countdown, 1000);
        }
        return ()=>{
            clearInterval(intervalRef.current??undefined);
            intervalRef.current = null;
        }
    },[timer]);

    // Clears interval when unmount
    useEffect(()=>{
        return ()=>{
            //console.log("Timer expired / early unmount")
            clearInterval(intervalRef.current??undefined);
            intervalRef.current = null;
        }
    },[]);

    return <>
    <ModulesBlock>
        {children}
        <p style={{margin:"10px auto"}}>
            Redirecting you to <Code>{
            options?.redirectCode||options?.redirectPath||`/auth/login`
            }</Code> in:
        </p>
        <p style={{margin:"0 auto"}}>
        <span style={{fontSize:"2rem", fontWeight:700}}>
            {Math.max(timeLeft,0)} 
        </span> seconds!
        </p>
    </ModulesBlock>
    </>
}

const Code = ({children}:{children:React.ReactNode})=>{
    return <>
    <span style={{
        fontSize:"0.9rem", fontWeight:700,
        padding:"2px 7px", borderRadius:"8px",
        backgroundColor:"rgba(49, 60, 161, 0.75)",
        color:"rgba(255, 255, 255, 0.84)"
    }}>
        {children}
    </span>
    </>
}
