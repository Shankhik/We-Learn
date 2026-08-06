"use client";

import moduleStyle from "./FloatingButtons.module.css";
import ModuleClassname from "@/lib/cssUtil";

import React, { Activity, use, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useColorContext } from "@/context/colorScheme";
import Button from "@/components/buttons/NewButton";
import { useNotification } from "@/context/notification";
import { useModuleDetails } from "./ModuleDetailsContext";

type FloatingProps = {
    courseId: string,
    // moduleTitlesPromise : Promise<string[]|undefined>,
    //completedUptoPromise : Promise<number|null>,
    //isCompletedPromise: Promise<boolean>
}
export default React.memo(({
    courseId
}: FloatingProps)=>{

    // let completedUpto = use(completedUptoPromise);
    // let moduleTitles = use(moduleTitlesPromise);
    // let isCompleted = use(isCompletedPromise);

    const css = new ModuleClassname(moduleStyle);
    const { effectiveTheme } = useColorContext();
    const { pushNotification } = useNotification();
    const { push } = useRouter();
    
    const {currentModule, userTrack, moduleTitles, modulesCount} = useModuleDetails();
    const isCompleted = userTrack?.completionDate?true: false;

    const pathname = usePathname();

    const [show, setShow] = useState(()=>{
        return pathname.startsWith(`/course/${courseId}/`)
    });

    const containerRef = useRef<HTMLDivElement>(null);
    
    const onModuleClick = (mode:"on"|"off",index:number)=>{
    return async ()=>{
        if (mode=== "off"){
            pushNotification("Complete your ongoing chapter first.",{
                color:"yellow"
            });
            return;
        }
        if (pathname === `/course/${courseId}/${index+1}`){
            pushNotification("Bruhh... This is the same Chapter 😒",{
                color:'blue'
            });
            return;
        }
        push(`./${index+1}`);
    }}

    const moduleList = useMemo(()=>{
        if( userTrack?.completedUpto===undefined ||
            !moduleTitles ||
            moduleTitles.length===0
        )
            return <h4
                className={css.names(`module-title ${effectiveTheme} off`)}
            >No modules to show</h4>;
        
        return moduleTitles.map((title, index)=>{
            const mode = index+1 <= userTrack.completedUpto+1 ? "on":"off";
            //const moduleNumber = parseInt(pathname.split("/").at(3)??"");
            
            return <h4 key={index} onClick={onModuleClick(mode,index)}
                className={css.names(`module-title ${effectiveTheme} ${mode}`)}
            >
                {currentModule===index+1?
                <span className={moduleStyle['active-arrow']}>
                &#8658; </span> :`${index+1}.`} {title}
            </h4>
        });
    },[currentModule, moduleTitles, userTrack?.completedUpto, effectiveTheme]);

    const [showList, setShowList] = useState(false);
    
    // Closes the modules list on Pathchange
    useEffect(()=>{
        setShow(pathname.startsWith(`/course/${courseId}/`))
        setShowList(false);
    },[pathname]);

    // Outside click handler
    useEffect(()=>{
        const close = (e:PointerEvent)=>{
            if (containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                e.stopPropagation(); e.preventDefault();
                setShowList(false);
            };
        }

        if(showList)
            window.addEventListener("click",close);
        return ()=>{
            window.removeEventListener("click", close)
        }
    },[showList]);

    return <>
    <Activity mode={show?'visible':'hidden'}>
        <div className={css.names(`floating-navbar-container`)}
            ref={containerRef}
        >
            <div className={
                css.names(`module-list ${showList?"show":"hide"} ${effectiveTheme}`)
            }>
                {moduleList}
            </div>
            <div className={css.names(`floating-navbar ${effectiveTheme}`)}>
                <ChaptersButton toggle={setShowList}>
                    Chapter {currentModule?? "Nil"}
                </ChaptersButton>

                <ChapterNavigate type="prev"
                disabled={!currentModule || currentModule<=1}/>

                <ChapterNavigate type="next"
                disabled={
                    // If current module is not  number
                    !currentModule ||
                    currentModule>= Math.min(
                        modulesCount,
                        (userTrack?.completedUpto??0)+1
                    )
                    //currentModule>=(userTrack?.completedUpto??0)+1
                }/>

            </div>
        </div>
        
    </Activity>
    </>
})

const ChaptersButton = ({children, toggle}:{
    children?: React.ReactNode,
    toggle: React.Dispatch<React.SetStateAction<boolean>>
})=>{
    const css = new ModuleClassname(moduleStyle);
    const { effectiveTheme } = useColorContext();
    return <>
    <button className={css.names(`chapter-button ${effectiveTheme}`)}
        onClick={()=>toggle(prev=>!prev)}
    >
        {children}
    </button>
    </>
}
const ChapterNavigate = ({type, disabled}:{
    type: "next"|"prev",
    disabled?: boolean
})=>{
    const css = new ModuleClassname(moduleStyle);
    const { effectiveTheme } = useColorContext();
    const { push } = useRouter();
    const { modulesCount, currentModule } = useModuleDetails()
    const onKeyDown = (e:React.KeyboardEvent<HTMLDivElement>)=>{
        if (e.key === "Enter"){
            console.log("Enter pressed")
            e.currentTarget.click();
        }
    }
    const onClick = async ()=>{
        if (disabled || !currentModule) return;
        if(type === "next"){
            push(`${Math.min(currentModule+1,modulesCount)}`)
        }else{
            push(`${Math.max(currentModule-1,0)}`)
        }
        
    }
    return <>
    <div role="button" tabIndex={0}
        className={css.names(`chapter-navigate ${effectiveTheme} ${disabled?"off":""}`)}
        style={{cursor:disabled?"not-allowed":"pointer"}}
        onKeyDown={onKeyDown} onClick={onClick}
    >
        <NavigateButtons type={type} disabled={disabled} height={"60%"}/>
    </div>
    </>
}

const NavigateButtons = ({type, disabled, width, height}:{
    type: "next"|"prev",
    width?: string|number, height?: string|number,
    disabled?: boolean
})=>{
    return <>
    <svg //xmlns="http://www.w3.org/2000/svg"
        width={width||50} height={height||50} viewBox="0 0 50 50"
        style={{ margin:"5px",
            transform: `scaleX(${type==='prev'?"-1":"1"})`
        }}
    >
    <path
        d="M17.345 4.913c-.941 0-1.881.36-2.602 1.08a3.673 3.673 0 0 0 0 5.206l11.308 11.31s1.412 1.464 1.412 2.49c0 1.027-1.406 2.486-1.406 2.486L14.743 38.8a3.673 3.673 0 0 0 0 5.205 3.67 3.67 0 0 0 5.203 0l16.328-16.328A3.665 3.665 0 0 0 37.353 25a3.665 3.665 0 0 0-1.079-2.677L19.946 5.994a3.666 3.666 0 0 0-2.601-1.08Z"
        fill={disabled?"rgba(167, 167, 167, 0.8)":"rgb(255, 255, 255)"}
        />
    </svg>
    </>
}