"use client";

import moduleStyle from "./Components.module.css";

import Button from "@/components/buttons/NewButton";
import { useAuthContext } from "@/context/authContext";
import { useColorContext } from "@/context/colorScheme";
import { colorScheme } from "@/lib/color/appColors";
import useClassname from "@/lib/hooks/useClassname";

export const HeroSectionGetStartedButton = ({fixedPath}:{
    fixedPath?: string
})=>{
    // const css = useClassname(moduleStyle);
    const { effectiveTheme } = useColorContext();
    const { verified } = useAuthContext();
    
    return <>
    <Button style={{
        flex: "1 1 90%", marginTop: "10px",
        height: "50px", borderRadius:"25px",
        backgroundColor: colorScheme.accent.blue[effectiveTheme],
        color: "rgb(193, 202, 255)"
    }} href={
        fixedPath || (verified?"/home/dashboard":"/auth/login")
    }>{ verified?<>
        Go to <strong>Dashboard</strong>
    </>:<>
        Get Started Free
    </>}</Button>
    </>
}