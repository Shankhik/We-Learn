"use client";

import ModuleClassname from "@/lib/cssUtil";
import moduleStyle from "./Page.module.css"
import { useColorContext } from "@/context/colorScheme";

export default function Page ({children}:{
    children?: React.ReactNode
}){
    const {effectiveTheme} = useColorContext();
    const css = new ModuleClassname(moduleStyle);
    return <>
    <div className={css.names(`page ${effectiveTheme}`)}>
        {children}
    </div>
    </>
}