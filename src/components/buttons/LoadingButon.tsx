'use client'
import { useState } from "react"
import cssStyle from "./LoadingButton.module.css"
import React from "react"
import LoadingAnimation from "../loading/LoadingAnimation"
import { useRouter } from "next/navigation"

type Props = React.ComponentProps<"div"> & {
    children: React.ReactNode,
    theme?: 'light'|'dark',
    href?: string,
    //style?: React.CSSProperties,
    onClick?: ()=> Promise<any>|any,
    hoverStyle?: React.CSSProperties,
    loadingStyle?: React.CSSProperties & {
        loadingWidth?: string
    },
    showLoading?: boolean
}
const colors = {
    light: ['rgba(39, 158, 148, 1)', 'rgba(255, 255, 255, 1)'],
    dark: ['rgba(62, 61, 83, 1)', 'rgba(248, 248, 248, 1)']
}
const Button = ({
    children, showLoading, loadingStyle,
    onClick, hoverStyle, theme, href,
    ...props
}:Props)=>{
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isWorking, setIsWorking] = useState<boolean>(false);
    const {push} = useRouter()
    const localLoadingStyle = {...loadingStyle}
    delete localLoadingStyle?.loadingWidth;
    return (
        <div
            tabIndex={0} role={"button"} {...props}
            className={`${cssStyle["loading-button"]} ${props.className}`}
            style={{
                display: props.hidden?"none":"",
                background: colors[theme||'light'][0],
                color: colors[theme||'light'][1],
                filter: !hoverStyle && isHovered ? "brightness(110%)":"",
                ...props.style,
                ...(isHovered? hoverStyle:{}),
                ...(showLoading && isWorking? localLoadingStyle:{})
            }}
            onMouseLeave={()=> setIsHovered(false)}
            onMouseEnter={()=> setIsHovered(true)}
            onClick={async ()=>{
                if(isWorking) return;
                if (href){
                    push(href)
                    return;
                }
                //console.log(loadingStyleWidth)
                setIsWorking(true);
                if (onClick) await onClick();
                setIsWorking(false);
            }}
        >
            <LoadingAnimation
                width= {loadingStyle?.loadingWidth||"20px"}
                height="100%" hidden={!(isWorking && showLoading)}
                style={{
                    position:'absolute',
                    justifySelf:"center",
                }}
            />
            <div style={{display: showLoading && isWorking?"none":""}}>{children}</div>
            {/* {showLoading || !isWorking?
                <LoadingAnimation
                    width= {loadingStyle?.loadingWidth||"20px"}
                    height="100%"
                />:
            } */}
        </div>
    )
}

export default Button;