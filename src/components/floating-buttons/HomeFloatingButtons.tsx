"use client";

import useClassname from "@/lib/hooks/useClassname";
import moduleStyle from "./HomeFloatingButtons.module.css";
import { colorScheme } from "@/lib/color/appColors";

import { useColorContext } from "@/context/colorScheme";
import { useAuthContext } from "@/context/authContext";
import { memo, ReactNode, useCallback, useMemo } from "react";
import { HomeFloatingIcons } from "../icons/Icons";
import { usePathname, useRouter } from "next/navigation";

function HomeFloatingButtons (){
    const css = useClassname(moduleStyle);
    const { effectiveTheme, returnOnTheme } = useColorContext();
    const { verified } = useAuthContext();
    const router = useRouter();
    const pathname = usePathname();

    const colors = useMemo(()=>({
        fill: {
            light: "rgba(20, 20, 46, 0.8)",
            dark: "rgba(230, 234, 255, 0.8)",
        },
        active: {
            light: { red: "rgba(255, 73, 103, 0.4)", green: "rgba(46, 192, 119, 0.4)", blue: "rgba(63, 108, 231, 0.4)" },
            dark: { red: "rgba(255, 73, 103, 0.4)", green: "rgba(46, 192, 119, 0.4)", blue: "rgba(63, 108, 231, 0.4)" },
        }
    }),[]);

    const activeColor = useMemo(()=>{
        const segment = pathname.split("/").at(2);
        return {
            dashboard: segment === "dashboard"?
                colors.active[effectiveTheme].red: undefined,
            me: segment === "library"?
                colors.active[effectiveTheme].green: undefined,
            explore: segment === "courses"?
                colors.active[effectiveTheme].blue: undefined,    
        }
    },[pathname, effectiveTheme]);
    
    const onClick = useCallback((href: string)=>{
        return ()=> router.push(href)
    },[]);
    
    const style:React.CSSProperties = useMemo(()=>({
        backgroundColor: colorScheme.card[effectiveTheme],
        boxShadow: 
            `0 1px 3px -2px inset rgba(255, 255, 255, 0.3), `
            + "0 1px 10px -8px rgba(0, 0, 0, 0.5)"
    }),[effectiveTheme]);

    return<>
    <div className={css.names(`floating`)} style={style}>
        <Tab title="Home"
            onClick={onClick("/home/dashboard")}
            fill={colors.fill[effectiveTheme]}
            activeColor={activeColor.dashboard}
        >
            <HomeFloatingIcons mode="dashboard"fill={colors.fill[effectiveTheme]}/>
        </Tab>

        <Tab title="Me"
            onClick={onClick("/home/library")}
            fill={colors.fill[effectiveTheme]}
            activeColor={activeColor.me}
        >
            <HomeFloatingIcons mode="library" fill={colors.fill[effectiveTheme]}/>
        </Tab>

        <Tab title="Home"
            onClick={onClick("/home/courses")}
            fill={colors.fill[effectiveTheme]}
            activeColor={activeColor.explore}
        >
            <HomeFloatingIcons mode="courses" fill={colors.fill[effectiveTheme]}/>
        </Tab>
    </div>
    </> 
}

const Tab = ({title, fill, style, onClick, children, activeColor}:{
    children?: ReactNode
    title: string,
    fill: string,
    activeColor: string |undefined,
    style?: React.CSSProperties
    onClick?: ()=>any
})=>{
    const {effectiveTheme} = useColorContext();

    return <>
    <div className={moduleStyle['tab']} onClick={onClick} style={{
        ...style,
        ...(activeColor?{
            background: `radial-gradient(circle, ${activeColor}, transparent)`
        }: undefined)
        
    }}>
        {children}
        <div className={moduleStyle['title']} style={{
            color: fill
        }}>{title}</div>
        <div className={moduleStyle["hint"]} style={{
            backgroundColor: colorScheme.card[effectiveTheme]
        }}>{title}</div>
    </div>
    </>
}

export default memo(HomeFloatingButtons);