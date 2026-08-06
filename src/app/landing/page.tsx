"use client"

import moduleStyle from "./page.module.css"
import { useColorContext } from "@/context/colorScheme"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CSSProperties, Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useAuthContext } from "@/context/authContext";
import HideIf from "@/components/HideIf";
import ModuleClassname from "@/lib/cssUtil";
import { InfoIcon, SettingsIcon, ThemeIcon } from "@/components/icons/Icons";
import ProfilePopup, { Profile } from "@/components/popup/Profile";

/* Landing Page images */
import WeLearnLogo from "@/images/logo/WeLearnLogo.svg"
import WeLearnIcon from "@/images/logo/WeLearnLogo-icon.svg"
import HeroSection from "@/images/hero_section_bg.webp";
import HeroSectionDoodle from "@/images/HeroSectionDoodle.svg"
import Highlight1 from "@/images/HighlightProgress.svg"

export default function LandingPage (){
    const {effectiveTheme} = useColorContext();
    const { displayName, verified,
        username,profilePicture, email
    } = useAuthContext();
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
    const footerRef = useRef<HTMLDivElement>(null);
    const [showProfilePopup, setShowProfilePopup] = useState<boolean>(false)
    useEffect(()=>{
        const updateIsScrolled = ()=> {
            if(!footerRef.current) return;

            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const distanceFromBottom = docHeight - (scrollTop + windowHeight);
            
            setIsAtBottom(distanceFromBottom<300)
            setIsScrolled(window.scrollY>500)
        };
        updateIsScrolled(); // first render
        window.addEventListener('scroll',updateIsScrolled);
        return ()=> window.removeEventListener('scroll',updateIsScrolled)
    },[])

    return <>
    <link rel="preload" as="image" href={HeroSection.src}/>
    <div className={
        moduleStyle['landing-page']+
        ` ${moduleStyle[effectiveTheme==='dark'?"dark":""]}`
    }>
        <FloatingButtons verified={verified} show={isScrolled && !isAtBottom}/>
        <Navbar effectiveTheme={effectiveTheme} isScrolled={isScrolled}
            toggleProfilePopup={setShowProfilePopup}
        />
        <div className={`${moduleStyle['hero-section']} ${effectiveTheme==='dark'? moduleStyle['dark']:""}`}
            style={{
                transition:"background-image 1s ease",
                backgroundImage: `url(${HeroSection.src})`,
            }}
        >
            <div className={moduleStyle['fade']}></div>
            <div className={moduleStyle['text']}>
                <h1>
                    Start <br/>Learning.<br/>Start <br/>Growing.
                </h1>
                <p>Join thousands of professionals upgrading their skills for a smarter future.</p>
            </div>
            <Image src={HeroSectionDoodle} alt={"Doodle"} className={moduleStyle['doodle']}/>
        </div>
        <Main/>
        <Footer effectiveTheme={effectiveTheme} ref={footerRef}/>
    </div>
    <ProfilePopup hideTheme
        username={username} displayName={displayName}
        profilePictureVersion={profilePicture} email={email}
        show={showProfilePopup} toggleShow={setShowProfilePopup}
    />
    </>
}
const Navbar = ({
    effectiveTheme,
    isScrolled, toggleProfilePopup
}:{
    effectiveTheme: "light"|"dark",
    isScrolled: boolean,
    toggleProfilePopup: Dispatch<SetStateAction<boolean>>
})=>{
    const { profilePicture, verified,
        username, displayName
    } = useAuthContext();
    return <>
    <nav className={moduleStyle['navbar']}>
        <NavbarLogo effectiveTheme={effectiveTheme} isScrolled={isScrolled}/>
        
        <HideIf hideIf={verified}>
        
        <NavbarButton
            style={{marginLeft:'auto'}}
            href="/auth/login" isScrolled={isScrolled} 
        >Login</NavbarButton>
        <NavbarButton
            isScrolled={isScrolled}
            href="/auth/signup"
        >Signup</NavbarButton>
        </HideIf>
        <HideIf hideIf={!verified}>
        <NavbarButton style={{marginLeft:"auto"}}
            href={"/home2"} isScrolled={isScrolled}
        >Dashboard</NavbarButton>
        <Profile profileVersion={profilePicture}
            toggle={toggleProfilePopup}
            username={username} displayName={displayName}
        />  
        </HideIf>
    </nav>
    </>
}
const NavbarLogo = ({isScrolled, effectiveTheme}:{
    isScrolled:boolean, effectiveTheme: "light"|"dark"
})=>{
    return <Image
        className={`${moduleStyle['navbar-logo']} ${moduleStyle[effectiveTheme]}`}
        src={WeLearnLogo} alt="We-Learn"
        style={{opacity: isScrolled? 1: 0}}
    />
}
const Main = ()=>{
    return <>
    <main className={moduleStyle["content"]}>
        <Highlight highlightNumber={1}/>
        <Highlight highlightNumber={1}/>
    </main>
    </>
}
const Highlight = ({highlightNumber, effectiveTheme}:{
    highlightNumber: number,
    effectiveTheme?: 'light'|'dark'
}) => {
    const cssUtils = new ModuleClassname(moduleStyle);
    const hightlightOne = <>
    <div className={cssUtils.names(`highlight-one ${effectiveTheme||''}`)}>
    <div> {/* Main Body */}
        <div className={moduleStyle['text']}>
        <h1>Progress Dashboard</h1>
        <p>Get a clear overview of your completed lessons, ongoing courses, and performance trends.</p>
        </div>
        <Image src={Highlight1} alt="dsd"/>
    </div>
    </div>
    </>
    switch (highlightNumber){
        case 1:
            return hightlightOne;
        case 2:
            return;
        case 3:
            return;
        default:
            return;
    }
}

