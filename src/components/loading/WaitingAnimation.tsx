'use client';

import moduleStyle from "./WaitingAnimation.module.css"
import { useColorContext } from "@/context/colorScheme";

export default function WaitingAnimation({circleColor, width, height, className, style}:{
    width?: string, height?: string,
    className?: string,
    style?: React.CSSProperties,
    circleColor?: {
        light: string, dark: string
    }
}) {
    const {effectiveTheme} = useColorContext()
    const transitionTime = 2000;

    const circleR = {
        "1": 87.783,
        "2": 60,
        "3": 23.203,
    }

    const color = {
        light: circleColor?.light||'rgba(88, 85, 255, 1)',
        dark: circleColor?.dark||'rgba(111, 79, 255, 1)',
    }

    return <>
    <svg
    {...(width? {width: width}:undefined)}
    {...(height? {height: height}:undefined)}
    viewBox={'0 0 200 200'} className={className}
    style={style}
    >
        <circle
            cx={100}
            cy={100}
            r={92.085}
            style={{
                fill: "none",
                stroke: "rgba(0,0,0,0)",
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
            className={moduleStyle['circle-one']}
            style={{
                fill: color[effectiveTheme],
                fillOpacity: 0.5,
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
            className={moduleStyle['circle-two']}
            style={{
                fill: color[effectiveTheme],
                fillOpacity: 0.5,
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
            className={moduleStyle['circle-three']}
            style={{
                fill: color[effectiveTheme],
                fillOpacity: 0.5,
                stroke: "#fff",
                strokeWidth: 0,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeDasharray: "none",
                paintOrder: "markers fill stroke",
                transition:`r ${transitionTime/2}ms ease-in-out`
            }}
        />
    </svg>
    </>
}

/* Use Effect version

function WaitingAnimation({width, height, className}:{
    width?: string, height?: string,
    className?: string
}) {
    const {effectiveTheme} = useColorContext()
    const transitionTime = 2000;

    const [circleR, setCircleR] = useState({
        "1": 87.783,
        "2": 60,
        "3": 23.203,
    })

    const color = {
        light: 'rgba(88, 85, 255, 1)',
        dark: 'rgba(111, 79, 255, 1)',
    }

    // Animating the svg
    useEffect(()=>{
        let id;
        let isMounted = true;
        clearInterval(id);

        const circleValues = {
            "1": {rMax: 87.783, rMin: 60},
            "2": {rMax: 60, rMin: 23.203},
            "3": {rMax: 23.203, rMin: 87.783}
        }

        const animate = async()=>{
            isMounted && setCircleR({
                '1': circleValues[1].rMin,
                '2': circleValues[2].rMin,
                '3': circleValues[3].rMin
            })
            await delayWithId(transitionTime/2)

            isMounted && setCircleR({
                '1': circleValues[1].rMax,
                '2': circleValues[2].rMax,
                '3': circleValues[3].rMax
            })
            await delayWithId(transitionTime/2)
        }
        id = setInterval( animate ,transitionTime)
        
        return ()=>{
            isMounted = false;
            clearInterval(id)
        }

    },[])

    return <>
    <svg
    {...(width? {width: width}:undefined)}
    {...(height? {height: height}:undefined)}
    viewBox={'0 0 200 200'} style={{
        alignSelf:'center'
    }} className={className}>
        <circle
            cx={100}
            cy={100}
            r={92.085}
            style={{
                fill: "none",
                stroke: "rgba(0,0,0,0)",
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
                fill: color[effectiveTheme],
                fillOpacity: 0.5,
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
                fill: color[effectiveTheme],
                fillOpacity: 0.5,
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
                fill: color[effectiveTheme],
                fillOpacity: 0.5,
                stroke: "#fff",
                strokeWidth: 0,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeDasharray: "none",
                paintOrder: "markers fill stroke",
                transition:`r ${transitionTime/2}ms ease-in-out`
            }}
        />
    </svg>
    </>
}
*/