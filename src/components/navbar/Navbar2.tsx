"use client";

import moduleStyle from "./Navbar2.module.css"
import ModuleClassname from "@/lib/cssUtil";
import { useColorContext } from "@/context/colorScheme";
import NavbarLogo from "@/components/misc/NavbarLogo";
import { useAuthContext } from "@/context/authContext";
import Profile from "@/components/ui-components/navbar/Profile";
import { useMemo } from "react";

type Props = {
    title?: string, titleFallback?: string, showTitleAlways?: boolean,
    children?: React.ReactNode,
    logoStyle?: React.CSSProperties,
    fadeColor?: string,
    profileDisabled?: boolean,
    profileStyle?: React.CSSProperties,
    onProfileClick?: ()=> Promise<any>|any,  
}
export default function Navbar ({
    title, titleFallback, showTitleAlways,
    children, onProfileClick,
    fadeColor, logoStyle,
    profileDisabled, profileStyle
}:Props){
    const css = new ModuleClassname(moduleStyle);
    const { effectiveTheme } = useColorContext();
    const { verified } = useAuthContext()
    //title = title? title.charAt(0).toUpperCase()+title.slice(1): undefined;
    
    const newTitle = useMemo(()=>{
        if(!title) return title;
        const words = title?.replaceAll("-"," ").split(" ");

        words.forEach((word, index)=>{
            words[index] = word.at(0)?.toUpperCase() + word.slice(1);
        });
        return words.join(" ");

    },[title]);
    return <>
    <nav className={css.names(`navbar ${effectiveTheme}`)}
        style={{
            background: fadeColor? `linear-gradient(${fadeColor} 10%, transparent)`:""
        }}
    >
        <div className={css.names(`main`)}>
            <NavbarLogo style={logoStyle}/>
            <h2 title={newTitle||undefined} style={{
                display: !titleFallback && !newTitle ? "none":"",
                opacity: titleFallback? 1: !newTitle ? 0:1
            }} className={css.names(`title ${effectiveTheme}`)}>
                {verified || showTitleAlways
                    ? newTitle||titleFallback
                    : "Not Verified"
                }
            </h2>
            {children}
            <Profile onClick={()=>{
                onProfileClick?.();
            }} disabled={profileDisabled}
                style={profileStyle}
            />
        </div>
    </nav>
    </>
}
