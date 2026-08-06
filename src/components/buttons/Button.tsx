'use client';

import { useState } from "react";
import moduleStyle from "./Button.module.css";
import { useRouter } from "next/navigation";
import LoadingAnimation from "../loading/LoadingAnimation";
import HideIf from "../HideIf";
import ModuleClassname from "@/lib/cssUtil";

type Prop = React.ComponentProps<"div"> & {
    children?: React.ReactNode,
    className?: string,
    disabled?: boolean, disabledStyle?: React.CSSProperties,
    href?: string, showLoading?: boolean, hidden?: boolean,
    loadingStyle?:{
        width?: `${number}px`|string,
        height?: `${number}px`|string,
    }, workingStyle?: React.CSSProperties,
    innerStyle?:React.CSSProperties,
    onClick?: (e?:any)=> Promise<any>|any
}
export default function Button2 ({
    children, onClick, className, href, showLoading,
    loadingStyle, workingStyle, innerStyle, hidden,
    disabled, disabledStyle, ...props
}:Prop){
    const css = new ModuleClassname(moduleStyle);
    const [isWorking, setIsWorking] = useState<boolean>(false);
    const {push} = useRouter()
    return !children || hidden ? null:
    <div 
        tabIndex={0} role={'button'}
        {...props}
        className={className||moduleStyle['button']}
        style={{
            ...props.style, display:'flex',
            ...(isWorking? workingStyle:undefined),
            ...(disabled? disabledStyle || {
                backgroundColor:'grey', color:'white'
            }: undefined)
        }}
        onClick={async ()=>{
            if(isWorking || disabled ) return;
            if(href) push(href);
            else if (onClick){
                setIsWorking(true);
                await onClick();
                setIsWorking(false);
            }
        }}
    >
        <LoadingAnimation 
            height= {loadingStyle?.height||'auto'}
            width= {loadingStyle?.width||'30px'}
            style={{ position:'absolute',
                alignSelf:'center', justifySelf:'center',
                top:0, left: 0, right:0, bottom: 0
            }}
            hidden={!(showLoading && isWorking)}
        />
        
        <div className={css.names(`main ${showLoading && isWorking?'hide':''}`)}
            style={{...innerStyle}}
        >
            {children}
        </div>
    </div>
}