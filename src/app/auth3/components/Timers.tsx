"use client";

import { useEffect, useMemo, useState } from "react";

type SessionTimerProps = {
    countdown: number,
    timeFormat?: {
        minutes: string,
        seconds: string
    }
    style?: React.CSSProperties
}

/**
 * This Component just shows
 */
export const SessionTimer = ({
    countdown, style, timeFormat
}:SessionTimerProps)=>{
    const timer = useMemo(()=> countdown,[countdown])

    const minutes = useMemo(()=>{
        return String(Math.floor(timer/60)).padStart(2,"0")
    },[timer]);

    const seconds = useMemo(()=>{
        return String(Math.floor(timer%60)).padStart(2,"0")
    },[timer]);

    return <>
    <p style={style}><strong>{minutes}</strong>:<strong>{seconds}</strong></p>
    </>
}