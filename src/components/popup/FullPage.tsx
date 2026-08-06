"use client";

import LoadingAnimation from "../loading/LoadingAnimation";
import moduleStyle from "./FullPage.module.css";
import { useEffect, useState } from "react";
import React from "react";

type Props = {
    backgroundBeforeMount?: string,
    width?: string,
    height?: string,
    mode: "loading"|"unauthorized"|null,
    blur?: `${number}px`
    zIndex: number,
}
const FullPageOverlay = React.memo(({
    mode, zIndex, width, height, backgroundBeforeMount, blur
}:Props)=>{
    // -> needed for fade effect
    const [show, setShow] = useState<boolean>(mode!==null)
    
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const color = {
        red: "rgba(54, 21, 21, 0.5)",
        green: "rgba(24, 58, 38, 0.5)",
        blue: "rgba(32, 53, 92, 0.5)",
    }
    useEffect(()=>{
        const process = async()=>{
            if(mode) {setShow(true); return;};
            await delay(400);
            setShow(prev => {
                if (prev) return false;
                return true;
            })
        }
        process();
    },[mode])

    const loading = <LoadingAnimation className={moduleStyle['loading']}/>
    const unauthorized = (
        <svg viewBox="0 0 100 100" style={{
            // width: width||"200",
            height: height||"auto",
        }} className={moduleStyle['unauthorized']}>
        <path
        d="M50.062 9.746a6.766 6.766 0 0 0-6.078 3.822h-.037L6.393 78.51a6.766 6.766
            0 0 0-.01.015l-.125.217h.008a6.766 6.766 0 0 0-.948 3.428 6.766 6.766 0 0 0 6.768 6.766
            6.766 6.766 0 0 0 .012 0v.005l75.634.057v-.012a6.766 6.766 0 0 0 .19.014 6.766 6.766 0 0
            0 6.765-6.768v-.003a6.766 6.766 0 0 0-.904-3.342h.022L56.156 13.568h-.008a6.766 6.766 0 0
            0-6.085-3.822Z"
        style={{ fill: "#ff5d5d", fillOpacity: 1, stroke: "#ffa4a4", strokeWidth: 5,
            strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: "none", strokeOpacity: 1,
            paintOrder: "markers fill stroke",
        }}/>
        <path
        d="M39.084 54.935v-5.834c0-13.435 21.54-13.41 21.744 0l.088 5.834"
        style={{
            fill: "none",
            fillOpacity: 1,
            stroke: "#5b0909",
            strokeWidth: 4,
            strokeLinecap: "butt",
            strokeLinejoin: "round",
            strokeDasharray: "none",
            strokeOpacity: 0.619469,
            paintOrder: "markers fill stroke",
        }}
        />
        <path
        d="M39.747 50.125h20.506a6.857 6.857 0 0 1 6.872 6.872v14.006a6.857 6.857 0 0 1-6.872 6.872H39.747a6.857 6.857 0 0 1-6.872-6.872V56.997a6.857 6.857 0 0 1 6.872-6.872z"
        style={{
            fill: "#b22929",
            fillOpacity: 1,
            stroke: "none",
            strokeWidth: 0,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeOpacity: 1,
            paintOrder: "markers fill stroke",
        }}
        />
        <path
            d="M49.998 67.625a2.188 2.188 0 0 0-2.185 2.188 2.188 2.188 0 0 0 .812 1.697v.99c0 .762.613 1.375 1.375 1.375s1.375-.613 1.375-1.375v-.992a2.188 2.188 0 0 0 .813-1.695v-.003a2.188 2.188 0 0 0-2.19-2.185Z"
            style={{
                fill: "#fff",
                fillOpacity: 0.690265,
                stroke: "none",
                strokeWidth: 3.25581,
                strokeLinecap: "butt",
                strokeLinejoin: "round",
                strokeDasharray: "none",
                strokeOpacity: 1,
                paintOrder: "markers fill stroke",
            }}
        />
        </svg>
    )
    
    return (
        !show? null:
        <div
            className={`${moduleStyle['overlay']} ${mode===null?moduleStyle['off']:""}`} style={{
                zIndex: zIndex,
                opacity: show?1:0,
                backdropFilter: `blur(${blur})`,
                background: backgroundBeforeMount||"rgba(17, 21, 32, 1)"
            }}
        >
            {!mode? null: mode==='loading'? loading : unauthorized}
        </div>
    )
})
export default FullPageOverlay