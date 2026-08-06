"use client";

import "./global.css";

import HomeFloatingButtons from "@/components/floating-buttons/HomeFloatingButtons";
import HomeLayout from "@/components/layouts/HomeLayout";
import { useAuthContext } from "@/context/authContext";
import { useColorContext } from "@/context/colorScheme";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useRef, ViewTransition, ViewTransitionProps } from "react";

type Props = {
    children: React.ReactNode,
}
export default function ClientLayout ({
    children
}:Props) {
    const pathname = usePathname();
    const segments = useMemo(()=>(pathname.split("/")),[pathname]);
    
    const scrollPositions = useRef(new Map<string, number>());
    
    const { verified } = useAuthContext();
    const { effectiveTheme } = useColorContext();

    // Page Content Transition
    const contentTransition: ViewTransitionProps = useMemo(()=>({
        onUpdate: (ins)=>{
            const oldAnimation = ins.old.animate([
                { opacity: 1, translate: "0%", scale: 1 },
                { opacity: 0 },
                { opacity: 0, translate: "-5%", scale: 0.8 },
            ], {
                duration: 200,
                easing: "ease-out",
                fill: "both",
            });
          
            const newAnimation = ins.new.animate([
                { opacity: 0, translate: "5%", scale: 0.9 },
                { opacity: 1, translate: "0%", scale: 1 },
            ], {
                duration: 200,
                easing: "ease",
                fill: "both",
            });
          
            return () => {
                oldAnimation.cancel();
                newAnimation.cancel();
            };
        }
    }),[]);

    /* - - - - - - - - - - - - Scroll Behaviors - - - - - - - - - - - - */
    // Makes Back | Forward smooth
    // useEffect(()=>{
    //     history.scrollRestoration = "manual";
    //     return ()=>{
    //         history.scrollRestoration = "auto";
    //     }
    // },[]);

    useEffect(()=>{
        window.scrollTo({
            top: scrollPositions.current.get(pathname) ?? 0,
            // On Layout Mount: behavior: instant
            behavior: scrollPositions.current.size===0
                ? "instant"
                : "smooth"
        });
        return ()=>{
            scrollPositions.current.set(
                pathname, window.scrollY
            )
        }
    },[pathname]);

    return<>
    <HomeLayout activePath={segments.at(2)}
    contentTransition={contentTransition}
    floatingButtons={<HomeFloatingButtons/>}>
        {children}
    </HomeLayout>
    </>
}
