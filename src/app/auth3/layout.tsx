"use client";

import globalStyle from "./global.module.css";
import ModuleClassname from "@/lib/cssUtil";

import HomeLayout from "@/components/layouts/HomeLayout"
import { useColorContext } from "@/context/colorScheme"
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Button from "@/components/buttons/NewButton";

type Segments = 'login'|'signup'|'forgot-password';

type HomePageProps = React.ComponentProps<typeof HomeLayout>
type ButtonProps = React.ComponentProps<typeof Button>;

export default function AuthLayout ({children}:{
    children?: React.ReactNode
}){
    const css = new ModuleClassname(globalStyle);
    const { effectiveTheme } = useColorContext();

    const segment = usePathname().split("/")[2] as Segments;

    const elementStyles: HomePageProps['elementStyles'] = useMemo(()=>({
        container: {
            flexGrow:1
        },
        main: {
            flexGrow:1,
            // padding:0, overflow: "none", flexShrink:0
        }
    }),[effectiveTheme]);

    const elementProps: HomePageProps['elementProps'] = useMemo(()=>({
        navbar: {
            fadeColor: "transparent"
        }
    }),[effectiveTheme]);

    return <>
    <HomeLayout bypassAuth
        activePath={segment}
        elementStyles={elementStyles}
        elementProps={elementProps}
    >   
        <div className={css.names(`main-container`)}>
            {children}
        </div>
    </HomeLayout>
    </>
}