"use client";

import './global.css';
import {useAuthContext } from "@/context/authContext"
import {createContext, CSSProperties, MouseEvent, useEffect, useRef, useState } from "react"
//components
import LoadingPage from '@/components/Loading';
import { usePathname, useRouter } from 'next/navigation';
import { delCookie, getCookie, setCookie } from '@/lib/cookies';
import { useColorContext, colorScheme, AccentColors } from '@/context/colorScheme';
import Image from 'next/image';
import logo from '@/images/logo/logo';
import LockedPage from '@/components/Locked';
import { useUserDetailsContext } from '@/context/userDetailsContext';

type SidebarLinks = 'dashboard' | 'lib' | 'courses' | 'settings';

export default function DashBoardLayout ({children}: Readonly<{children: React.ReactNode}>){

    const {verified, updateAuth} = useAuthContext();
    const {displayName, profilePicture, username, updateUserDetails} = useUserDetailsContext()
    const [showLoading,setShowLoading] = useState<boolean>(true);
    const [showLocked,setShowLocked] = useState<boolean>(false);
    const [showSidebar, setShowSidebar] = useState<boolean>(false);
    const [showProfileActions, setShowProfileAction] = useState<boolean>(false);

    const router = useRouter();
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const profilePicLink = `https://res.cloudinary.com/${ process.env.NEXT_PUBLIC_CLD_NAME }/image/upload/c_fill,ar_1:1/v${profilePicture}/WeLearn/profile-picture/${username}`
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
        sidebar: useRef<HTMLDivElement|null>(null),
        profileAction: useRef<HTMLDivElement>(null)
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
            background: `linear-gradient(${colorScheme.navbar[accentColor].background[effectiveTheme]},#00000000)`,
            zIndex:'3'
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
        if(link2==='settings') router.push('/settings')
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
        const profileActionsOutsideClick = (e: globalThis.MouseEvent) =>{
            if(showProfileActions && !elements.profileAction.current?.contains(e.target as Node)){
                setShowProfileAction(false)
            }
        }
        document.addEventListener("click",sidebarOutsideClick)
        document.addEventListener('click',profileActionsOutsideClick)
        return ()=>{
            document.removeEventListener('click',sidebarOutsideClick)
            document.removeEventListener('click',profileActionsOutsideClick)
        }
    },[showSidebar, showProfileActions])
    
    const logoutOnClick = ()=>{
        if(!verified) return;
        delCookie('authToken');
        updateUserDetails()
        updateAuth()
        router.replace('/')
    }
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
                <img id='learn-page-logo' src='https://res.cloudinary.com/dwjtsqbqn/image/upload/v1739002192/WeLearn/full-logo.png' alt='logo'/>

                <div style={{
                    margin:'0 3% 0 auto', aspectRatio:'1/1', width:'50px',
                    borderRadius:'50%',overflow:'hidden',
                    border:`2px solid ${colorScheme.page[accentColor].backgroundColor.light}`
                }} onClick={()=>{setShowProfileAction(!showProfileActions)}}
                >
                    <UserIcon width='100%' height='100%' picAvailable={!!profilePicture}/>
                    {!profilePicture? null:
                        <Image src={profilePicLink} alt='profile-pic'
                            hidden= {!profilePicture}
                            style={{
                                width:'100%', height:'auto', position:'relative'
                            }} width={80} height={80}
                        />
                    }
                </div>

                {/* Profile Actions */}
                <div style={{
                    position:'absolute', bottom:'0', right:"0",
                    translate:'-35px 100%', minWidth:'100px',
                    padding: '15px 15px', display: showProfileActions?'flex':'none',
                    flexDirection:'column',borderRadius:'20px',
                    backgroundColor: effectiveTheme==='light'?
                        'rgb(255, 255, 255)': colorScheme.navbar[accentColor].background.dark
                    ,boxShadow:'1px 1px 10px rgba(0, 0, 0, 0.3)'
                }}>
                    <h4 style={{textAlign:'right'}}>{displayName}</h4>
                    
                    <div style={{
                        display:'flex',alignItems:'center',
                        gap:'6px', alignSelf:'flex-end', margin:'5px 3px 0 0'
                    }}>
                        <svg height="24px" viewBox="0 -960 960 960" width="24px"
                            fill= {effectiveTheme==='light'?
                                colorScheme.navbar[accentColor].background.light:
                                'rgba(255, 255, 255, 0.9)'
                            } style={{cursor:'pointer'}}
                            onClick={()=>{handleSidebarLinks('settings');}}
                        >
                            <path d="m402.73-103.08-18.08-119.28q-21.03-6.53-45.19-20.37-24.15-13.85-41.48-28.77l-110.25 50.31-78.38-138.85 100.46-73.57q-2.19-10.71-2.98-22.68-.79-11.98-.79-23.33 
                            0-9.84.79-22.46.79-12.61 2.79-24.92l-100.27-74.35 78.38-137.38 110.85 49.85q17.5-14.23 40.57-27.73 23.08-13.5 45.12-20.2l18.46-120.42h155.23l18.08 119.69q21.69 7.96 
                            44.02 20.54 22.32 12.58 40.02 28.12l113.27-49.85 77.99 137.38-102.92 74.54q2.08 11.89 3.12 23.81 1.04 11.92 1.04 22.9 0 10.6-1.14 22.36-1.13 11.75-3.21 24.25l102.23 73.45-78.38 
                            138.85-112-51q-18.05 15.74-39.57 29.02-21.51 13.28-44.47 20.4l-18.08 119.69H402.73Zm34.73-43.84h84.67l14.99-112.12q31.54-8.06 58.41-23.38 26.86-15.32 
                            51.93-39.89l104.96 45.54 39.5-70.2-92.77-68.57q3.5-17.77 6.16-33.4 2.65-15.63 2.65-31.28 0-16.59-2.09-31.72-2.1-15.14-6.72-31.75L792.69-613l-39.19-70.54L647.27-638q-21.15-23.08-50.67-41.15-29.52-18.08-59.95-22.5l-13.64-111.73h-85.86L424.42-701.8q-34.23 
                            7.07-61.17 22.4-26.94 15.32-51.71 41.02l-104.35-45.16L167-613l92.65 67.35q-4.38 16.15-6.69 32.4-2.31 16.25-2.31 33.1 0 17.03 2.06 32.71 2.06 15.67 6.06 32.21L167-347.31l39.97 70.54 104.38-44.85q24.11 24.89 
                            51.8 40.18 27.7 15.29 60.8 23.29l13.51 111.23Zm41.1-221.93q46.36 0 78.69-32.36t32.33-78.81q0-46.44-32.36-78.79-32.36-32.34-78.8-32.34-46.77 0-78.96 32.36-32.19 32.36-32.19 
                            78.81 0 46.44 32.19 78.79 32.19 32.34 79.1 32.34Zm1.63-111.65Z"/>
                        </svg>
                        <h5 style={{
                            padding:'5px 10px', borderRadius:'10px', cursor:'pointer',
                            backgroundColor: effectiveTheme==='light'?'rgb(185, 0, 0)':'rgba(255, 255, 255, 0.77)',
                            color: effectiveTheme==='light'?'rgba(255, 255, 255, 0.77)':'rgb(255, 114, 114)'
                        }} onClick={logoutOnClick}
                        >Log-out</h5>
                    </div>
                </div>
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
            </aside>
            <div className='homepage-content'>
                {verified?children:""}
            </div>
        </div>
    )
}
const UserIcon = ({width, height, picAvailable}:{
    width: string; height: string; picAvailable: boolean
}) =>{
    return (
        <svg width={width} height={height} viewBox="0 0 700 700" style={{
            display: picAvailable?'none':'block'
        }}>
            <g
                style={{
                    display: "inline",
                    fill: "#fff",
                    fillOpacity: 1,
                }}
                transform="matrix(1.37944 0 0 1.37944 -132.88 -138.959)"
            >
                <path
                    d="M144.877 485.9A246.916 246.916 0 0 0 350 596.916a246.916 246.916 0 0 0 205.639-111.754A245.967 264.01 0 0 0 350 365.99 245.967 264.01 0 0 0 144.877 485.9Z"
                    style={{
                        fill: "#fff",
                        fillOpacity: 0.998148,
                        strokeWidth: 0,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        paintOrder: "markers fill stroke",
                    }}
                />
                <circle
                    cx={350}
                    cy={238}
                    r={93.068}
                    style={{
                        fill: "#fff",
                        fillOpacity: 0.998148,
                        stroke: "none",
                        strokeWidth: 0,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeDasharray: "none",
                        strokeOpacity: 1,
                        paintOrder: "markers fill stroke",
                    }}
                />
            </g>
        </svg>
    )
}