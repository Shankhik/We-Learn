"use client";

import { useNotification } from "@/context/notification";
import { CSSProperties, useEffect, useMemo, useRef } from "react";
import moduleStyle from "./popup.module.css";
import ModuleClassname from "@/lib/cssUtil";
import { useColorContext } from "@/context/colorScheme";
import { memo as ReactMemo } from "react";

const PopupAlert = ()=> {
    const {
        notifications,
        popNotification,
    } = useNotification();

    const {effectiveTheme} = useColorContext();

    const popupStyle:{
        [key in 'red'|'green'|'violet'|'blue'|'yellow']?: CSSProperties
    } = useMemo(()=>{
        return {
            red: {
                color: effectiveTheme === 'dark'?
                "rgb(255, 221, 221)":"rgb(255, 224, 224)",
                background: "linear-gradient(45deg, "+
                (effectiveTheme === 'dark'?
                `rgba(207, 49, 49, 0.7), rgba(255, 51, 51, 0.7)`:
                `rgba(201, 0, 0, 0.7), rgba(255, 0, 0, 0.7)`)
            },
            green: {
                color: effectiveTheme === 'dark'?
                "rgb(173, 255, 200)":"rgb(245, 255, 252)",
                background: "linear-gradient(45deg, "+
                (effectiveTheme === 'dark'?
                `rgba(0, 145, 84, 0.7),rgba(18, 189, 118, 0.7))`:
                `rgba(0, 109, 49, 0.7), rgba(0, 167, 69, 0.7)`)
            },
            blue: {
                color: effectiveTheme === 'dark'?
                "rgb(240, 243, 255)":"rgb(211, 234, 255)",
                background: "linear-gradient(45deg, "+
                (effectiveTheme === 'dark'?
                `rgba(66, 80, 182, 0.7), rgba(94, 131, 255, 0.7)`:
                `rgba(13, 59, 207, 0.7), rgba(2, 82, 255, 0.7)`)
            },
            yellow: {
                color: effectiveTheme === 'dark'?
                "rgb(255, 255, 255)":"rgb(255, 247, 235)",
                background: "linear-gradient(45deg, "+
                (effectiveTheme==='dark'?
                "rgba(255, 174, 0, 0.7), rgba(255, 196, 0, 0.7)":
                "rgba(201, 114, 0, 0.7), rgba(219, 156, 21, 0.7)")
            },
            violet: {
                color: effectiveTheme==='dark'?
                "rgb(238, 235, 255)":"rgb(232, 226, 255)",
                background: "linear-gradient(45deg, "+(
                effectiveTheme==='dark'?
                `rgba(76, 62, 199, 0.7), rgba(106, 95, 255, 0.7)`:
                `rgba(34, 0, 156, 0.7), rgba(64, 21, 255, 0.7)`),
            }
        }
    },[effectiveTheme])

    const timersRef = useRef<Map<string,NodeJS.Timeout>>(new Map());
    
    useEffect(()=>{
        notifications.forEach((notification,index)=>{
            if (!timersRef.current.has(notification.id)){
                const timeout = setTimeout(()=>{
                    popNotification(notification.id);
                    timersRef.current.delete(notification.id)
                }, notification.duration);
                //console.log("triggered:", index, `_id:${timeout}`)
                timersRef.current.set(notification.id,timeout)
            }
        })

        return ()=>{
            // clearNotifications();
            // timersRef.current.forEach(timeout => clearTimeout(timeout))
            // timersRef.current.clear();
        }
    },[notifications])

    const data = useMemo(()=>{
        if (notifications.length>0) return notifications.map(
            (popup, index)=>{
                const negetiveIndex = {
                    data: -1*(notifications.length-index)
                }
                if(negetiveIndex.data<-3) return null
                return <PopupCard
                    closeFn={()=> popNotification(popup.id)}
                    key={index} text={popup.text}
                    cardStyle={popupStyle[popup.color!]}
                    position={negetiveIndex.data <= -3? 'last':
                        negetiveIndex.data===-2?'mid':'top'
                    }
                />
            }
        )
    },[notifications.length]);

    return <>
    <div className={moduleStyle['container']}>
        {data}
    </div>
    </>
}

export default ReactMemo(PopupAlert);

const PopupCard = ({cardStyle, text, position, closeFn, pushed}:{
    cardStyle?: CSSProperties,
    position: 'last'|'mid'|'top'
    text: string,
    pushed?: boolean
    closeFn: ()=> void
})=>{
    const css = new ModuleClassname(moduleStyle)
    return <>
    <div className={css.names(`pop-up ${position} ${pushed?"pushed":''}`)} style={{
        color: "rgb(255, 255, 255)",
        background: "linear-gradient(45deg, "+
            `rgba(57, 37, 231, 0.7), rgba(73, 62, 226, 0.7)`,
        ...cardStyle
    }}>
        
        <button style={{marginLeft:'auto', translate:'40% 0'}}
            onClick={closeFn}
        >
        <svg width="12.113" height="12.113" viewBox="0 0 12.113 12.113" style={{margin:'auto'}} xmlns="http://www.w3.org/2000/svg">
            <g style={{stroke:'rgb(255, 255, 255)', fill:'none'}}>
                <line x1="0" y1="11.083" x2="11.083" y2="0" strokeWidth="1" strokeLinecap="round"/>
                <line x1="0" y1="0" x2="11.083" y2="11.083" strokeWidth="1" strokeLinecap="round"/>
            </g>
        </svg>
        </button>
        {text}
    </div>
    </>
}