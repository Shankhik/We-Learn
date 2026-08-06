"use client";

import ModuleClassname from "@/lib/cssUtil";
import moduleStyle from "./FullPagePopup.module.css"
import { useColorContext } from "@/context/colorScheme";
import { Dispatch, SetStateAction } from "react";

type Props = {
    children?: React.ReactNode,
    zIndex?: number,
    boxStyle?: React.CSSProperties,
    boxClassname?: string,
    style?: React.CSSProperties,
    show: boolean, hideFromDom?: boolean,
    disableOutsideClick?: boolean,
    cleanUp?: (...props: any[])=> Promise<any>|any,
    toggleShow: Dispatch<SetStateAction<boolean>>
}
export default function FullPagePopUp ({
    children, zIndex, boxStyle, style, boxClassname,
    show, toggleShow, disableOutsideClick, hideFromDom, cleanUp
}:Props){
    const css = new ModuleClassname(moduleStyle);
    const {effectiveTheme} = useColorContext();
    return hideFromDom && !show? null:
    <div
        className={css.names(`pop-up ${show?'show':'hide'} ${effectiveTheme}`)}
        style={{
            zIndex: zIndex || 2,
            ...style
        }} onClick={async ()=> {
            // disables outside click
            if(disableOutsideClick) return;

            // For any cleanup function before closing
            if(cleanUp) await cleanUp();

            // Closing the Pop up
            toggleShow(false);
        }}
    >
        <main
            onClick={(e)=>{
                // prevents from triggering parent's onclick()
                e.stopPropagation()
            }}
            className={boxClassname||moduleStyle['main']}
            style={{
                // Will keep it centered
                margin:'auto auto',
                ...boxStyle
            }}
        >
            {children}
        </main>
    </div>
}