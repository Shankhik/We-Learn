'use client';

import moduleStyle from "./Dashboard.module.css"
import { Heading } from "@/components/htmlElements/Texts";
import { useAuthContext } from "@/context/authContext";
import ModuleClassname from "@/lib/cssUtil"
import { useEffect, useMemo, useRef, useState } from "react";
import { useColorContext } from "@/context/colorScheme";
import React from "react";
import { useWeather } from "../Hooks";
import { CardsCollection } from "../Cards";
import { useNotification } from "@/context/notification";
import Button from "@/components/buttons/NewButton";
import { useWebSocket } from "@/lib/hooks/useWebsocket";
import { WSMessage } from "@/types/websocket";
import { colorScheme } from "@/lib/color/appColors";

export default function Dashboard ({note}:{
    note: string
}){
    const css = new ModuleClassname(moduleStyle);
    const { updateAuth, displayName, username } = useAuthContext();
    const { effectiveTheme } = useColorContext();
    const weather = useWeather();
    const { pushNotification } = useNotification();

    const ws = useWebSocket(()=>{
        const domain = {
            name: process.env.NODE_ENV==='production'?
            process.env.NEXT_PUBLIC_API_DOMAIN||`localhost:${process.env.PORT||3000}`:
            `localhost:${process.env.PORT||3000}`
        }
        return `ws://${domain.name}/api/ws`
    });
    
    const socketEvents = {
        onopen : (e:Event) => {
            pushNotification("Socket Connected Successfully!",{
                color:'green'
            });
        },
        onmessage: ({data, type, target}:MessageEvent)=>{
            if (typeof data !== 'string'){
                pushNotification("Can't handle server's message",{
                    color:"red"
                }); return;
            }

            let message: WSMessage|string|number|object
            try { message = JSON.parse(data) }
            catch (error:any) { message = data }

            if(typeof message === 'object' && "type" in message){
                if(message.type === "hello") pushNotification(
                    `${message.username} sent Hello!`,{
                        color: "blue"
                    });
            }
        },
        onerror: (e:ErrorEvent|Event)=>{
            pushNotification(`Error: ${"Failed to Connect"}`,{
                color:'red'
            })
        },
        onclose: ({code, reason}:CloseEvent)=>{
            pushNotification(`Connection Closed [code:${code}]`,{
                color:'yellow'
            })
        }
    }

    // Cleans up web socket event listeners
    const cleanUp = ()=>{
        // console.log("cleaned up")
        ws.socket.current?.removeEventListener("open",socketEvents.onopen);
        ws.socket.current?.removeEventListener("message",socketEvents.onmessage);
        ws.socket.current?.removeEventListener("error",socketEvents.onerror);
        ws.socket.current?.removeEventListener("close",socketEvents.onclose)
    }

    useEffect(()=>{
        const socket = ws.socket.current;

        // Attached eventlisteners when Connecting
        if (socket && ws.readyState === "connecting"){
            socket.addEventListener("open", socketEvents.onopen);
            socket.addEventListener("message", socketEvents.onmessage);
            socket.addEventListener("error", socketEvents.onerror);
            socket.addEventListener("close", socketEvents.onclose);
            
            // Automatically removes event listeners on "close"
            socket.addEventListener("close", cleanUp);   
        }
    },[ws.readyState]);

    // Cleanup on Unmount
    useEffect(()=>{
        return ()=>{
            ws.disconnect()
        }
    },[]);

    const testUpdate = async ()=>{
        updateAuth({ force: true });
    }
    return <>
    <title>Dashboard</title>
    {/* <div style={{}}>
        <Button onClick={()=>{
            if(ws.readyState === 'open'){
                pushNotification("Already connected")
            }else{
                ws.connect()
            }
        }}>Connect</Button>
        <Button onClick={()=>{
            if (ws.readyState !== "open"){
                pushNotification("Not Connected!",{
                    color:'yellow'
                })
            } else{
                ws.send({
                    type: "hello",
                    username: username||""
                } satisfies WSMessage)
            }
        }}>Message</Button>
        <Button onClick={()=>{
            if(ws.readyState !== "open") pushNotification("No Socket Connection to Close",{
                color:"yellow"
            });
            else ws.disconnect();
        }}>Disconnect</Button>
    </div> */}

    <Greeting note={note}
        displayName={displayName}
        temperature={weather?.temperature}
        unit={weather?.unit}
        retry={weather.retry}
    />

    {/* Dashbroard Grid */}
    <div className={css.names('stats-grid')}>
        <div className={css.names(`stat-card 1 ${effectiveTheme}`)}
            style={{
                backgroundColor: colorScheme.card[effectiveTheme]
                //gridArea:'1/1/-1/2'
            }}
        >
            <StatHeading>Today&apos;s Goal</StatHeading>
            <CircleProgress theme={effectiveTheme} off
                time={{
                    current:8,
                    goal: 150
                }}
            />
            
        </div>
        <div className={css.names(`stat-card 2 ${effectiveTheme}`)}
            style={{
                backgroundColor: colorScheme.card[effectiveTheme]
                //gridArea:'1/2/2/-1',
            }}
        >
            <StatHeading small>Recent Courses</StatHeading>
            <h3 style={{alignSelf:'center', margin:'16px 0 0 0 '}}>
                Not Implemented yet!
            </h3>
            <h3 style={{margin:'4px auto', fontSize:'2.3rem'}}>
                🫠
            </h3>
        </div>
        <div className={css.names(`stat-card 3 ${effectiveTheme}`)}
            style={{
                backgroundColor: colorScheme.card[effectiveTheme]
                //gridArea:'2/2/-1/-1',
            }}
        >
            <StatHeading small>This week&apos;s time</StatHeading>
            <h3 style={{alignSelf:'center', margin:'16px 0 0 0 '}}>
                Not Implemented yet!
            </h3>
            <h3 style={{margin:'4px auto', fontSize:'2.3rem'}}>
                🫠
            </h3>
        </div>
    </div>
    <div>
        <Button onClick={testUpdate}>Force Update Credentials</Button>
    </div>
    
    {/* <CardsCollection title="Recent"
        cardList={testCards()}
        maxCount={6}
    /> */}
    </>
}

