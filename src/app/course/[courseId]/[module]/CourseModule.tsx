"use client";

import moduleStyle from "./CourseModule.module.css";
import ModuleClassname from "@/lib/cssUtil";

import Button from "@/components/buttons/NewButton";
import { useNotification } from "@/context/notification";
import { Course, UserTrack } from "@/types/databaseTypes";
import { usePathname, useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { useColorContext } from "@/context/colorScheme";
import { ParseHtml, ParseMarkdown } from "@/lib/htmlParser";
import ParsedHTML from "@/components/htmlElements/ParsedHTML";
import { ModulesBlock } from "../components/ModuleSegment";
import { useModuleDetails } from "../components/ModuleDetailsContext";

type Props = {
    moduleNumber: number,
    completedUpto: number,
    initialUserTrack: UserTrack['enrolled'][0] |null
    modulePromise: Promise<
        Course['modules'][0] & { modulesLength: number }
    |null>
    //userTrackPromise: Promise<UserTrack['enrolled'][0]|null>
}
export default function CourseModule ({
    moduleNumber,
    completedUpto,
    initialUserTrack,
    modulePromise
}:Props){

    const module = use(modulePromise);

    const css = new ModuleClassname(moduleStyle);

    const { push } = useRouter();

    const { pushNotification } = useNotification();
    const { effectiveTheme } = useColorContext();

    const {
        currentModule, markAsRead: completeModule,
        updateUserTrack, userTrack: track
    } = useModuleDetails();
    
    // Update the Context's userTrack on new Module Render
    // It helps to in Syncing with current data
    // -> As Context is in layout.tsx [won't change on module change]
    useEffect(()=>{
        updateUserTrack(initialUserTrack)
    },[initialUserTrack]);

    if (Number.isNaN(parseInt(`${moduleNumber}`)))
        return null;
    
    const onMarkAsRead = async()=>{
        const res = await completeModule();
        if (!res.status)
            pushNotification(res.error||res.message, { color:"red" });
        if (res.status && (res.data as Exclude<typeof track, null>).completionDate)
            pushNotification(
                "Congrats! 🎊 You just completed this course. (●'◡'●)",
                { color :"green" }
            );
    }
    if(!module) return <>
        <ModulesBlock>
            <h2>Module Not Found!</h2>
        </ModulesBlock>
    </>
    
    return <>
    <div className={css.names(`module-name ${effectiveTheme}`)}>
        Chapter: {moduleNumber}<br/>
        <h2 style={{textAlign:'center'}}>
            {module?.title||"Title not found!"}
        </h2>
    </div>
    <ParsedHTML>
        <Content module={module}/>
    </ParsedHTML>
    
    <div style={{display:'flex', marginTop:'auto', flexDirection:'row-reverse'}}>
        <i hidden={moduleNumber>=(track?.completedUpto||0)+1}>
        Completed</i>

        <Button style={{margin:"10px 0", borderRadius:'10px',
            color:"rgba(255, 255, 255, 0.7)",
            background:`linear-gradient(30deg, rgb(0, 131, 238), rgb(90, 80, 226))`
        }}
        onClick={onMarkAsRead} hidden={
            moduleNumber!==(track?.completedUpto||0)+1
        }>
            Mark as <strong>READ</strong>
        </Button>
    </div>
    </>
}

const Content = ({module}:{
    module: Course['modules'][number] & {
        modulesLength: number
    }|null
})=>{
    if (!module || module.blocks.length===0) return null;
    return module.blocks.map((block, index)=>{
        switch (block.type){
            case "markdown":
                return <ParseMarkdown key={index} content={block.content}/>
            case "html":
                return <ParseHtml key={index} content={block.content}/>
            case "video-iframe":
                return <ParseHtml key={index} content={block.content}/>
            default:
                return null;
        }
    })
}