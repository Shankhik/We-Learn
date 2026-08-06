// To get HTML from the components
"use client";

import Welcome from "./emails/Welcome";
import OtpVerification from "./emails/OtpVerification";
import { ComponentProps, ComponentType, FunctionComponent, useMemo, useState } from "react";

type EmailProps <T extends ComponentType<any>> = ComponentProps<T>;

type EmailEntry <T extends ComponentType<any>>= {
    name: string,
    Component: T,
    getComponent: ()=> T,
    props: EmailProps<T>
}

type MapEntry<T extends CallableFunction = FunctionComponent<any>> = {
    
}

const emailRenderMap = [
    {
        name: "Welcome",
        Component: Welcome,
        getComponent: ()=> Welcome,
        props: {
            username: "Admin",
            inPreview: true
        }
    } satisfies EmailEntry<typeof Welcome>,
    {
        name: "OtpVerification",
        Component: OtpVerification,
        getComponent: ()=> OtpVerification,
        props: {
            inPreview: true,
            purpose: "Signup",
            otp: "535678",
            username: "Admin",
        }
    } satisfies EmailEntry<typeof OtpVerification>
]

const useEmailRenderMap = ()=>{
    const emailRenderMap = useMemo(()=>[
        {
            name: "Welcome",
            Component: Welcome,
            getComponent: ()=> Welcome,
            props: {
                username: "Admin",
                inPreview: true
            }
        } satisfies EmailEntry<typeof Welcome>,
        {
            name: "OtpVerification",
            Component: OtpVerification,
            getComponent: ()=> OtpVerification,
            props: {
                inPreview: true,
                purpose: "Signup",
                otp: "535678",
                username: "Admin",
            }
        } satisfies EmailEntry<typeof OtpVerification>
    ],[Welcome, OtpVerification]);
    
    const map = useMemo(()=> emailRenderMap,[
        emailRenderMap, Welcome, OtpVerification
    ]);

    return map;
}

export default useEmailRenderMap;
// export default function useReactEmail <T extends keyof typeof emailRenderMap>(
//     component: T,
//     props?: Partial<(typeof emailRenderMap)[T]['props']>
// ){
//     const rendered = useMemo(()=>{

//     })
// }
