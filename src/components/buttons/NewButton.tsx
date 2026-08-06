'use client';

import ModuleClassname from "@/lib/cssUtil";
import moduleStyle from "./NewButton.module.css";
import { useColorContext } from "@/context/colorScheme";
import { useRef, useState } from "react";
import LoadingAnimation from "../loading/LoadingAnimation";
import Link from "next/link";
import { colorScheme } from "@/lib/color/appColors";

type Props = React.ComponentProps<'button'> & {
    children?: React.ReactNode,
    disabled?: boolean,
    showLoading?: boolean,
    hoverStyle?: React.CSSProperties,
    loadingStyle?: React.CSSProperties,
    overwriteClassname?: boolean,
    disabledStyle?: React.CSSProperties,
    importedModule?: {
        readonly [key: string]: string;
    },
    href?: string,
    hrefMode?: "push"|"replace",
    target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target']
    blurRadius?:number,
    onClick?: (props?:any[]) => Promise<any>|any
}
export default function Button ({
    children, disabled, disabledStyle, onClick, hidden, className, hoverStyle,
    loadingStyle, overwriteClassname, showLoading, blurRadius, importedModule,
    href, hrefMode, target, ...props
}:Props) {
    const {effectiveTheme} = useColorContext();
    
    const css = new ModuleClassname(moduleStyle);
    const link = useRef<HTMLAnchorElement>(null);

    const getClassname = ()=>{
        const isHidden = isWorking && showLoading? moduleStyle['hide']:''
        const cl = `${css.names(`button ${effectiveTheme}`)} ${className} ${isHidden}`;
        if(overwriteClassname)
            return `${className} ${isHidden}`;
        return cl
        //return `${css.names(`button ${effectiveTheme}`)} ${className} ${isHidden}`;
    }

    const [isWorking, setIsWorking] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const localWorkingStyle:React.CSSProperties= {
        filter:'none', boxShadow:'none',
        ...loadingStyle,
        color: 'transparent'
    }
    const localDisabledStyle:React.CSSProperties= {
        filter:'none', boxShadow:'none',
        ...disabledStyle
    }
    const localHoverStyle:React.CSSProperties= {
        // Add styles if u want,
        ...hoverStyle,
    }
    const clickHandle = async (e:React.MouseEvent) =>{
        if( disabled || isWorking ) return;
        
        if( href && link.current ){
            link.current.click();
        } 
        else if(onClick){
            (e.target as HTMLDivElement).blur();
            setIsWorking(true);
            await onClick();
            setIsWorking(false);
        }
    }

    return hidden? null:<>
    {href && <Link href={href} replace={hrefMode==="replace"} target={target} style={{display:'none'}} ref={link}></Link>}
    <button
        {...props}
        className={getClassname()}
        style={{
            backgroundColor: colorScheme.button.bg[effectiveTheme],
            color: colorScheme.button.color[effectiveTheme],
            ...props.style,
            backdropFilter: blurRadius?`blur(${blurRadius}px)`:'',
            // Hover style [when it's not in 'WORKING' state]
            ...(isHovered && !disabled && !isWorking?
                localHoverStyle:undefined),
            // Disabled Style
            ...(disabled? localDisabledStyle: undefined),
            // Loading style
            ...(showLoading && isWorking?localWorkingStyle:undefined),
            // Important for loading animation
            position:'relative',
            //color: showLoading && isWorking? 'transparent': (props.style?.color||''),
        }}
        onClick={clickHandle} 
        onMouseEnter={()=> setIsHovered(true)}
        onMouseLeave={()=> setIsHovered(false)}
    >   
        {children}
        <LoadingAnimation style={{
            margin:'auto auto',
            position:'absolute', height:'30%',
            top:0, left: 0, right: 0, bottom:0,
        }} hidden={!isWorking || !showLoading}
        className={moduleStyle['loading']}
        />
    </button>
    {/* <LoadingAnimation style={{
            margin:'auto auto',
            position:'absolute', height:'30%',
            top:0, left: 0, right: 0, bottom:0,
        }} hidden={isWorking || showLoading}/> */}
    </>
}