const Footer = ({effectiveTheme, ref}:{
    effectiveTheme:"light"|"dark",
    ref?: RefObject<HTMLDivElement|null>
})=>{
    const cssUtil = new ModuleClassname(moduleStyle);
    return <>
    <footer
        ref={ref}
        className={cssUtil.names(`footer ${effectiveTheme}`)}
    >
        <Image src={WeLearnIcon} alt="df"/>
        <div /* first block with links*/>
            <Button className={moduleStyle['button']} href="mailto:s.shankhik.555@gmail.com">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#e8eaed"><path d="M172.31-180Q142-180 121-201q-21-21-21-51.31v-455.38Q100-738 121-759q21-21 51.31-21h615.38Q818-780 839-759q21 21 21 51.31v455.38Q860-222 839-201q-21 21-51.31 21H172.31ZM480-457.69 160-662.31v410q0 5.39 3.46 8.85t8.85 3.46h615.38q5.39 0 8.85-3.46t3.46-8.85v-410L480-457.69Zm0-62.31 313.85-200h-627.7L480-520ZM160-662.31V-720v467.69q0 5.39 3.46 8.85t8.85 3.46H160v-422.31Z"/></svg>
                Mail me!
            </Button>
            <Button className={moduleStyle['button']}>
                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="24" height="24">
                <linearGradient id="rL2wppHyxHVbobwndsT6Ca" x1="4" x2="44" y1="23.508" y2="23.508" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#4c4c4c"/><stop offset="1" stopColor="#343434"/>
                </linearGradient>
                <path fill="rgba(255, 255, 255, 1)" d="M24,4C12.954,4,4,12.954,4,24c0,8.887,5.801,16.411,13.82,19.016h12.36	C38.199,40.411,44,32.887,44,24C44,12.954,35.046,4,24,4z"/>
                <path d={"M30.01,41.996L30,36.198 c0-0.939-0.22-1.856-0.642-2.687c5.641-1.133,8.386-4.468,8.386-10.177	c0-2.255-0.665-4.246-1.976-5.92c0.1-0.317,0.174-0.645,0.22-0.981c0.188-1.369-0.023-2.264-0.193-2.984l-0.027-0.116	c-0.186-0.796-0.409-1.364-0.418-1.388l-0.111-0.282l-0.111-0.282l-0.302-0.032l-0.303-0.032c0,0-0.199-0.021-0.501-0.021 "+"c-0.419,0-1.04,0.042-1.627,0.241l-0.196,0.066c-0.74,0.249-1.439,0.485-2.417,1.069c-0.286,0.171-0.599,0.366-0.934,0.584	C27.334,12.881,25.705,12.69,24,12.69c-1.722,0-3.365,0.192-4.889,0.571c-0.339-0.22-0.654-0.417-0.942-0.589	c-0.978-0.584-1.677-0.819-2.417-1.069l-0.196-0.066c-0.585-0.199-1.207-0.241-1.626-0.241c-0.302,0-0.501,0.021-0.501,0.021	l-0.302,0.032l-0.3,0.031l-0.112,0.281l-0.113,0.283c-0.01,0.026-0.233,0.594-0.419,1.391l-0.027,0.115	c-0.17,0.719-0.381,1.615-0.193,2.983c0.048,0.346,0.125,0.685,0.23,1.011c-1.285,1.666-1.936,3.646-1.936,5.89	c0,5.695,2.748,9.028,8.397,10.17c-0.194,0.388-0.345,0.798-0.452,1.224c-0.197,0.067-0.378,0.112-0.538,0.137	c-0.238,0.036-0.487,0.054-0.739,0.054c-0.686,0-1.225-0.134-1.435-0.259c-0.313-0.186-0.872-0.727-1.414-1.518	c-0.463-0.675-1.185-1.558-1.992-1.927c-0.698-0.319-1.437-0.502-2.029-0.502c-0.138,0-0.265,0.01-0.376,0.028	c-0.517,0.082-0.949,0.366-1.184,0.78c-0.203,0.357-0.235,0.773-0.088,1.141c0.219,0.548,0.851,0.985,1.343,1.255	c0.242,0.133,0.765,0.619,1.07,1.109c0.229,0.368,0.335,0.63,0.482,0.992c0.087,0.215,0.183,0.449,0.313,0.732	c0.47,1.022,1.937,1.924,2.103,2.023c0.806,0.483,2.161,0.638,3.157,0.683l0.123,0.003c0,0,0.001,0,0.001,0	c0.24,0,0.57-0.023,1.004-0.071v2.613c0.002,0.529-0.537,0.649-1.25,0.638l0.547,0.184C19.395,43.572,21.645,44,24,44	c2.355,0,4.605-0.428,6.703-1.176l0.703-0.262C30.695,42.538,30.016,42.422,30.01,41.996z"} opacity=".05"/>
                <path d={"M30.781,42.797c-0.406,0.047-1.281-0.109-1.281-0.795v-5.804c0-1.094-0.328-2.151-0.936-3.052	c5.915-0.957,8.679-4.093,8.679-9.812c0-2.237-0.686-4.194-2.039-5.822c0.137-0.365,0.233-0.75,0.288-1.147	c0.175-1.276-0.016-2.086-0.184-2.801l-0.027-0.116c-0.178-0.761-0.388-1.297-0.397-1.319l-0.111-0.282l-0.303-0.032	c0,0-0.178-0.019-0.449-0.019c-0.381,0-0.944,0.037-1.466,0.215l-0.196,0.066c-0.714,0.241-1.389,0.468-2.321,1.024	c-0.332,0.198-0.702,0.431-1.101,0.694C27.404,13.394,25.745,13.19,24,13.19c-1.762,0-3.435,0.205-4.979,0.61	c-0.403-0.265-0.775-0.499-1.109-0.699c-0.932-0.556-1.607-0.784-2.321-1.024l-0.196-0.066c-0.521-0.177-1.085-0.215-1.466-0.215	c-0.271,0-0.449,0.019-0.449,0.019l-0.302,0.032l-0.113,0.283c-0.009,0.022-0.219,0.558-0.397,1.319l-0.027,0.116	c-0.169,0.715-0.36,1.524-0.184,2.8c0.056,0.407,0.156,0.801,0.298,1.174c-1.327,1.62-1.999,3.567-1.999,5.795	c0,5.703,2.766,8.838,8.686,9.806c-0.395,0.59-0.671,1.255-0.813,1.964c-0.33,0.13-0.629,0.216-0.891,0.256	c-0.263,0.04-0.537,0.06-0.814,0.06c-0.69,0-1.353-0.129-1.69-0.329c-0.44-0.261-1.057-0.914-1.572-1.665	c-0.35-0.51-1.047-1.417-1.788-1.755c-0.635-0.29-1.298-0.457-1.821-0.457c-0.11,0-0.21,0.008-0.298,0.022	c-0.366,0.058-0.668,0.252-0.828,0.534c-0.128,0.224-0.149,0.483-0.059,0.708c0.179,0.448,0.842,0.85,1.119,1.002	c0.335,0.184,0.919,0.744,1.254,1.284c0.251,0.404,0.37,0.697,0.521,1.067c0.085,0.209,0.178,0.437,0.304,0.712	c0.331,0.719,1.353,1.472,1.905,1.803c0.754,0.452,2.154,0.578,2.922,0.612l0.111,0.002c0.299,0,0.8-0.045,1.495-0.135v3.177	c0,0.779-0.991,0.81-1.234,0.81c-0.031,0,0.503,0.184,0.503,0.184C19.731,43.64,21.822,44,24,44c2.178,0,4.269-0.36,6.231-1.003	C30.231,42.997,30.812,42.793,30.781,42.797z"} opacity=".07"/>
                <path fill="rgba(30, 35, 117, 0.51)" d={"M36.744,23.334c0-2.31-0.782-4.226-2.117-5.728c0.145-0.325,0.296-0.761,0.371-1.309	c0.172-1.25-0.031-2-0.203-2.734s-0.375-1.25-0.375-1.25s-0.922-0.094-1.703,0.172s-1.453,0.469-2.422,1.047	c-0.453,0.27-0.909,0.566-1.27,0.806C27.482,13.91,25.785,13.69,24,13.69c-1.801,0-3.513,0.221-5.067,0.652	c-0.362-0.241-0.821-0.539-1.277-0.811c-0.969-0.578-1.641-0.781-2.422-1.047s-1.703-0.172-1.703-0.172s-0.203,0.516-0.375,1.25	s-0.375,1.484-0.203,2.734c0.077,0.562,0.233,1.006,0.382,1.333c-1.31,1.493-2.078,3.397-2.078,5.704	c0,5.983,3.232,8.714,9.121,9.435c-0.687,0.726-1.148,1.656-1.303,2.691c-0.387,0.17-0.833,0.33-1.262,0.394	c-1.104,0.167-2.271,0-2.833-0.333s-1.229-1.083-1.729-1.813c-0.422-0.616-1.031-1.331-1.583-1.583	c-0.729-0.333-1.438-0.458-1.833-0.396c-0.396,0.063-0.583,0.354-0.5,0.563c0.083,0.208,0.479,0.521,0.896,0.75	c0.417,0.229,1.063,0.854,1.438,1.458c0.418,0.674,0.5,1.063,0.854,1.833c0.249,0.542,1.101,1.219,1.708,1.583	c0.521,0.313,1.562,0.491,2.688,0.542c0.389,0.018,1.308-0.096,2.083-0.206v3.75c0,0.639-0.585,1.125-1.191,1.013	C19.756,43.668,21.833,44,24,44c2.166,0,4.243-0.332,6.19-0.984C29.585,43.127,29,42.641,29,42.002v-5.804	c0-1.329-0.527-2.53-1.373-3.425C33.473,32.071,36.744,29.405,36.744,23.334z M11.239,32.727c-0.154-0.079-0.237-0.225-0.185-0.328	c0.052-0.103,0.22-0.122,0.374-0.043c0.154,0.079,0.237,0.225,0.185,0.328S11.393,32.806,11.239,32.727z M12.451,33.482	c-0.081,0.088-0.255,0.06-0.389-0.062s-0.177-0.293-0.096-0.381c0.081-0.088,0.255-0.06,0.389,0.062S12.532,33.394,12.451,33.482z M13.205,34.732c-0.102,0.072-0.275,0.005-0.386-0.15s-0.118-0.34-0.016-0.412s0.275-0.005,0.386,0.15	C13.299,34.475,13.307,34.66,13.205,34.732z M14.288,35.673c-0.069,0.112-0.265,0.117-0.437,0.012s-0.256-0.281-0.187-0.393	c0.069-0.112,0.265-0.117,0.437-0.012S14.357,35.561,14.288,35.673z M15.312,36.594c-0.213-0.026-0.371-0.159-0.353-0.297	c0.017-0.138,0.204-0.228,0.416-0.202c0.213,0.026,0.371,0.159,0.353,0.297C15.711,36.529,15.525,36.62,15.312,36.594z M16.963,36.833c-0.227-0.013-0.404-0.143-0.395-0.289c0.009-0.146,0.2-0.255,0.427-0.242c0.227,0.013,0.404,0.143,0.395,0.289	C17.381,36.738,17.19,36.846,16.963,36.833z M18.521,36.677c-0.242,0-0.438-0.126-0.438-0.281s0.196-0.281,0.438-0.281	c0.242,0,0.438,0.126,0.438,0.281S18.762,36.677,18.521,36.677z"}/></svg>
                Github
            </Button>
            <Button className={moduleStyle['button']}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="rgba(255, 255, 255, 1)" viewBox="0 0 50 50" width="24" height="24">    <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"/></svg>
                LinkedIn
            </Button>
        </div>

        <div /* Second block with more */>
            <Button className={moduleStyle['button']} href="/more/about">
                <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff">
                <path d={"M480.01-290q12.76 0 21.37-8.63Q510-307.25 510-320v-170q0-12.75-"+
                "8.63-21.38-8.63-8.62-21.38-8.62-12.76 0-21.37 8.62Q450-502.75 450-490v170q0"+
                " 12.75 8.63 21.37 8.63 8.63 21.38 8.63ZM480-588.46q13.73 0 23.02-9.29t9.29-23"+
                ".02q0-13.73-9.29-23.02-9.29-9.28-23.02-9.28t-23.02 9.28q-9.29 9.29-9.29 23.02t9.29 23.02q9.29 9.29 23.02 9.29Zm.07 488.46q-78.84 0-148.21-29.92t-120.68-81.21q-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84"+
                " 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.92t120.68 81.21q51.31 51.29 81.25 120.63Q860-558.9 860-480.07q0 78.84-29.92 148.21t-81.21 120.68q-51.29 51.31-120.63 "+
                "81.25Q558.9-100 480.07-100Zm-.07-60q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"}/>
                </svg>
                Learn more
            </Button>
            <Button className={moduleStyle['button']} href="https://www.render.com" targetBlank>
                <svg width="24" height="24" viewBox="0 0 24 24"
                    fill="#ffffff" aria-label="Render" className="fill-current"
                ><path
                    d="M 17.97527,0.55756633 C 14.99815,0.41744106 12.494712,2.57027 12.067553,5.4067407 c -0.01688,0.1316232 -0.04231,0.2590158 -0.0634,0.3863974 -0.663932,3.5328498 -3.7552108,6.2079719 -7.4681179,6.2079719 -1.3236264,0 -2.5668953,-0.339662 -3.64947516,-0.934174 -0.13109348,-0.07219 -0.28756002,0.02123 -0.28756002,0.169842 v 0.760113 11.452012 H 11.999931 v -8.585817 c 0,-1.57961 1.277035,-2.861976 2.850207,-2.861976 h 2.850206 c 3.22662,0 5.823108,-2.6878581 5.696193,-5.9574393 C 23.282388,3.1010486 20.905867,0.69769151 17.97527,0.55756633 Z"
                />
                </svg>
                
                Hosting service
            </Button>
        </div>
    </footer>
    </>
}
const NavbarButton = ({
    children, href, isScrolled, style, hidden
}:{
    children: React.ReactNode,
    style?: CSSProperties,
    href: string, isScrolled: boolean,
    onClick?: ()=> Promise<any>|any,
    hidden?: boolean
})=> {
    const {effectiveTheme}= useColorContext();
    const cssUtil = new ModuleClassname(moduleStyle);
    const bg = {
        light: "rgba(255, 255, 255, 0.36)",
        dark: "rgba(255, 255, 255, 0.3)"
    }
    return (
    <Button style={{
        ...style,
    }}  hidden={hidden||false}
        className={
            cssUtil.names(`navbar-btn ${!isScrolled?"dark":effectiveTheme}`)
        } href={href}>
        {children}
    </Button>)
}

