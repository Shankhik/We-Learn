"use client";

import moduleStyle from "./SuccessCard.module.css";
import ModuleClassname from "@/lib/cssUtil";

import confetti from "canvas-confetti";
import { useEffect, useMemo, useState } from "react";

type SuccessCardProps = {
    children?: React.ReactNode,
    canvasRef?: React.RefObject<HTMLCanvasElement|null>
    show: boolean
}

export default function SuccessCard ({
    children, show, canvasRef
}:SuccessCardProps){

    const css = useMemo(()=>new ModuleClassname(moduleStyle),[moduleStyle])
    // const [confettiPoped, setConfettiPoped] = useState(show);

    useEffect(()=>{
        const popConfetti = ()=>{
            const myConfetti = confetti.create(canvasRef?.current || undefined,{
                resize: true,
                // useWorker: true
            })
            myConfetti({
                particleCount: 300,
                angle: 60,
                spread: 60,
                origin: {x: 0, y: 1}
            })
            myConfetti({
                particleCount: 300,
                angle: 140,
                spread: 60,
                origin: {x: 1.1, y: 1}
            })
        }
        if (show) popConfetti();
    },[show]);

    return children;
}