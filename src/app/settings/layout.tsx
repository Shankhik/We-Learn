'use client';

import { useAuthContext } from '@/context/authContext'
import './global.css'
import LockedPage from '@/components/Locked';
import LoadingPage from '@/components/Loading';
import React, { CSSProperties, Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useColorContext } from '@/context/colorScheme';
import { usePathname, useRouter } from 'next/navigation';
import { colorScheme } from '@/context/colorScheme';
import { useUserDetailsContext } from '@/context/userDetailsContext';
import { delCookie } from '@/lib/cookies';

export default function SettingsLayout ({children}: {children: React.ReactNode}) {
    const {verified, updateAuth} = useAuthContext();
    const router = useRouter()
    const {displayName, email, profilePicture, updateUserDetails} = useUserDetailsContext();
    const delay = (time: number)=> new Promise((resolve)=> setTimeout(resolve, time))

    const [showLoading,setShowLoading]= useState<boolean>(true)
    const [showLocked,setShowLocked]= useState<boolean>(false)
    const [showSidebar, setShowSidebar] = useState<boolean>(false)
    const [showLogout, setShowLogout] = useState<boolean>(false)
    const pathname = usePathname()
    
    useEffect(()=>{
        const load = async()=>{
            await delay(200);
            setShowLocked(!verified)
            await delay(500);
            setShowLoading(false);
            if(verified) updateUserDetails();
        }
        load();
    },[verified])

    /*Page */
    const {effectiveTheme,theme,setTheme,accentColor,setAccentColor} = useColorContext();
    const c = ['rgba(97, 141, 80, 0.8)','rgba(57, 106, 128, 0.8)']
    const c2 = ['rgba(175, 94, 94, 1)','rgba(62, 57, 131, 1)']

    const bgColor = {
        light: 'rgb(241, 245, 255)',
        dark: 'rgb(41, 43, 46)',
        light80: 'rgba(241, 245, 255, 0.8)',
        dark80: 'rgba(41, 43, 46, 0.8)',
    }

    /* Navbar */
    let logoBackgroundColors = ['rgb(128, 161, 211)','rgb(163, 130, 223)']

    /* Sidebar */
    type SidebarLinks = 'profile'|'courses'|'account'

    const [activeLink, setActiveLink] = useState<SidebarLinks>('profile')

    //Auto Change of active link
    useEffect(()=>{
        const activeLink = pathname.split('/')[2] as SidebarLinks
        setActiveLink(activeLink)
        //console.log(activeLink)
    },[pathname])
    
    //link style
    const sidebarBtnStyle = (link: SidebarLinks):CSSProperties=>{
        return {
            color: effectiveTheme==="dark"? 'rgb(255, 255, 255)': (activeLink === link?'rgb(255, 255, 255)': 'rgb(0,0,0)'),
            background: activeLink===link? colorScheme.sidebar[accentColor].active[effectiveTheme]: 'rgba(0,0,0,0)'
        }
    }
    // links hover
    const hover ={
        on:(e:React.MouseEvent)=>{
            const link = e.target as HTMLAnchorElement
            if (link.classList.contains('active')){
                link.style.background = colorScheme.sidebar[accentColor].activeHover[effectiveTheme]
            }else{
                link.style.background = colorScheme.sidebar[accentColor].hover[effectiveTheme]
            }
        },
        off: (e:React.MouseEvent)=>{
            const link = e.target as HTMLAnchorElement
            if (link.classList.contains('active')){
                link.style.background = colorScheme.sidebar[accentColor].active[effectiveTheme]
            }else{
                link.style.background = 'rgba(0,0,0,0)'
            }
        }
    }
    //Theme SVG color
    const colorModeSvgFill = (type: 'light'|'dark'|'default')=>{
        return theme===type?colorScheme.sidebar[accentColor].active[effectiveTheme]:(effectiveTheme==='dark'?'#ffffff':'')
    }
    // Outside Click event listener
    useEffect(()=>{
        const outsideClick ={
            sidebar: (e:MouseEvent)=>{
                if(showSidebar && !elements.sidebar.current?.contains(e.target as Node)){
                    setShowSidebar(false)
                }
            },
            logoutBtn: (e:MouseEvent)=>{
                if(showLogout && !elements.logoutBtn.current?.contains(e.target as Node)){
                    setShowLogout(false)
                }
            },
        }
        
        document.addEventListener('click',outsideClick.sidebar)
        document.addEventListener('click',outsideClick.logoutBtn)
        return ()=>{
            document.removeEventListener('click',outsideClick.sidebar)
            document.removeEventListener('click',outsideClick.logoutBtn)
        }
    },[showSidebar,showLogout])

    const elements = {
        sidebar: useRef<HTMLDivElement|null>(null),
        logoutBtn: useRef<HTMLDivElement|null>(null)
    }
    const mainLayout = (
        <>
        <nav className='settings-navbar' 
            style={{
                backgroundColor: effectiveTheme==='light'?bgColor.light80:bgColor.dark80,
                color: effectiveTheme==='light'?'rgb(37, 37, 37)':'rgb(233, 233, 233)',
            }}
        >
            <SidebarIcon show={showSidebar} toggle={setShowSidebar}/>
            <img src='https://res.cloudinary.com/dwjtsqbqn/image/upload/v1739002192/WeLearn/full-logo.png' 
                alt='logo'
                style={{
                    background: effectiveTheme==='light'? `linear-gradient(45deg, ${logoBackgroundColors[0]}, ${logoBackgroundColors[1]})`:'rgba(255, 255, 255, 0.25)'
                }}
            />
            
            <div onClick={()=>{setShowLogout(!showLogout)}}>{displayName}</div>
            <div ref={elements.logoutBtn}
                style={{display: showLogout?'block':'none'}}
                onClick={()=>{
                    delCookie('authToken')
                    updateAuth();
                    updateUserDetails();
                    router.replace('/')
                }}
            >Logout</div>
        </nav>
        <aside className={`settings-sidebar ${showSidebar?'enabled':'disabled'}`}
            ref={elements.sidebar}
            style={{
                backgroundColor: effectiveTheme==='light'? bgColor.light80:bgColor.dark80,
                backdropFilter:'blur(5px)',
            }}
        >
            <Link href={'/settings/profile'} 
                className={activeLink === 'profile'? 'active':''} 
                onMouseEnter={hover.on}
                onMouseLeave={hover.off}
                style={sidebarBtnStyle('profile')}
            >Profile</Link>
            <Link href={'/settings/courses'}
                className={activeLink === 'courses'? 'active':''}
                onMouseEnter={hover.on}
                onMouseLeave={hover.off}
                style={sidebarBtnStyle('courses')}
            >Courses</Link>
            <Link href={'/settings/account'}
                className={activeLink === 'account'? 'active':''}
                onMouseEnter={hover.on}
                onMouseLeave={hover.off}
                style={sidebarBtnStyle('account')}
            >Account</Link>

            <h4 style={{
                margin:'auto 0px 20px 0px', //this is IMP
                textAlign:'center',
                fontWeight:'500',
                color: effectiveTheme==='dark'?'rgb(231, 231, 231)':''
            }}
            >Theme</h4>
            <div>
                <div className='theme-btn' onClick={()=>{setAccentColor('red')}}
                    style={{
                        backgroundColor: colorScheme.navbar.red.background[effectiveTheme],
                        border: `4px solid ${accentColor==='red'? 'rgba(255,255, 255,0.3)':'transparent'}`
                    }}
                ></div>
                <div className='theme-btn' onClick={()=>{setAccentColor('blue')}}
                    style={{
                        backgroundColor: colorScheme.navbar.blue.background[effectiveTheme],
                        border: `4px solid ${accentColor==='blue'? 'rgba(255,255, 255,0.3)':'transparent'}`
                    }}
                ></div>
                <div className='theme-btn' onClick={()=>{setAccentColor('green')}}
                    style={{
                        backgroundColor: colorScheme.navbar.green.background[effectiveTheme],
                        border: `4px solid ${accentColor==='green'? 'rgba(255,255, 255,0.3)':'transparent'}`
                    }}
                ></div>
            </div>
            <div>
                <div className='theme-btn' onClick={()=>{setTheme('light')}} style={{background: effectiveTheme==='dark'?'rgb(80, 80, 80)':''}}>
                    <svg height="24px" viewBox="0 -960 960 960" width="24px" fill={colorModeSvgFill('light')}>
                        <path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/>
                    </svg>
                </div>
                <div className='theme-btn' onClick={()=>{setTheme('default')}} style={{background: effectiveTheme==='dark'?'rgb(80, 80, 80)':''}}>
                <svg width="24" height="24" viewBox="0 0 24 24.000001" fill={colorModeSvgFill('default')}>
                    <path d="M 10.41009,2.6337108 A 9.366666,9.366666 0 0 0 1.0438004,12 9.366666,9.366666 0 0 0 10.41009,21.36629 V 18.939932 A 6.9403613,6.9403613 0 0 1 3.470158,12 6.9403613,6.9403613 0 0 1 10.41009,5.0600684 Z" />
                    <circle cx="10.410089" cy="12" r="3.8651605" />
                    <rect width="6.9283314" height="2.5454481" x="16.027868" y="10.727276" ry="1.272724" />
                    <rect width="6.9283314" height="2.5454481" x="4.5030785" y="14.567303" ry="1.272724" transform="rotate(-45)" />
                    <rect width="6.9283314" height="2.5454478" x="21.449112" y="-2.3787344" ry="1.2727239" transform="matrix(0.70710678,0.70710678,0.70710678,-0.70710678,0,0)" />
                    </svg>
                </div>
                <div className='theme-btn' onClick={()=> {setTheme('dark')}} style={{background: effectiveTheme==='dark'?'rgb(80, 80, 80)':''}}>
                    <svg height="24px" viewBox="0 -960 960 960" width="24px" fill={colorModeSvgFill('dark')}>
                        <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/>
                    </svg>
                </div>
            </div>
        </aside>
        <main className='settings-content' style={{
            color: effectiveTheme==='light'? 'rgb(31, 31, 31)':'rgb(255, 255, 255)'
        }}
        >
            {children}
        </main>
        </>
    )

    return (
        <div className='settings-page' style={{
            background: effectiveTheme==='light'? bgColor.light:bgColor.dark
        }}>
            <LoadingPage show={showLoading} zIndex={6} style={{
                background:`linear-gradient(${c[0]}, ${c[1]})`
            }}/>
            <LockedPage show={showLocked} message={`You Aren't Logged In`}
            style={{
                zIndex: '5',
                background:`linear-gradient(${c2[0]}, ${c2[1]})`
            }}/>
            <div className='fader' style={{zIndex:4}}></div>
            {verified? mainLayout:null}
        </div>
    )
}
const SidebarIcon = ({show, toggle}:{show: boolean, toggle: Dispatch<SetStateAction<boolean>>})=>{
    const {accentColor,effectiveTheme} = useColorContext()
    const colors = {
        on: accentColor==='blue'?'rgb(146, 179, 211)':
            (accentColor==='red'? 'rgb(236, 168, 168)':'rgb(140, 204, 145)'),
        off: effectiveTheme==='light'?'rgb(181, 188, 207)': 'rgb(202, 202, 202)'
    }
    const paths = {
        top: {
            on: 'M 10,24.5 35,10',
            off: "m8.855 12.94 32.29.12"
        },
        middle: {
            on: 'm 11.941924,25.059355 2.136776,0',
            off: "m8.855 24.94 32.29.12"
        },
        bottom: {
            on: 'M 10,25.5 35,40',
            off: 'm8.855 36.94 32.29.12'
        }
    }
    return (
        <svg id='settings-sidebar-icon' width='50' height='50' viewBox='0 0 50 50'
            className={`settings-sidebar-icon ${show? 'enabled':'disabled'}`}
            style={{filter:`drop-shadow(0px 0px 1px rgba(0, 0, 0, ${show?'0.2':'0'}))`}}
            onClick={()=>{toggle(!show)}}
        >
        <g style={{
            stroke: show? colors.on: colors.off,
            transition: 'stroke 0.2s ease'
        }}>
        <path //bottom
          d= {show? paths.bottom.on: paths.bottom.off}
          style={{
            fill: "none",
            strokeWidth: 8,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeDasharray: "none",
            strokeOpacity: 1,
            paintOrder: "stroke markers fill",
            transition: 'd 0.7s ease'
          }}
        />
        <path //middle
          d= {show? paths.middle.on: paths.middle.off}
          style={{
            fill: "none",
            strokeWidth: 8,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeDasharray: 40,
            strokeDashoffset: 0,
            strokeOpacity: 1,
            paintOrder: "stroke markers fill",
            transition: 'd 0.5s ease'
          }}
        />
        <path //top
          d={show?paths.top.on:paths.top.off}
          style={{
            fill: "none",
            strokeWidth: 8,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeDasharray: "none",
            strokeOpacity: 1,
            paintOrder: "stroke markers fill",
            transition: 'd 0.7s ease'
          }}
        />
        </g>
      </svg>
    )
}
