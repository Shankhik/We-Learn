'use client'

import SettingsFloatingButtons from "@/components/floating-buttons/SettingsFloatingButtons"
import HomeLayout from "@/components/layouts/HomeLayout";
import { useAuthContext } from "@/context/authContext"
import { useColorContext } from "@/context/colorScheme";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type ActiveLinks = 'profile'|'account'|null;

export default function LayoutClient ({children}:{
    children?: React.ReactNode,
}){
    const { verified } = useAuthContext();
    const { effectiveTheme } = useColorContext();

    const pathname = usePathname();
    const activePath:ActiveLinks = useMemo(()=> (
        pathname.split("/")[2] as 'profile'|'account'
    )
    ,[pathname]);

    const FloatingButtons = <>
    <SettingsFloatingButtons disabled={!verified}
        effectiveTheme={effectiveTheme}
        active={activePath}
    />
    </>
    return <>
    <title>Settings</title>
    <HomeLayout activePath={activePath}
        //floatingButtons={FloatingButtons}
    >
        {children}
    </HomeLayout>
    </>
}