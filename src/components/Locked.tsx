'use client'

import { CSSProperties, useEffect, useState } from 'react';
import './Locked.css';

type Props = {
    show: boolean;
    message: string;
    style?: CSSProperties;
    zIndex?: number;
}
const LockedPage = ({show, style, message, zIndex}:Props):JSX.Element|null=>{
    let localStyle:CSSProperties = {...style};
    if (zIndex) localStyle.zIndex = zIndex.toString();

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const [hidden, setHidden] = useState<boolean>(true);
    const removalDelay = 300;

    //will remove the page from DOM after removalDelay (ms)
    useEffect(()=>{
        const loading = async()=>{
            if(show){
                await delay(200)
                setHidden(false);
            }else{
                await delay(removalDelay);
                setHidden(true)
            }
        }
        loading();
    },[show,hidden])
    
    const content:JSX.Element = (
        <div className={`locked-page ${show?'enabled':'disabled'}`} style={localStyle}>
            <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" id='locked-icon'>
                <g style={{transform:'translate(0px,5%)'}}>
                <path d="M37.2058 13.5C40.6699 7.49998 49.3301 7.5 52.7942 13.5L76.1769 54C79.641 60 75.3109 67.5 68.3827 67.5H21.6173C14.6891 67.5 10.359 60 13.8231 54L37.2058 13.5Z"
                    fill="#D96060"
                />
                <path d="M38.9378 14.5C41.6321 9.83332 48.3679 9.83333 51.0622 14.5L74.4449 55C77.1392 59.6667 73.7713 65.5 68.3827 65.5H21.6173C16.2287 65.5 12.8608 59.6667 15.5551 55L38.9378 14.5Z"
                    stroke="white"
                    strokeOpacity="0.4" strokeWidth="4"
                />
                <rect x="35" y="39" width="20" height="20" rx="3" fill="white" fillOpacity="0.2"/>
                <rect x="36" y="40" width="18" height="18" rx="2" stroke="white" strokeOpacity="0.8" strokeWidth="2"/>
                <path d="M40 36C40 35.3434 40.1293 34.6932 40.3806 34.0866C40.6319 33.48 41.0002 32.9288 41.4645 32.4645C41.9288 32.0002 42.48 31.6319 43.0866 31.3806C43.6932 31.1293 44.3434 31 45 31C45.6566 31 46.3068 31.1293 46.9134 31.3806C47.52 31.6319 48.0712 32.0002 48.5355 32.4645C48.9998 32.9288 49.3681 33.48 49.6194 34.0866C49.8707 34.6932 50 35.3434 50 36"
                    stroke="white" strokeOpacity="0.8" strokeWidth="2"/>
                <line x1="40" y1="36" x2="40" y2="39" stroke="white" strokeOpacity="0.8" strokeWidth="2"/>
                <line x1="50" y1="36" x2="50" y2="39" stroke="white" strokeOpacity="0.8" strokeWidth="2"/>
                </g>
            </svg>
            <h2>{message}</h2>
        </div>
    )
    return hidden!==true?content:null;
}

export default LockedPage;