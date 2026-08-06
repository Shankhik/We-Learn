"use client";

import { useColorContext } from "@/context/colorScheme";
import moduleStyle from "./page.module.css";
import ModuleClassname from "@/lib/cssUtil";
import Navbar from "@/components/navbar/Navbar2";
import ProfilePopup from "@/components/popup/ProfilePopup";
import React, { SetStateAction, use, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import NextImage, { StaticImageData } from "next/image";

import HeroSectionImage from "../../../../public/HeroSectionBG.webp";
import WeLearnLogo from "@/images/logo/WeLearnLogo.svg"
import { useAuthContext } from "@/context/authContext";
import { useInViewport } from "@/lib/hooks/inViewport";
import { useNotification } from "@/context/notification";
import { useScreenDimension } from "@/context/screenWidth";
import Button from "@/components/buttons/NewButton";
import { useAppActions } from "@/lib/hooks/appActions";
import { SettingsIcon } from "@/components/icons/Icons";

type Props = {
    LandingProfilePopup: Pick<
        React.ComponentProps<typeof ProfilePopup>,
        "show" | "setShow"
    >,
    LandingNavbar: {
        children?: React.ReactNode,
        isHeroVisible: boolean,
        onProfileClick?: ()=> any
    },
    Section: {
        children?: React.ReactNode,
        flexColumn?: "column",
        fadeStyle?: React.CSSProperties,
        style?: React.CSSProperties
    }
    HeroSection: {
        page: 1|2,
        ref?: React.RefObject<HTMLDivElement|null>,
        onTop?: boolean
    },
    HeroSectionPage : {
        children?: React.ReactNode,
    }
}

const localStyles = {
    light: {
        page: "rgb(188, 195, 255)",
        navbarLogo: "linear-gradient(-40deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2)",
        navbarFade: "rgba(5, 0, 80, 0.15)"
    },
    dark: {
        page: "rgb(33, 37, 49)",
        navbarLogo: "linear-gradient(-40deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2)",
        navbarFade: "rgba(5, 0, 54, 0.15)"
    }
}

/* * * * * * * * * Landing Page * * * * * * * * */
export default function LandingPage (){
    const css = new ModuleClassname(moduleStyle);
    const { effectiveTheme } = useColorContext();
    const { verified, username, updateAuth, displayName, admin, email } = useAuthContext();
    const { pushNotification } = useNotification();

    const [showProfile, setShowPofile] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    const {width: windowWidth, height: windowHeight} = useScreenDimension({width:1400});

    const {
        ref: heroSectionRef,
        isInViewport: isHeroVisible
    } = useInViewport<HTMLDivElement>(null,{
        threshold:0.08,
        defaultValue: true
    });

    useEffect(()=>{
        const updateScrollY = ()=>{
            setScrollY(window.scrollY);
        }
        updateScrollY();
        window.addEventListener("scroll", updateScrollY);
        return ()=>{
            window.removeEventListener("scroll", updateScrollY);
        }
    },[]);

    return <>
    <ProfilePopup show={showProfile} setShow={setShowPofile}/>
    {/* Main Page */}
    <div className={css.names(`landing-page ${effectiveTheme}`)}
    style={{ backgroundColor: localStyles[effectiveTheme].page }}>

        <LandingNavbar isHeroVisible={isHeroVisible}
            onProfileClick={()=> setShowPofile(true)}
        >
            {/* Add Navbar Elements/Buttons */}
            <h5>h:{windowHeight} w:{windowWidth}
            </h5>
        </LandingNavbar>

        <HeroSection ref={heroSectionRef} page={scrollY<150?1:2}/>

        {/* Dashboard, Own Course, Security */}
        <HighlightsSection1 isHeroVisible={isHeroVisible} windowWidth={windowWidth}/>
        
        {/* Learn more */}
        <HighlightsSection2/>

        <div className={css.names(`footer ${effectiveTheme}`)}>
            
        </div>
    </div>
    </>
}

/* * * * * * * Landing Page Navbar * * * * * * */
const LandingNavbar = React.memo(({
    isHeroVisible, children, onProfileClick
}:Props['LandingNavbar'])=>{
    const { effectiveTheme } = useColorContext()
    return <>
    <Navbar onProfileClick={onProfileClick}
        fadeColor= { !isHeroVisible
        ? localStyles[effectiveTheme].navbarFade
        : "transparent" }
        logoStyle={{
            opacity: !isHeroVisible? 1: 0,
            background: localStyles[effectiveTheme].navbarLogo
        }}
    >
        {children}
    </Navbar>
    </>
});

/* * * * * * * * * * Section * * * * * * * * * */
/**
 * Landing Page Sections
 */
const Section = ({
    children, flexColumn, style, fadeStyle
}: Props['Section'])=>{
    const css = new ModuleClassname(moduleStyle)
    return <>
    <div style={style}
    className={css.names(`section ${flexColumn??""}`)}
    >
        <div style={{position:"absolute",
            transition: "all 0.5s ease",
            ...fadeStyle,
            left: 0, right: 0, top: 0, bottom: 0,
            
        }}/>

        <div className={css.names(`main ${flexColumn?"column":""}`)}>
            {children}
        </div>
    </div>
    </>
}

type Props_HightLightSection1 = {
    isHeroVisible: boolean,
    windowWidth: null|number
}
const HighlightsSection1 = ({
    isHeroVisible, windowWidth
}:Props_HightLightSection1)=>{

    const { effectiveTheme } = useColorContext();

    const mThreshold = 0.6;
    const {
        ref: highlight1Ref,
        isInViewport: isHightlight1Visible
    } = useInViewport<HTMLDivElement>(null,{
        threshold: (windowWidth||1400)>=600?0.5:mThreshold,
        defaultValue: false
    });

    const {
        ref: highlight2Ref,
        isInViewport: isHightlight2Visible
    } = useInViewport<HTMLDivElement>(null,{
        threshold: (windowWidth||1400)>=600?0.5:mThreshold,
        defaultValue: false
    });

    const {
        ref: highlight3Ref,
        isInViewport: isHightlight3Visible
    } = useInViewport<HTMLDivElement>(null,{
        threshold: (windowWidth||1400)>=600?0.5:mThreshold,
        defaultValue: false
    });

    const highlightsVisibilities = {
        high1: isHightlight1Visible && !isHightlight2Visible,
        high2: isHightlight2Visible && !isHightlight3Visible,
        high3: isHightlight3Visible ||
            (!isHightlight1Visible && !isHightlight2Visible && !isHightlight3Visible )
    
    };

    const colors = {
        highlight1: {
            bgColor: {
                light: "rgb(178, 160, 255)",
                dark: "rgb(68, 82, 211)"
            },
            textColor: {
                light: "rgb(21, 0, 112)",
                dark: "rgb(217, 208, 255)"
            }
        },
        highlight2: {
            bgColor: {
                light: "rgb(137, 202, 255)",
                dark: "rgb(51, 128, 158)"
            },
            textColor: {
                light: "rgb(0, 88, 122)",
                dark: "rgb(206, 255, 248)"
            }
        },
        highlight3: {
            bgColor: {
                light: "rgb(84, 185, 126)",
                dark: "rgb(29, 128, 95)"
            },
            textColor: {
                light: "rgba(14, 48, 27, 0.7)",
                dark: "rgb(193, 255, 198)"
            }
        },
        default: {
            bgColor: {
                light: undefined,
                dark: undefined
            },
            textColor: {
                light: undefined,
                dark: undefined
            }
        }
    }

    const conditions = {
        showHighlight1: isHightlight1Visible && !isHightlight2Visible,
        showHighlight2: isHightlight2Visible && !isHightlight3Visible,
        showHighlight3: isHightlight3Visible ||
        (!isHightlight1Visible && !isHightlight2Visible && !isHightlight3Visible ),
    }

    const stylingConditions = {
        highlight1: conditions.showHighlight1,
        highlight2: conditions.showHighlight2,
        highlight3: conditions.showHighlight3 && !isHeroVisible
    }

    const currentSectionHighlight = 
        stylingConditions.highlight1? "highlight1":
        stylingConditions.highlight2? "highlight2":
        stylingConditions.highlight3? "highlight3":
        "default";
    
    return <>
    <Section flexColumn="column"
    fadeStyle={{
        backgroundColor: colors[currentSectionHighlight].bgColor[effectiveTheme],
        maskImage: `linear-gradient(transparent, white 30%, white)`
    }}
    style={{ marginTop:"min(15vh, 170px)" }}>
        <div className={moduleStyle['scroll-highlight']}>
            <Highlights title={"Dashboard"} ref={highlight1Ref}
                style={{color: colors.highlight1.textColor[effectiveTheme]}}
                show={highlightsVisibilities.high1}
            />
            <Highlights title={"Own Course Creation"} ref={highlight2Ref}
                style={{color: colors.highlight2.textColor[effectiveTheme]}}
                show={highlightsVisibilities.high2}
            />
            <Highlights title={"Secure"} ref={highlight3Ref}
                style={{color: colors.highlight3.textColor[effectiveTheme]}}
                show={highlightsVisibilities.high3}
            />
        </div>
        <HighlightImageContainer hide={
            !isHightlight3Visible &&
            !isHightlight2Visible &&
            !isHightlight1Visible
        }/>
    </Section>
    </>
}

const HighlightsSection2 = ()=>{
    const { effectiveTheme } = useColorContext();
    const bgColor = {
        light: "rgb(44, 103, 212)",
        dark: "rgb(44, 103, 212)"
    }
    const textColor = {
        light: "rgba(235, 241, 255, 0.9)",
        dark: "rgb(193, 208, 255)"
    }

    /* * * * * * * * * * * * * Element Props * * * * * * * * * * * * */ 
    // Section
    const propsSection: React.ComponentProps<typeof Section> = {
        fadeStyle: {
            boxShadow: "0 -10px 50px 10px rgba(7, 37, 92, 0.58)",
            backgroundColor: bgColor[effectiveTheme]
        },
        style: {
            minHeight: "fit-content",
            flexDirection:"column",
            color: textColor[effectiveTheme]
        }
    }
    // Section>Main
    const propsMain: React.ComponentProps<"div"> = {
        style: {
            width:"min(95%, 800px)",
            margin: "0 auto", display:"flex", flexDirection:"column",
            height:"auto", //background:"red"
        }
    }
    // Section>Main>h1
    const propsH1: React.ComponentProps<"h1"> = {
        style:{
            margin: "7% auto 0 auto"
        }
    }
    // Section>Main>p
    const propsP: React.ComponentProps<"p"> = {
        style:{
            marginTop:"20px"
        }
    }
    // Section>Main>Button
    const propsButton: React.ComponentProps<typeof Button> = {
        style: {
            fontSize:"1.1rem", margin: "7% 0",
            backgroundColor: "rgba(255, 255, 255, 0.07)",
            border:"2px solid rgba(255, 255, 255, 0.25)",
            borderRadius:"10px"
        }, href: "/about"
    }
    return <>
    <Section {...propsSection}>
        <div {...propsMain}>
            <h1 className={moduleStyle['heading']}
            {...propsH1}>
                Learn More
            </h1>
            <p className={moduleStyle['paragraph']}
            {...propsP}>
                Want to know more? Learn about our platform, how it works,
                and what makes it different.
            </p>
            <Button {...propsButton}>About</Button>
        </div>
    </Section>
    </>
}

/* * * * * * * * * * Scroll Highlights Contents * * * * * * * * * */
const Highlights = ({title, ref, show, style}:{
    title: "Dashboard" | "Own Course Creation"
    | "Availability" | "Secure",
    ref: React.RefObject<HTMLDivElement|null>,
    show?: boolean,
    style?: React.CSSProperties
})=>{
    switch (title){
        case "Dashboard":
            return <div ref={ref}
            className={show===undefined || show?moduleStyle['on']:""}
            style={style}>
            <h1>Progress Dashboard</h1>
            <p>
                Stay on top of your learning with clean, intuitive dashboard that
                allows you to see your progress and other learning patters.
                <br/><br/>
                Visual insights and structured tracking help you stay motivated and consistent as you move forward.
            </p>
            </div>;
        case "Availability":
            return <div ref={ref}
            className={show===undefined || show?moduleStyle['on']:""}
            style={style}>
            <h1>24/7 Availability</h1>
            <p>
                Learn whenever it suits you. Access your courses anytime without restriction.<br/>
                Your learning schedule is entirely in your control.
            </p>
            </div>;
        case "Secure":
            return <div ref={ref}
            className={show===undefined || show?moduleStyle['on']:""}
            style={style}>
            <h1>Security</h1>
            <p>
                Your data and content are protected with strong security practices, 
                so you can focus on learning and creating with peace of mind.
                <br/><br/>
                We prioritize privacy and reliability to ensure a safe and trusted environment for everyone.
            </p>
            </div>;
        case "Own Course Creation":
            return <div ref={ref}
            className={show===undefined || show?moduleStyle['on']:""}
            style={style}>
            <h1>Create your own Courses</h1>
            <p>
                Share your knowledge and build courses without any cost.
                Turn your ideas into structured learning experiences and help others grow.

                <br/><br/>
                Design and format your courses with the flexibility of 
                HTML and Markdown—giving you full control over how your content looks and feels.
            </p>    
            </div>;

        default: 
            return null;
    }
}

/* * * * * * * * * * Scroll Highlights Image * * * * * * * * * */
// flex: column => Right Element
// flex: row    => Bottom Element
const HighlightImageContainer = ({bgColor, hide, opacity}:{
    bgColor?: string,
    hide?: boolean,
    opacity?: number,
})=>{
    const css = new ModuleClassname(moduleStyle)
    return <>
    <div className={css.names(`scroll-highlight-image ${hide?"hide":""}`)}
    style={{opacity: opacity===undefined?undefined:opacity}}>
        <div style={{
            position:"absolute",
            top: 0, bottom: 0, left: 0, right: 0,
            backgroundColor: bgColor??"",
            //backdropFilter:"blur(6px)",
            transition: "all 0.5s ease"
        }}/>
        <div style={{margin:"auto auto", zIndex:2}}>
            <NextImage src={WeLearnLogo} alt="Logo"
            width={200}/>
        </div>
    </div>
    </>
}

const HeroSectionPage = ({children}: Props['HeroSectionPage'])=>(
    <div className={moduleStyle['hero-page']}>
        {children}
    </div>
);

const HeroSection = ({
    page, ref
}:Props['HeroSection'])=>{
    const pageCount = 2;
    const {pushNotification} = useNotification()
    return <>
    <div className={moduleStyle['hero-section-container']}>
    <div className={moduleStyle['hero-section']}
        ref={ref}
        style={{ backgroundImage: `url("${HeroSectionImage.src}")`}}
    >
        <div className={moduleStyle["pages-container"]}
        style={{translate: `-${(100/pageCount)*(page-1)}% -5vh`}}
        >
            {/* Page 1 */}
            <HeroSectionPage>
                <NextImage loading="eager"
                    className={moduleStyle['hero-logo']}
                    src={WeLearnLogo} alt="We Learn Logo"
                />
            </HeroSectionPage>

            {/* Page 2 */}
            <HeroSectionPage>
                <div className={moduleStyle['hero-content']}>
                    <h1>Start<br/>Learning.<br/>Start<br/>Growing.</h1>
                    <p>
                    Learn faster with a platform built for flexibility and real-world growth. <br/>
                    <br/>
                    Discover high-quality courses, follow your interests, and grow at your own pace - all in one seamless experience.
                    </p>
                </div>
            </HeroSectionPage>
        </div>
    </div>
    </div>
    </>
}

/*
To use :
- Scroll auto block/un-block.
- On Wheel event-listener
* * * * * * * * * * * * * * * * Code * * * * * * * * * * * * * * * *
const {ref: elementRef,isInViewport: isVisible} = useInViewport<HTMLDivElement>(ref??null,{threshold:0.2, defaultValue:true})
const [page, setPage] = useState<number>(1);
const pageCount = 2;

const {pushNotification} = useNotification()
// const handleWheel = useEffectEvent(()=>{

const nextPage = useEffectEvent(()=>{
    setPage(prev=>{
        if (prev<pageCount)
            return prev+1;
        return prev;
    })
})

const prevPage = useEffectEvent(()=>{
    setPage(prev=>{
        if (prev>1)
            return prev-1;
        return prev;
    })
})

const onScroll = useEffectEvent((e: WheelEvent)=>{
    
    if (e.deltaY>0){
        if (page<pageCount){
            e.preventDefault()
        }
        nextPage();
    }
    else{
        if (onTop || window.scrollY<=100){
            prevPage();
        }
    }
})
useEffect(() => {
    window.addEventListener("wheel",onScroll, {passive: false});
    return ()=>{
        window.removeEventListener("wheel",onScroll);
    }
},[]);

useEffect(()=>{
    pushNotification(`Visibility: ${isVisible}`)
},[isVisible]);

return <>
<div className={moduleStyle['hero-section']}
ref={elementRef}
style={{ backgroundImage: `url("${HeroSectionImage.src}")`}}>
    <div className={moduleStyle["pages-container"]}
    style={{translate: `-${(100/pageCount)*(page-1)}% -10vh`}}
    >
        {children}
    </div>
</div>
</>

*/