"use client";

import type { CSSProperties, ReactNode, ComponentProps } from "react";

import { useColorContext } from "@/context/colorScheme";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { BackIcon, BackIconProps } from "../icons/Icons";

type ToggleIconProps = BackIconProps & {
    isExpanded: boolean
}

const ToggleIcon = ({
    fill, style, isExpanded, ...props
}:ToggleIconProps)=>{
    const {effectiveTheme, returnOnTheme} = useColorContext()
    const svgFill =useMemo(()=>(fill || 
        returnOnTheme("rgb(47, 50, 68)","rgb(206, 213, 255)")
    ),[effectiveTheme, fill]);
    return <>
    <BackIcon width="20px" height="100%" {...props}
    fill={svgFill} style={{
        alignSelf:"center", marginLeft: "auto",
        ...style,
        rotate: isExpanded? "90deg":"270deg"
    }}/>
    </>
}
export type DropDownProps = {
    children?: ReactNode,
    initialShow?: boolean,
    headingChild: ReactNode,
    useObserver?: boolean,
    toggleSvgProps?: BackIconProps
    disabled?: boolean,
    activeStyles?: {
        // Whole Container | Element
        whole?: CSSProperties,
        // Toggle Heading Element 
        heading?: CSSProperties,
        // Collapsing Container
        collapsingContainer?: CSSProperties,
        // Children Container
        // childrenContainer?: CSSProperties,
    },
    styles?: {
        // Whole Container | Element
        whole?: CSSProperties,
        // Toggle Heading Element 
        heading?: CSSProperties,
        // Collapsing Container
        collapsingContainer?: CSSProperties,
        // Children Container
        childrenContainer?: CSSProperties,
    }
}
export function DropDown ({
    children, styles, initialShow, activeStyles,
    headingChild, useObserver, disabled,
    toggleSvgProps
}:DropDownProps){
    const firstClickedRef = useRef(false);
    const [show, setShow]= useState(!!initialShow);
    
    const [isHoveredHeading, setIsHoveredHeading] = useState(false);
    const [isHoveredWhole, setIsHoveredWhole] = useState(false);
    const [isHoveredCollapasable, setIsHoveredCollapasable] = useState(false);

    const refChildren = useRef<HTMLDivElement>(null);
    const [scrollHeight, setScrollHeight] = useState(refChildren.current?.scrollHeight || 0);
    
    // Scroll height Handler
    useLayoutEffect(()=>{
        const element = refChildren.current
        if (!element) return;

        const update = ()=> {
            setScrollHeight(element.getBoundingClientRect().height)
        };

        // Initial Run
        update();   

        if (!useObserver) return;

        const observer = new ResizeObserver(update);
        observer.observe(element)
        
        return ()=> observer.disconnect()
        
    },[children, useObserver]);
    
    // Collapsing Container Style | Kidna Complex
    const styleCollapsingContainer:CSSProperties = useMemo(()=>({
        overflow: "hidden", boxSizing: "content-box",
        transition: firstClickedRef.current // Stops first render animation
            ? `all 0.3s ease , opacity 0.2s ease ${show? "0s":"0s"}`
            : "none",
        justifyContent: "flex-end",
        ...styles?.collapsingContainer,
        ...(show || isHoveredCollapasable? activeStyles?.collapsingContainer:undefined),
        opacity: show? 1:0,
        height: !firstClickedRef.current && !scrollHeight && initialShow? "auto": show? scrollHeight: "0px",
    }),[
        initialShow, scrollHeight, show, isHoveredCollapasable,
        activeStyles?.collapsingContainer, styles?.collapsingContainer
    ]);

    const styleHeading:CSSProperties =useMemo(()=>({
        userSelect: "none",
        display: "flex", transition: "all 0.2s ease",
        ...styles?.heading,
        ...(show || isHoveredHeading? activeStyles?.heading: undefined)
    }),[styles?.heading, show, isHoveredHeading, activeStyles?.heading]);

    const styleChildrenContainer: CSSProperties = useMemo(()=>({
        display: "flex", flexDirection: "column",
        transition: "all 0.2s ease",
        ...styles?.childrenContainer
    }),[styles?.childrenContainer]);

    return <>
    <div style={{
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        transition: "all 0.2s ease",
        ...styles?.whole,
        ...(show || isHoveredWhole? activeStyles?.whole: undefined)
    }}  onMouseEnter={()=>setIsHoveredWhole(true)}
        onMouseLeave={()=>setIsHoveredWhole(false)}
    >
        {/* Toggle Section */}
        <div style={styleHeading}
            tabIndex={1}
            onClick={()=> {
                if (disabled) return;
                if (!firstClickedRef.current)
                    firstClickedRef.current = true;
                setShow(prev => !prev);
            }} onKeyDown={handleKeyDown()}
            onMouseEnter={()=>setIsHoveredHeading(true)}
            onMouseLeave={()=>setIsHoveredHeading(false)}
        >

            {/* Heading Children */}
            {headingChild}

            {/* Arrow Svg */}
            <ToggleIcon isExpanded={show} {...toggleSvgProps}/>
        </div>
        <div style={styleCollapsingContainer}
            onMouseEnter={()=>setIsHoveredCollapasable(true)}
            onMouseLeave={()=>setIsHoveredCollapasable(false)}
        >
            <div style={styleChildrenContainer} ref={refChildren}>
                {children}
            </div>
        </div>
    </div>
    </>
}

const handleKeyDown = <T extends HTMLElement = HTMLDivElement>(
    callback?: (e: React.KeyboardEvent<T>) => void
) =>(
    (e: React.KeyboardEvent<T>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.currentTarget.click();
            callback?.(e);
        }
    }
);