"use client";

import HomeLayout from "@/components/layouts/HomeLayout";
import { useAuthContext } from "@/context/authContext";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function Layout ({children}:{
    children: React.ReactNode
}){
    const {verified} = useAuthContext();
    // const pathname = usePathname();
    // const segment = useMemo(()=>pathname.split("/")[1].replace("-"," "),[pathname])
    const title = useFormTitle();
    return <>
    <HomeLayout bypassAuth
        activePath = {title}
        //hideProfile={!verified}
    >
        {children}
    </HomeLayout>
    </>
}

const useFormTitle = ()=>{
    const pathname = usePathname();
    const title = useMemo(()=>{
        const titleSegment = pathname.split("/")[1].split("-");
        let title = "";
        titleSegment.forEach((word, index)=>{
            title += (index===0?"":" ")+
                word.at(0)?.toUpperCase()+word.slice(1)
        })
        return title;
    },[pathname]);

    return title
}