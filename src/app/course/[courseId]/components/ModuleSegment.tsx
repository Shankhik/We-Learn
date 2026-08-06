"use client";

import moduleStyle from "./ModuleSegment.module.css";
import ModuleClassname from "@/lib/cssUtil";

import { useColorContext } from "@/context/colorScheme";
import { UserTrack } from "@/types/databaseTypes";
import React, { use, useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/buttons/NewButton";

const ModulesSegment = React.memo(({
    userTrackPromise, moduleTitlePromise, courseNamePromise
}:{
    courseNamePromise?: Promise<string|undefined>,
    userTrackPromise: Promise<UserTrack['enrolled'][number]|null>,
    moduleTitlePromise : Promise<string[]|undefined>
})=>{
    const css = new ModuleClassname(moduleStyle);
    const userTrack = use(userTrackPromise);
    const moduleTitles = use(moduleTitlePromise);
    const courseName = courseNamePromise?
        use(courseNamePromise):undefined

    if (!userTrack) return <>
        <h2>You are not enrolled</h2>
    </>
    else if (!moduleTitles) return <>
        <h4>Couldn&apos;t fetch course modules</h4>
    </>

    const {push} = useRouter();
    const pathname = usePathname();

    const getStatus = useCallback((index: number)=>{
        //if (index+1>=moduleTitles.length) return "completed";

        const status = index === userTrack.completedUpto?"resume":
        index<userTrack.completedUpto?"completed":"locked"
        return status
    },[userTrack.completedUpto]);

    const continueModule = Math.min(userTrack.completedUpto+1,moduleTitles.length)
    const onContinue = ()=>{
        push(`${pathname}/${continueModule}`)
    }
    return <>
    <ModulesBlock>
        <div style={{display:"flex", gap:'12px', marginBottom:"10px"}}>
            <h2 className={moduleStyle['continue-header']}>{
                userTrack.completedUpto===0? courseName?<>
                    Start with <span style={{fontWeight:800}}>{courseName}</span>
                </> : <>Start this course</> :<>
                    Resume from chapter {userTrack.completedUpto+1}
                </>
            }</h2>

            <Button onClick={onContinue}
            style={{marginLeft:"auto", whiteSpace:"nowrap"}}>
                ▶️ {userTrack.completedUpto===0?"Start":"Continue"}
            </Button>
        </div>
        <h2 style={{marginBottom:'17px'}}>Modules</h2>
        {moduleTitles.map((title, index)=>(
            <Module title={title} index={index}
            status={getStatus(index)}
            key={`${userTrack.courseId}-m-${index}`}/>
        ))}
    </ModulesBlock>
    </>
})

const Module = React.memo(({title, index, status}:{
    status: "completed"|"resume"|"locked"
    title: string,
    index: number
})=>{
    const css = new ModuleClassname(moduleStyle);
    const {effectiveTheme} = useColorContext();
    const router = useRouter();
    const pathname = usePathname()
    
    const statusStyle:React.CSSProperties = {
        margin:"0 0 5px auto", 
        borderRadius: "10px", padding:"1px 8px",
        color: status==='locked'?"rgb(82, 82, 82)":
        "rgba(255, 255, 255, 0.75)",
        backgroundColor: status==="completed"?"rgb(49, 136, 93)":
            status==='resume'?"rgb(45, 81, 158)":"rgba(95, 95, 95, 0.4)"
    }
    return <>
        <div className={css.names(`module ${effectiveTheme} ${status}`)}
            style={{
                cursor: status==='locked'?"not-allowed":"",
            }}
            onClick={()=>{
                if(status==="locked") return;
                router.push(`${pathname}/${index+1}`)
            }}
        >
            <span style={statusStyle}>
                {index===0 && status==='resume'?"start":status}
            </span>
            <div>
                <h2>{index+1}.</h2>
                <h2 style={{marginLeft:"15px"}}>{title}</h2>
            </div>
        </div>
    </>
})

export const ModulesBlock = ({children}:{
    children?: React.ReactNode
})=>{
    return <div className={moduleStyle['modules-block']}>
        {children}
    </div>
}
export default ModulesSegment;
