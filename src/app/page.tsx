"use client"

import Button from "@/components/buttons/NewButton";
import moduleStyle from "./page.module.css";
import HomeLayout from "@/components/layouts/HomeLayout"
import { useColorContext } from "@/context/colorScheme";
import { useScreenDimension } from "@/context/screenWidth";
import ModuleClassname from "@/lib/cssUtil";
import { useMemo, useEffect } from "react";
import useClassname from "@/lib/hooks/useClassname";
import { HeroSectionGetStartedButton } from "./landing-utils/Components";

type CSS = React.CSSProperties;
type HomeLayoutProps = React.ComponentProps<typeof HomeLayout>;
type ElementProps = NonNullable<HomeLayoutProps['elementProps']>;
type ElementStyle = NonNullable<HomeLayoutProps['elementStyles']>;


export default function LandingPage (){
    const css = useClassname(moduleStyle);
    const { effectiveTheme } = useColorContext();
    const { width: screenWidth } = useScreenDimension();

    /* - - - - - - - - - - - - - - Styling - - - - - - - - - - - - - - */

    return <>
    <LandingPageLayout>
        <div className={css.names(`hero-section`)}>
        <Container style={{
            // backgroundColor:"rgba(0, 0, 0, 0.1)"
        }}>
            <div style={{transition:"all 0.3s ease", display:""}}
                className={css.names(`hero-section-content`)}
            >
                <h1 className={moduleStyle['heading']}>
                    Learn. Teach.<br/>
                    <span className={moduleStyle[effectiveTheme]}>Achieve.</span>
                </h1>
                <p className={moduleStyle['text']}>
                    A modern Learning Management System designed to help you create, 
                    manage and deliver engaging learning experience.
                </p>
                <div className={css.names(`hero-section-image column ${effectiveTheme}`)}/>
                <div className={css.names(`get-started`)}>
                    <HeroSectionFeatures text="Easy to use"/>
                    <HeroSectionFeatures text={<>New Patches</>}/>
                    <HeroSectionFeatures text="Secure"/>
                    <HeroSectionGetStartedButton/>
                </div>
            </div>
            <div className={css.names(`hero-section-image ${effectiveTheme}`)}>

            </div>
        </Container>
            
        </div>
        <div style={{minHeight:"50vh", background:"rgba(212, 45, 45, 0)"}}/>
        <div style={{minHeight:"50vh", background:"rgba(212, 45, 45, 0.2)"}}/>
    </LandingPageLayout>
    </>
}

const LandingPageLayout = ({children}:{
    children?: React.ReactNode
})=>{
    const css = useClassname(moduleStyle);
    const { effectiveTheme } = useColorContext();
    const mainClassname = useMemo(()=>(
        css.names(`main ${effectiveTheme}`)
    ),[effectiveTheme, css]);

    const navbarProps: NonNullable<ElementProps['navbar']> = useMemo(()=>({
        // fadeColor: "transparent",
        logoStyle: {
            pointerEvents: "none"
        }
    }),[]);
    return <>
    <HomeLayout removeContainer
        activePath={null} bypassAuth
        customClassnames={{
            main: mainClassname
        }}
        elementProps={{
            navbar: navbarProps
        }}
    >
        {children}
    </HomeLayout>
    </>
};

type ContainerProps = {
    children?: React.ReactNode,
    addClassnameBefore?: boolean,
    classname?: string
    direction?: "coloumn"|"row"
    style?: React.CSSProperties
}
const Container = ({
    direction, children, classname, addClassnameBefore, style
}:ContainerProps)=>{
    const css = useClassname(moduleStyle);
    
    return <>
    <div className={css.names(addClassnameBefore
        ? `${classname??""} container ${direction??""}`
        : `container ${direction??""} ${classname??""}`)}

        style={style}
    >
        {children}
    </div>
    </>
}

const HeroSectionFeatures = ({text}:{
    text: string|React.ReactNode
})=>{
    const css = useClassname(moduleStyle);
    const {effectiveTheme} = useColorContext();
    return <>
    <div className={css.names(`feature ${effectiveTheme}`)}>
        <div></div>
        <span>{text}</span>
    </div>
    </>
}