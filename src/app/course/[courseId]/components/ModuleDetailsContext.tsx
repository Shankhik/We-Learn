"use client";

import { UserTrack } from "@/types/databaseTypes";
import moduleStyle from "./ClientContent.module.css";
import { createContext, use, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { appfetch } from "@/lib/fetchReq";

type Props = {
    userTrackPromise: Promise<UserTrack['enrolled'][number]|null>,
    moduleTitlesPromise: Promise<string[]|undefined>,
    courseId: string|undefined,
    children?: React.ReactNode
}

type ContextType = {
    userTrack: Awaited<Props['userTrackPromise']>,
    updateUserTrack: (userTrack: UserTrack['enrolled'][number]|null)=>void,
    modulesCount: number,
    moduleTitles: string[]|undefined,
    currentModule: number|null,
    courseId: string|undefined,
    markAsRead: ()=> Promise<Status>
}

const moduleDetailsContext = createContext<ContextType>({
    userTrack: null,
    updateUserTrack: (userTrack)=>{},
    modulesCount: 0,
    moduleTitles: undefined,
    currentModule: null,
    courseId: undefined,
    markAsRead: async ()=> ({status:false, error: "just initialized"})
})

export const ModuleDetailsProvider = ({
    userTrackPromise, moduleTitlesPromise,
    children, courseId
}:Props)=>{
    const track = use(userTrackPromise);
    const [userTrack, setUserTrack] = useState(track);
    const moduleTitles = use(moduleTitlesPromise);

    // Won't work if Provider is in any layout.tsx [as it is mounted only once]
    // -> Hence the props won't change
    useEffect(()=>{
        setUserTrack(track);
    },[userTrackPromise]);

    const pathname = usePathname();

    /* * * * * * * * * * Current module Handling * * * * * * * * * */
    const [currentModule, setCurrentModule] = useState(()=>{
        const module = {
            data: parseInt(pathname.split("/").at(3)??"")
        }
        return Number.isNaN(module.data)? null: module.data
    });

    useEffect(()=>{
        setCurrentModule(prev=>{
            const module = {
                data: parseInt(pathname.split("/").at(3)??"")
            }
            return Number.isNaN(module.data)? null: module.data
        });
    },[pathname]);

    const updateUserTrack = (userTrack: Parameters<ContextType['updateUserTrack']>[0])=>{
        if(userTrack === null) return;
        setUserTrack (userTrack);
    }

    /* * * * * * * * Increment completed upto by one * * * * * * * */
    const markAsRead = async ():Promise<Status>=>{
        if (!currentModule) return {
            status: false,
            error: "Current module is invalid"
        };
        const res = await appfetch<Status,{courseId: string}>(
            "/api/user/track-record/mark-as-read",
            { courseId: courseId||"" }
        );

        if(!res) return {
            status: false,
            error: "Bad Response or Response Error"
        };

        if (res.status && res.data)
            updateUserTrack(res.data as UserTrack['enrolled'][number]);
        // setUserTrack(prev=>{
        //     if( prev === null) return prev;
        //     let newData = {...prev};
            
        //     if(
        //         // If there is not completedUpto
        //         newData.completedUpto === undefined ||
        //         // Current module must be completedUpto + 1
        //         currentModule!==prev.completedUpto+1 ||
        //         // If Completed already
        //         prev.completionDate!== undefined
        //     )
        //         return prev;

        //     const completedUpto = Math.min(
        //         prev.completedUpto+1, moduleTitles?.length??0
        //     );
        //     newData.completedUpto = completedUpto;

        //     if (completedUpto === (moduleTitles?.length??0))
        //         newData.completionDate = new Date();
            
        //     return newData;
        // })
        return res;
    }

    
    
    return <moduleDetailsContext.Provider value={{
        courseId, moduleTitles,
        modulesCount: moduleTitles?.length??0,
        currentModule, userTrack, markAsRead,
        updateUserTrack,
    }}>{children}
    </moduleDetailsContext.Provider>
}

export const useModuleDetails = ()=> useContext(moduleDetailsContext)