const testCards = ()=>{
    const c:{courseName:string}[] = [
        {courseName: "Alpha test 1"},{courseName: "Alpha test 2"},
        {courseName: "Beware test 1"},{courseName: "Beware test 2"},
        {courseName: "Why are we here?"},{courseName: "Just to Suffer"},
    ]
    // return Array.from({length:count}).map((value, i)=>(
    //     <Card courseName={`Course: ${i+1}`} key={i}/>
    // ));
    return [...c,...c]
}
const CircleProgress = React.memo(({theme, time, off}:{
    //progress?: number,
    time:{
        current: number,
        goal: number
    },
    off?: boolean,
    theme: 'light'|'dark'
})=>{
    
    const details = {
        offset : Math.max((1-(time.current/time.goal))*126,0),
        progress: (time.current/time.goal)*100,
        time: {
            hours: Math.floor(time.current/60),
            minutes: time.current%60
        }
    }
    const timeStrings = {
        hour: details.time.hours? `${details.time.hours}h `:'',
        minute: details.time.minutes? `${details.time.hours}m`:''
    }

    return <>
    <div style={{
        display:'grid',
        placeItems:'center'
    }}>
    
    <svg
        style={{gridArea:'1/1/-1/-1'}}
        //width={50} height={50}
        viewBox="0 0 50 50"
        className={moduleStyle['circle-progress']}
    >
        <circle cx={-23.215} cy={26.665} r={20.181}
        style={{
            fill: "none",
            stroke: theme==='dark'?"rgba(172, 162, 255, 0.07)":"rgba(13, 0, 112, 0.1)",
            strokeWidth: 4.5,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeDasharray: "126,126",
            strokeDashoffset: 0,
            strokeOpacity: 1,
            paintOrder: "stroke markers fill",
        }}transform="rotate(-86.043)"
        />

        <circle cx={-23.215} cy={26.665} r={20.181}
        style={{
            fill: "none",
            stroke: details.progress<=2?"rgba(46, 181, 96, 0)":
            details.progress<30?"#ebaf41ff":details.progress<70?"#4d3fc9ff":"#2eb560",
            strokeWidth: 4.5,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeDasharray: "126,126",
            strokeDashoffset: details.offset,//126,
            strokeOpacity: 1,
            paintOrder: "stroke markers fill",
        }}
        transform="rotate(-86.043)"
        />
    </svg>
    <h2 style={{
        display: off?'none':'',
        gridArea:'1/1/-1/-1', cursor:'default'}}
    >{timeStrings.hour+timeStrings.minute}</h2>
    {off && <h4 style={{ textAlign:'center',
        gridArea:'1/1/-1/-1', cursor:'default'}}
    >Not<br/>Implemented<br/>yet! 🫠</h4>}
    </div>
    </>
})
const StatHeading = ({children, small}:{
    children:React.ReactNode,
    small?: Boolean
})=>{
    return <Heading
        className={moduleStyle['stat-heading']}
        style={{
        textAlign: !small? 'center' : 'left',
        ...(small?{fontSize:'1.1rem'}:{})
    }}>{children}</Heading>
}

const Greeting = ({note, displayName, temperature, unit, retry}:{
    note: string,
    displayName: string|null|undefined,
    temperature?: number|undefined,
    retry?: ()=> any,
    unit?: '°C'|'°F'
})=>{
    note = note.replace("<--Display-Name-->",displayName??"Guest");
    const {effectiveTheme} = useColorContext()
    return<>
    <div style={{
        display:'flex', justifyContent:'space-between',
        marginBottom:"30px"
    }}>
        <Heading className={moduleStyle['greeting']}>
            {note}
        </Heading>
        <div style={{
            display:'flex', flexDirection:'column'
        }}>
        <Heading removeTheme
            className={moduleStyle['weather']}
            style={{backgroundColor: colorScheme.card[effectiveTheme]}}
        >
            {temperature && unit?
                `${temperature} ${unit}`:
                "??"
            }
        </Heading>
        <p style={{
            margin:"5px 8px 0 auto", fontWeight: 600,
            cursor:'pointer', fontSize:'0.9rem'
        }} onClick={retry}
        >{!temperature || !unit ? "Retry":"Refresh"}</p>    
        </div>
        
        
    </div>
    
    </>
}