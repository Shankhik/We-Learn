"use client";

import React, { CSSProperties } from "react";
import moduleStyle from "./LoadingAnimation.module.css";

type Props = {
    width?: string, height?: string,
    style?: CSSProperties, hidden?: boolean,
    className?: string,
    circlesFill?: string,
    circleColors?: {
        first?: string, second?: string, third?: string
    }
}

const LoadingAnimation = React.memo(({
    width, height, style,
    className, hidden, circleColors,
    circlesFill
}:Props) => <>
    <svg
        viewBox="0 0 200 100"
        version="1.1"
        style={{
            width: width,
            height: height||"100%",
            display: hidden? "none":"",
            ...style
        }}
        id="svg1"
        className={`${className}`}
        >
        
        <g className={`${moduleStyle["circles-group"]}`} fill='rgb(255,255,255)'>
        <circle
            fill={circleColors?.third || circlesFill || 'rgb(147, 175, 235)'}
            style={{strokeWidth:'0.377953',strokeLinecap:'round',strokeLinejoin:'round',paintOrder:"stroke markers fill"}}
            id="circle3"
            cx="160"
            cy="50"
            r="20.993589"
        />
        <circle
            fill={circleColors?.second|| circlesFill  || 'rgb(173, 255, 156)'}
            style={{strokeWidth:'0.377953',strokeLinecap:'round',strokeLinejoin:'round',paintOrder:"stroke markers fill"}}
            id="circle2"
            cx="100"
            cy="50"
            r="20.993589"
        />
        <circle
            fill={circleColors?.first|| circlesFill  || 'rgb(255, 168, 156)'}
            style={{strokeWidth:'0.377953',strokeLinecap:'round',strokeLinejoin:'round',paintOrder:"stroke markers fill"}}
            id="circle1"
            cx="40"
            cy="50"
            r="20.993589"
        />
        </g>
    </svg>
</>)
LoadingAnimation.displayName='LoadingAnimation';

export default LoadingAnimation;