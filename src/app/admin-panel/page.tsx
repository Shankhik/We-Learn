"use client";

import AdminIconSVG from "./AdminIconSVG";
import { EmailSection } from "./components/EmailsSection";

import Welcome from "@/react-emails/emails/Welcome";
import OtpVerification from "@/react-emails/emails/OtpVerification";
import { ComponentProps, ComponentType, use, useEffect, useMemo, useState } from "react";
import { renderEmailHtml } from "@/lib/email/renderEmailHtml";
import Button from "@/components/buttons/NewButton";

export default function AdminPanel (){
    return <>
    <AdminIconSVG/>
    <EmailSection/>
    {/* <EmailSectionNew/> */}
    </>
}

type Email <T extends ComponentType<any>>= {
    name: string,
    Component: T,
    props: ComponentProps<T>
}

const EmailSectionNew = ()=>{
    const [refresh, setRefresh] = useState(0);

    const emails = useMemo(()=>({
        "Welcome": {
            name: "Welcome",
            Component: Welcome,
            props: {
                username: "Shankhik"
            }
        } satisfies Email<typeof Welcome>,
        "OtpVerification": {
            name: "OTP Verification",
            Component: OtpVerification,
            props: {
                purpose: "Signup",
                otp: "102938"
            }
        } satisfies Email<typeof OtpVerification>,
    }),[Welcome, OtpVerification, refresh]);

    const emailEntries = useMemo(()=> Object.entries(emails), [emails, refresh]) as ([key: string, value: Email<any>])[];

    const [activeEmail, setActiveEmail] = useState<Email<any>|null>(null);

    const getHtml = ()=>{
        if (activeEmail === null) return new Promise<undefined>((res)=> res(undefined));
        // Converts Component to string | undefined
        return renderEmailHtml(activeEmail.Component, activeEmail.props);
    }

    const htmlPromise = useMemo(()=> getHtml(),[activeEmail?.name, refresh]);

    const list = useMemo(()=>(emailEntries.map(([key, value],i)=>{
        // const html = use(renderEmailHtml(value.Component));
        const onClick = ()=>{
            setActiveEmail(prev =>{
                if (prev && prev.name === value.name) return null;
                return value;
            })
        }
        return <Button key={i}
            onClick={onClick}
        >{value.name}</Button>
    })),[emailEntries, activeEmail?.name]);

    return <>
    <div style={{display: "flex", gap: "6px"}}>
        {list}<Button onClick={()=> setRefresh(prev=> prev+1)}>Refresh</Button>
    </div>
    <Render htmlPromise={htmlPromise}/>
    </>
}

const Render = ({ htmlPromise }:{
    htmlPromise: Promise<string|undefined>
})=>{
    const [html, setHtml] = useState<string|undefined>(undefined);
    useEffect(()=>{
        const render = async ()=>{
            setHtml(await htmlPromise);
        }
        render();
    },[htmlPromise]);

    return <iframe srcDoc={html} height={"600px"}/>
}