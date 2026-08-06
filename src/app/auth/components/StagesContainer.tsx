"use client";

import useMainContexts from "@/lib/hooks/useMainContexts";
import moduleStyle from "./StagesContainer.module.css";
import useClassname from "@/lib/hooks/useClassname";
import { useCallback, useMemo, useState } from "react";
import { colorScheme } from "@/lib/color/appColors";

type WithChildren<T extends unknown=unknown> = T & {
    children?: React.ReactNode
};

type StagesContainerProps = {
    // stages: React.ReactNode[],
    stages?: {
        [key in string]: React.ReactNode
    }
    activeStage: number,
    style?: React.CSSProperties
};

export default function StagesContainer ({
    stages, activeStage, style
}: StagesContainerProps){
    const css = useClassname(moduleStyle);
    const {effectiveTheme} = useMainContexts();

    const stagesDetails = useMemo(()=>{
        if(!stages) return [];
        return  Object.entries(stages).map(([stageName, node])=>({stageName, node}))
    },[stages]);

    const xTranslate = useMemo(()=>Math.min(
        activeStage-1,
        Math.max(0, stagesDetails.length-1)
    ),[stagesDetails.length, activeStage]);
    
    return <>
    <div style={{ overflow: "hidden",
        ...style
    }} className={css.names(`clamp main-box`)}>
        <div className={moduleStyle['window']} style={{
            translate: `-${(xTranslate)*100}% 0`,
            color: effectiveTheme==="light"
            ? "rgb(62, 69, 105)"
            : "rgb(234, 236, 255)",
        }}>{stagesDetails.map((stage, i)=>(
            <Stage key={i} title={stage.stageName||undefined}
            isActive={i === activeStage-1}>
                {stage.node}
            </Stage>
        ))}</div>
    </div>
    </>
}

type StageProps = {
    children?: React.ReactNode,
    isActive?: boolean,
    title?: string
}
const Stage = ({
    children, isActive, title
}:StageProps)=>{
    const css = useClassname(moduleStyle);
    return <>
    <div className={css.names(`stage-container ${isActive?"active":""}`)}>
        {children}
        <h5 style={{
            fontWeight:600,
            overflow: "hidden", opacity: isActive && title?1:0,
            textAlign:"center", whiteSpace:"nowrap", maxWidth:"90%",
            textOverflow:"ellipsis", transition: "opacity 0.3s ease"
        }}>{title}</h5>
    </div>
    </>
}