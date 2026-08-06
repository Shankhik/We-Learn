"use client";

import ModuleClassname from "@/lib/cssUtil";
import moduleStyle from "./Components.module.css"
import { useAuthContext } from "@/context/authContext";
import { useColorContext } from "@/context/colorScheme";
import NavbarLogo from "@/components/misc/NavbarLogo"
import { Activity } from "react";

export const PageNavbar = ({title}:{
    title?: string,
})=>{
    const css = new ModuleClassname(moduleStyle)
    const { effectiveTheme }= useColorContext();
    const { verified } = useAuthContext()
    return <>
    <nav className={css.names(`navbar ${effectiveTheme}`)}>
        <div className={css.names(`main`)}>
            <NavbarLogo/>
            <Activity mode={!title?"hidden":"visible"}>
                <h2 title={title||undefined}
                    className={css.names(`title ${effectiveTheme}`)}
                >{verified?title:"Not Verified"}</h2>
            </Activity>
        </div>
    </nav>
    </> 
}
