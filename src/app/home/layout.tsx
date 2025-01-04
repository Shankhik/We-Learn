"use client";

import './global.css';
import {useAuthContext } from "@/context/authContext"
import {createContext, CSSProperties, MouseEvent, useEffect, useRef, useState } from "react"
//components
import LoadingPage from '@/components/Loading';
import { usePathname, useRouter } from 'next/navigation';
import { getCookie, setCookie } from '@/lib/cookies';
import { useColorContext, colorScheme, AccentColors } from '@/context/colorScheme';
import Image from 'next/image';
import logo from '@/images/logo/logo';
import LockedPage from '@/components/Locked';

type SidebarLinks = 'dashboard' | 'lib' | 'courses' | 'settings';

export default function DashBoardLayout ({children}: Readonly<{children: React.ReactNode}>){

    const {verified, updateAuth, user} = useAuthContext();
    const [showLoading,setShowLoading] = useState<boolean>(true);
    const [showLocked,setShowLocked] = useState<boolean>(false);
    const [showSidebar, setShowSidebar] = useState<boolean>(false)
    const router = useRouter();
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    //Setting page state after JWT verification
    useEffect(()=>{
        const loading= async()=>{
            if(verified){
                setShowLocked(false);
            }
            else {
                setShowLocked(true);
            }
            await delay(1500);
            setShowLoading(false);
        }
        loading();
    },[verified])

    // Element References
    const elements = {
        navbar: useRef<HTMLDivElement|null>(null),
        page: useRef<HTMLDivElement|null>(null),
        sidebar: useRef<HTMLDivElement|null>(null)
    }
    
    // Themes Variables (check context for the implementation)
    const {effectiveTheme,theme,setTheme,accentColor,setAccentColor} = useColorContext();

    const [activeLink, setActiveLink] = useState<SidebarLinks>();
    const pathname = usePathname()
    
    useEffect(()=>{
        let paths = pathname.split('/');
        let active = paths[2] as SidebarLinks
        setActiveLink(active);
        //pathname automatically changes on url change
    },[pathname])
    
    const elementStyles: {[key: string]: CSSProperties} = {
        navbar: {
            background: `linear-gradient(${colorScheme.navbar[accentColor].background[effectiveTheme]},#00000000)`
        },
        page: {
            backgroundColor: colorScheme.page[accentColor].backgroundColor[effectiveTheme],
            color: effectiveTheme==='dark'? 'rgba(255, 255, 255, 0.8)':''
        },
        sidebar: {
            backgroundColor: colorScheme.sidebar[accentColor].backgroundColor[effectiveTheme]
        },
        sidebarActiveLink: {
            color: 'rgba(255,255,255,0.9)',
            backgroundColor: colorScheme.sidebar[accentColor].active[effectiveTheme]
        }
    }
    const loadingPageStyle:CSSProperties = {
        background: effectiveTheme==='light'?'rgba(0, 0, 0, 0.6)':'rgba(0, 0, 0, 0.31)',
        backdropFilter: 'blur(80px)'
    }
    const lockedPageStyle:CSSProperties = {
        background: effectiveTheme==='light'?'rgba(0, 0, 0, 0.6)':'rgba(0, 0, 0, 0.31)',
        backdropFilter: 'blur(80px)'
    }
    const sidebarAccentColorsStyles = (color: AccentColors):CSSProperties=>{
        return({
            width: '30px',
            height: '30px',
            border: accentColor===color? `3px solid rgba(255,255,255,${effectiveTheme=== 'light'? '0.5':'0.7'})`:'3px solid transparent',
            borderRadius: '50%',
            scale: accentColor===color? '1.05':'0.8',
            transition:'all 0.3s ease-in-out',
            backgroundColor: colorScheme.navbar[color].background[effectiveTheme]
        })
    }
    const sidebarThemeStyle = (mode: 'dark'|'light'|'default'):CSSProperties=>{
        return({
            padding: '5px 10px 5px 10px',
            border: 'none',
            borderRadius:'10px',
            backgroundColor: theme===mode? colorScheme.sidebar[accentColor].active[effectiveTheme]:'rgba(0,0,0,0)',
            color: effectiveTheme=== 'light'? (theme===mode? 'rgba(255,255,255,0.8)':''): 'rgba(255,255,255,0.8)',
            position:'static',
            transition:'all 0.3s ease',
            fontWeight: '600',
        })
    }
    
    //Sidebar Hover Effects
    const hoverEventOn = (e:MouseEvent)=>{
        const target = e.currentTarget as HTMLDivElement
        if(target.classList.contains('active')){
            target.style.backgroundColor = colorScheme.sidebar[accentColor].activeHover[effectiveTheme]
        }else{
            target.style.backgroundColor = colorScheme.sidebar[accentColor].hover[effectiveTheme]
        }
        
    }
    const hoverEventOff = (e:MouseEvent)=>{
        const target = e.currentTarget as HTMLDivElement
        if(target.classList.contains('active')){
            target.style.backgroundColor = colorScheme.sidebar[accentColor].active[effectiveTheme]
        }else{
            target.style.backgroundColor = ''
        }
    }
    
    //Sidebar Links Handler
    const handleSidebarLinks = (link2: SidebarLinks)=>{
        const link = `/home/${link2}`
        if(link2==='settings') router.push(link)
        else router.replace(link)
        setActiveLink(link2)
        setShowSidebar(false)
    }
    useEffect(()=>{
        const sidebarOutsideClick = (e: globalThis.MouseEvent) =>{
            if(showSidebar && !elements.sidebar.current?.contains(e.target as Node)){
                setShowSidebar(false)
            }
        }
        document.addEventListener("click",sidebarOutsideClick)
        return ()=>{
            document.removeEventListener('click',sidebarOutsideClick)
        }
    },[showSidebar])
    
    return (
        <div className='homepage' style={elementStyles.page} ref={elements.page}>
            <LockedPage show={showLocked} message={'UnAuthorized'} style={lockedPageStyle} zIndex={4}/>
            <LoadingPage show={showLoading} style={loadingPageStyle} zIndex={6}/>
            <div className='fader' style={{zIndex:'5'}}></div>
            <nav className='homepage-navbar' style={elementStyles.navbar} ref={elements.navbar}>
                <svg width="50" height="40" viewBox="0 0 50 50.000002"
                    id='homepage-sidebar-icon'
                    style={{
                        transform:`rotate(${showSidebar?'90deg':'0deg'})`,
                        transition:'all 0.4s ease'
                    }}
                    onClick={()=>setShowSidebar(!showSidebar)}
                >

                    <g fill={colorScheme.sidebar[accentColor].active[effectiveTheme]}>
                    <rect
                        style={{
                            strokeWidth: '0.377953',strokeLinecap:'round',strokeLinejoin:'round',
                            paintOrder:'stroke markers fill'
                        }}
                        id="rect2"
                        width={showSidebar?'30':'42.669483'}
                        height="6.3102398"
                        x={showSidebar?'9.6':"3.6652584"}
                        y="9.8448801"
                        ry="3.1551199" />
                    <rect
                        style={{
                            strokeWidth: '0.377953',strokeLinecap:'round',strokeLinejoin:'round',
                            paintOrder:'stroke markers fill'
                        }}
                        id="rect3"
                        width={showSidebar?'30':'42.669483'}
                        height="6.3102398"
                        x={showSidebar?'9.6':"3.6652584"}
                        y="33.844879"
                        ry="3.1551199" />
                    <rect
                        style={{
                            strokeWidth: '0.377953',strokeLinecap:'round',strokeLinejoin:'round',
                            paintOrder:'stroke markers fill'
                        }}
                        id="rect4"
                        width="42.669483"
                        height="6.3102398"
                        x="3.6652584"
                        y="21.844881"
                        ry="3.1551199" />
                    </g>
                </svg>
                <Image id='learn-page-logo' src={logo.fullLogo} alt='logo'/>
            </nav>
            <aside className={`homepage-sidebar ${showSidebar?'enabled':'disabled'}`} ref={elements.sidebar} style={elementStyles.sidebar}>
                <div className= {activeLink==='dashboard'? 'homepage-sidebar-links active':'homepage-sidebar-links'}
                    style={activeLink==='dashboard'?elementStyles.sidebarActiveLink:{}}
                    onMouseEnter={hoverEventOn} onMouseLeave={hoverEventOff}
                    onClick={()=>{handleSidebarLinks('dashboard')}}
                >
                    <h3>Dashboard</h3>
                </div>
                <div className= {activeLink==='lib'? 'homepage-sidebar-links active':'homepage-sidebar-links'}
                    style={activeLink==='lib'?elementStyles.sidebarActiveLink:{}}
                    onMouseEnter={hoverEventOn} onMouseLeave={hoverEventOff}
                    onClick={()=>{handleSidebarLinks('lib')}}
                >
                    <h3>Library</h3>
                </div>
                <div className= {activeLink==='courses'? 'homepage-sidebar-links active':'homepage-sidebar-links'}
                    style={activeLink==='courses'?elementStyles.sidebarActiveLink:{}}
                    onMouseEnter={hoverEventOn} onMouseLeave={hoverEventOff}
                    onClick={()=>{handleSidebarLinks('courses')}}
                >
                    <h3>Explore</h3>
                </div>
                <div id='homepage-theme-section'>
                    <h3>Theme</h3>
                    <h4 style={{marginTop:'19px'}}>Color Mode</h4>
                    <div style={{display:'flex', gap:'10px',margin:'8px 0px 5px 3px'}}>
                        <button style={sidebarThemeStyle('light')} onClick={()=>{setTheme('light')}}>Light</button>
                        <button style={sidebarThemeStyle('default')} onClick={()=>{setTheme('default')}}>Default</button>
                        <button style={sidebarThemeStyle('dark')} onClick={()=>{setTheme('dark')}}>Dark</button>
                    </div>
                    <h4 style={{margin:'10px 0px 0px 0px'}}>Accent Color</h4>
                    <div style={{display:'flex', gap:'10px', alignItems:'center', margin:'8px 0px 0px 8px'}}>
                        <div style={sidebarAccentColorsStyles('red')} onClick={()=> setAccentColor('red')}></div>
                        <div style={sidebarAccentColorsStyles('blue')} onClick={()=> setAccentColor('blue')}></div>
                        <div style={sidebarAccentColorsStyles('green')} onClick={()=> setAccentColor('green')}></div>
                    </div>
                    
                </div>
                <div className= {activeLink==='settings'? 'homepage-sidebar-links active':'homepage-sidebar-links'}
                    style={activeLink==='settings'?elementStyles.sidebarActiveLink:{}}
                    onMouseEnter={hoverEventOn} onMouseLeave={hoverEventOff}
                    onClick={()=> handleSidebarLinks('settings')}
                >
                    <h3>Settings</h3>
                </div>
            </aside>
            <div className='homepage-content'>
                {verified?children:""}
            </div>
        </div>
    )
}
