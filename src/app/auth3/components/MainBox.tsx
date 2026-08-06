"use client";

import { useColorContext } from "@/context/colorScheme";
import moduleStyle from "./MainBox.module.css";
import ModuleClassname from "@/lib/cssUtil";

type PropMainBox = {
    children?: React.ReactNode,
    style?: React.CSSProperties
}

export default function MainBox ({
    children, style
}:PropMainBox){
    const css = new ModuleClassname(moduleStyle);
    const {effectiveTheme} = useColorContext()
    
    return <>
    <div style={style} className={css.names(`main-box ${effectiveTheme}`)}>
        {children}
    </div>
    </>
}