'use client';

import ModuleClassname from "@/lib/cssUtil";
import moduleStyle from "./global.module.css";
import { RefObject, useEffect, useRef } from "react";

type Props = {
    HorizontalContainer: React.ComponentProps<'div'> & {
        children?: React.ReactNode,
        showScrollbar?: boolean,
        ref?: RefObject<HTMLDivElement>,
        gap?: number
    }
}

const css = new ModuleClassname(moduleStyle);

export const HorizontalContainer = ({
    children, showScrollbar, ref, gap, ...rest
}:Props['HorizontalContainer'])=>{
    const style:React.CSSProperties = {
        ...rest.style,
        scrollbarWidth: showScrollbar? 'auto':'none'
    }
    const main = useRef<HTMLDivElement>(ref?.current || null);
    
    useEffect(()=>{
        const element = main.current
        if (!element) return; // flex gap in px
        const children = element.children
        const childWidth = element.children[0]?.getBoundingClientRect().width || 0
        const gapToApply = gap || parseFloat(element.computedStyleMap().get('gap') as string||'0');
        
        const onWheel = (e: WheelEvent)=>{
            e.preventDefault();
            if(!childWidth || !gapToApply) return;
            
            element.scrollTo({
                left: element.scrollLeft + (
                    e.deltaY<0? -childWidth-gapToApply: childWidth+gapToApply
                ),
                behavior: 'smooth'
            })
        }
        
        element.addEventListener('wheel',onWheel)
        return ()=>{
            element.removeEventListener('wheel',onWheel)
        }
    }, [gap]);

    return<>
    <div {...rest}
        ref={main} style={style}
        className={`${moduleStyle['horizontal-scroll']} ${rest.className || ''}`}
    >
        {children}
    </div>
    </> 
}
