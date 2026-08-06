"use client";

import moduleStyle from "./ProfileButton.module.css"
import ModuleClassname from "@/lib/cssUtil";

export default function ProfileButton ({...props}:{
    children?: React.ReactNode,
    iconBg?: string
}){
    const css = new ModuleClassname(moduleStyle);
    return <>
    <div className={css.names(``)}>

    </div>
    </>
}