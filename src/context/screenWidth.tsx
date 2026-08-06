'use client';

import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { setCookie } from "@/lib/cookies";
type ScreenDimensions = {
    width: number|null,
    height: number|null
}
export const screenDimension = createContext<ScreenDimensions>({
    // Initial values
    width: null,
    height: null
});

export const ScreenDimensionsProvider = ({children, initialDimension}:{
    children?: React.ReactNode,
    initialDimension?: {
        width: null| number, height: null| number,
    }
})=>{
    const [dimensions,setDimensions]=useState<ScreenDimensions>({
        width: initialDimension?.width || null,
        height: initialDimension?.height ||null
    })
    useLayoutEffect(()=>{
        const update = ()=>{
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
            setCookie("DIMENSIONS",`w_${window.innerWidth} h_${window.innerHeight}`);
        }
        // First render
        if (!dimensions.height || !dimensions.width)
            update();

        window.addEventListener("resize", update);
        return ()=>{
            window.removeEventListener("resize", update);
        }
    },[]);
    return <>
    <screenDimension.Provider value={dimensions}>
        {children}
    </screenDimension.Provider>
    </>
}

export const useScreenDimension= (initial?:{
    width?: number, height?: number
})=>{
    const {width, height} = useContext(screenDimension);
    return {
        width: width||initial?.width||null ,
        height: height||initial?.height||null
    }
}