'use client'

import './Loading.css'
import { CSSProperties, FC, useEffect, useState } from "react"
type Props={
    show: boolean;
    style?: CSSProperties;
    zIndex?: number;
}
const LoadingPage: FC<Props> = ({show, style, zIndex}):JSX.Element|null=>{
    let localStyle:CSSProperties = {...style}
    if (zIndex) localStyle.zIndex=zIndex.toString()
    
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const [hidden, setHidden] = useState<boolean>(true);
    const removalDelay = 300;

    //will remove the page from DOM after removalDelay (ms)
    useEffect(()=>{
        const loading = async()=>{
            if(show){
                setHidden(false);
            }else{
                await delay(removalDelay);
                setHidden(true)
            }
        }
        loading();
    },[show])
    
    const content:JSX.Element = (
        <div className={`loading-container ${show?'enabled':'disabled'}`} style={localStyle}>
        <div>
            <svg
                width="200"
                height="100"
                viewBox="0 0 200 100"
                version="1.1"
                id="svg1"
                xmlns="http://www.w3.org/2000/svg">
                
                <g id="circles-group" fill='rgb(255,255,255)'>
                <circle
                    style={{strokeWidth:'0.377953',strokeLinecap:'round',strokeLinejoin:'round',paintOrder:"stroke markers fill"}}
                    id="circle3"
                    cx="160"
                    cy="50"
                    r="20.993589"
                />
                <circle
                    style={{strokeWidth:'0.377953',strokeLinecap:'round',strokeLinejoin:'round',paintOrder:"stroke markers fill"}}
                    id="circle2"
                    cx="100"
                    cy="50"
                    r="20.993589"
                />
                <circle
                    style={{strokeWidth:'0.377953',strokeLinecap:'round',strokeLinejoin:'round',paintOrder:"stroke markers fill"}}
                    id="circle1"
                    cx="40"
                    cy="50"
                    r="20.993589"
                />
                </g>
            </svg>
        </div>
        </div>
    ) 
    return hidden!==true?content:null
}
export default LoadingPage;