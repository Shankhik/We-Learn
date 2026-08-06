"use client";

import Button from "@/components/buttons/NewButton";
import MainContent from "@/components/ui-components/layout-structure/MainContent";
import Page from "@/components/ui-components/layout-structure/Page"
import Navbar from "@/components/navbar/Navbar2"
import ProfilePopup from "@/components/popup/ProfilePopup"

import moduleStyle from "./LearnLayout.module.css";
import { Activity, RefObject, Suspense, use, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ModuleClassname from "@/lib/cssUtil";
import { useColorContext } from "@/context/colorScheme";

type Props = {
    children?: React.ReactNode,
    courseId: string,
    courseName: string|undefined,
    moduleTitlesPromise : Promise<string[]|undefined>,
    completedUptoPromise : Promise<number|null>
}
export default function LearnCourseLayout ({
    children, courseName, courseId,
    moduleTitlesPromise,
    completedUptoPromise
}:Props){
    console.log("rendered layout")
    const pathname = usePathname();

    const showModulesNavbar = useMemo(()=>{
        return pathname.startsWith(`/course/${courseId}/`);
    },[pathname]);

    const floatingNavbarRef = useRef<HTMLDivElement>(null)
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    
    return <>
    <ProfilePopup show={showProfileOptions}
        setShow={setShowProfileOptions}
    />
    <Page>
        <Navbar titleFallback="Loading..."
            title={courseName||""}
            onProfileClick={()=> setShowProfileOptions(true)}
        >
        </Navbar>
        <MainContent>
            {children}
        </MainContent>
        <Suspense>
            <FloatingNavbar
                //courseId={courseId}
                show={showModulesNavbar}
                moduleTitlesPromise={moduleTitlesPromise}
                completedUptoPromise={completedUptoPromise}            
            />
        </Suspense>
    </Page>
    </>
}

const FloatingNavbar = ({
    completedUptoPromise, moduleTitlesPromise, show
}: Pick<Props,"completedUptoPromise"|"moduleTitlesPromise">&{
    show: boolean,
    //courseId: string,
    //ref: RefObject<HTMLDivElement|null>
})=>{
    const css = new ModuleClassname(moduleStyle);
    const { effectiveTheme } = useColorContext()
    const { push } = useRouter();
    let completedUpto = use(completedUptoPromise);
    let moduleTitles = use(moduleTitlesPromise);

    const containerRef = useRef<HTMLDivElement>(null);
    
    const list = useMemo(()=>{
        if( completedUpto===null ||
            !moduleTitles ||
            moduleTitles.length===0
        )
            return <h4
                className={css.names(`module-title ${effectiveTheme} `)}
            >No modules to show</h4>;
        
        return moduleTitles.map((title, index)=>{
            const mode = index+1 <= completedUpto+1 ? "on":"off";
            return <h4 key={index}
            onClick={()=>{
                if (mode=== "off") return;
                push(`./${index+1}`)
            }}
            className={css.names(`module-title ${effectiveTheme} ${mode}`)}>
                {index+1}. {title}
            </h4>
        });
    },[moduleTitles, completedUpto, effectiveTheme]);

    const [showList, setShowList] = useState(false);

    useEffect(()=>{
        const close = (e:PointerEvent)=>{
            if (containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                e.stopPropagation();
                e.preventDefault();
                setShowList(false);
            };
        }

        if(showList) {
            window.addEventListener("click",close);
        }
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
                {list}
            </div>
            <div className={css.names(`floating-navbar ${effectiveTheme}`)}>
                <Button onClick={()=> setShowList(prev=>!prev)}>Toggle</Button>
            </div>
        </div>
        
    </Activity>
    </>
}
