'use client'
import { useColorContext } from "@/context/colorScheme";
import {CSSProperties, useEffect, useState} from "react";

const delay =(time:number)=> new Promise(resolve => setTimeout(resolve, time))

export default function WaitingSVG( {style}: {style: CSSProperties} ) {
    const colorsLight = ['rgba(194, 0, 0, 0.7)','rgba(17, 143, 0, 0.7)','rgba(0, 71, 151, 0.7)']
    const colorsDark = ['rgba(255, 108, 108, 0.7)','rgba(162, 255, 149, 0.7)','rgba(112, 179, 255, 0.7)']
    const {accentColor, effectiveTheme} = useColorContext()
    const transitionTime = 2000;
    const circle = {
        "1": {rMax: 87.783, rMin: 60},
        "2": {rMax: 60, rMin: 23.203},
        "3": {rMax: 23.203, rMin: 87.783}
    }

    const [circleR, setCircleR] = useState({
        "1": circle['1'].rMax,
        "2": circle['2'].rMax,
        "3": circle['3'].rMax,
    })

    const getColor = ()=>{
        return (
            accentColor==='red'? 
                effectiveTheme==='dark'? colorsDark[0]:colorsLight[0] :
                accentColor === 'green'? 
                    effectiveTheme==='dark'? colorsDark[1]:colorsLight[1]:
                    effectiveTheme==='dark'? colorsDark[2]:colorsLight[2]  
        )
    }

    
    useEffect(()=>{
        const animate = async()=>{
            setCircleR({
                '1': circle[1].rMin,
                '2': circle[2].rMin,
                '3': circle[3].rMin
            })
            await delay(transitionTime)
            setCircleR({
                '1': circle[1].rMax,
                '2': circle[2].rMax,
                '3': circle[3].rMax
            })
            await delay(transitionTime)
        }
        const id = setInterval( animate ,1.1*transitionTime)
        
        return ()=>{
            clearInterval(id)
        }
    })
    return (
    <svg width={200} height={200} viewBox={'0 0 200 200'} style={style}>
        <circle
            cx={100}
            cy={100}
            r={92.085}
            style={{
                fill: "none",
                stroke: effectiveTheme==='dark'? 
                    'rgba(255, 255, 255, 1)':
                    colorsDark[
                        accentColor==='red'? 0:
                        accentColor==='green'? 1:2
                    ]
                ,
                strokeWidth: 8.57047,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeDasharray: "none",
                paintOrder: "markers fill stroke",
            }}
        />
        <circle
            cx={100}
            cy={100}
            r={circleR[1]}
            style={{
                fill: getColor(),
                fillOpacity: 0.463659,
                stroke: "#fff",
                strokeWidth: 0,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeDasharray: "none",
                paintOrder: "markers fill stroke",
                transition:`r ${transitionTime/2}ms ease-in-out`
            }}
        />
        <circle
            cx={100}
            cy={100}
            r={circleR[2]}
            style={{
                fill:getColor(),
                fillOpacity: 0.463659,
                stroke: "#fff",
                strokeWidth: 0,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeDasharray: "none",
                paintOrder: "markers fill stroke",
                transition:`r ${transitionTime/2}ms ease-in-out`
            }}
        />
        <circle
            cx={100}
            cy={100}
            r={circleR[3]}
            style={{
                fill:getColor(),
                fillOpacity: 0.463659,
                stroke: "#fff",
                strokeWidth: 0,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeDasharray: "none",
                paintOrder: "markers fill stroke",
                transition:`r ${transitionTime/2}ms ease-in-out`
            }}
        />
    </svg>)
}