const Button = ({
    children, href, onClick, targetBlank, ...props
}: React.ComponentProps<"div"> & {
    children: React.ReactNode,
    href?: string, targetBlank?:boolean,
    onClick?: ()=> Promise<any>|any
})=>{
    const {push} = useRouter();
    const link = useRef<HTMLAnchorElement>(null)
    return <>
    <div tabIndex={0} role={"button"}
        {...props}
        onClick={async ()=>{
            if (href) {
                if(targetBlank) link.current?.click();
                else push(href);
            }
            else onClick && (await onClick());
            
        }}
    >
        {children}
        <a ref={link} href={href} target={'_blank'} style={{display:'none'}}></a>
    </div>
    </>
}

const FloatingButtons = ({show, verified}:{
    show: boolean,
    verified?: boolean
})=>{
    const {push} = useRouter();
    const {setTheme, theme}= useColorContext();
    
    const changeTheme = ()=>{
        switch(theme){
            case "dark":
                setTheme('light'); break;
            case "light":
                setTheme('default'); break;
            case "default":
                setTheme('dark'); break;
        }
    }

    const cssM = new ModuleClassname(moduleStyle);
    return <>
    <div className={cssM.names(`floating-buttons ${show?"show":""}`)}>
        {verified && <div onClick={()=> push("/settings2")}>    
            <SettingsIcon/>
        </div>}
        <div onClick={()=> push("/more")}>
            <InfoIcon/>
        </div>
        <div onClick={changeTheme}>{
            <ThemeIcon mode={theme}/>//theme==='light'?themeLight: theme==='dark'? themeDark: themeDefault
        }</div>
    </div>
    </>
}
