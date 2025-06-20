'use client';

import { useAuthContext } from '@/context/authContext';
import './style.css'
import logo from '@/images/logo/logo'
import Image from 'next/image'
import { background } from '@/images/background/background';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { delCookie } from '@/lib/cookies';
import Link from 'next/link';

export default function LandingPage (){

    const {verified,user,updateAuth} = useAuthContext();
    const router = useRouter();
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    const references = {
        navbar: useRef<HTMLDivElement|null>(null),
        navbarLogo: useRef<HTMLImageElement|null>(null),
        loginPopUp: useRef<HTMLDivElement|null>(null)
    }
    const [showOption,setShowOption] = useState<boolean>(false);
    const onClick = {
        more: ()=>{
            router.push('settings')
        },
        profilePicture: ()=>{
            setShowOption(!showOption);
        },
        logout: async ()=>{
            delCookie('authToken');
            setShowOption(false);
            updateAuth();

            await delay(500);
            alert(`${user?.username||'User'} Logged out!`)
        }
    }
    useEffect(()=>{
        updateAuth();
    },[])

    useEffect(()=>{
        const outSideClickHandler = {
            popUp: (event:MouseEvent)=>{
                if (showOption && !references.loginPopUp.current?.contains(event.target as Node)){
                    //console.log('Closed: PopUp')
                    setShowOption(false);
                }
            }
        }

        document.addEventListener('click',outSideClickHandler.popUp)
        return ()=>{
            document.removeEventListener('click',outSideClickHandler.popUp)
        }
    },[showOption])//if args arent given.. it just takes current State.. and wont change later

    useEffect(()=>{
        let navbar = references.navbar.current;
        let navbarLogo = references.navbarLogo.current;
        
        const changeNavbarColor = ()=>{

            var yOffset = window.scrollY;
            //console.log(yOffset)
            if ( navbar && navbarLogo){
                if(yOffset>350){
                    
                    //navbar.style.backgroundImage='linear-gradient(rgba(70, 133, 78, 1), rgba(0, 0, 0, 0))'
                    navbar.style.backdropFilter= 'blur(5px)'
                    navbar.style.boxShadow= '0px -10px 10px -10px rgba(0, 0, 0, 0.1) inset'
                    

                    navbarLogo.style.opacity='1'
                    navbarLogo.style.backgroundColor= 'rgba(0, 0, 0, 0.3)'
                }else{
                    //navbar.style.backgroundImage=''
                    navbar.style.backdropFilter= ''
                    navbar.style.boxShadow= ''

                    navbarLogo.style.opacity=''
                    navbarLogo.style.backgroundColor= ''
                }
            }
        }
        window.addEventListener('scroll',changeNavbarColor);
        return ()=> window.removeEventListener('scroll',changeNavbarColor)
    },[])
    
    const hoverEffects ={
        highlight1: {
            mouseEnter:(e:React.MouseEvent)=>{
                let svgElement = (e.target as HTMLDivElement).children[2] as SVGSVGElement
                let effectElement = svgElement.querySelector('#effect')
    
                if(effectElement){
                    (effectElement as SVGGElement).style.scale = '1.2'
                }
                
            },
            mouseLeave:(e:React.MouseEvent)=>{
                let svgElement = (e.target as HTMLDivElement).children[2] as SVGSVGElement
                let effectElement = svgElement.querySelector('#effect')
    
                if(effectElement){
                    (effectElement as SVGGElement).style.scale = ''
                }
            }
        }
    }
    return(
        <div id='landing-page'>
            <nav id='landing-page-navbar' ref={references.navbar}>
                <div>
                    <Image src={logo.fullLogo} alt='logo' width={150} ref={references.navbarLogo}/>
                </div>
                <div style={{display:'flex', flexWrap:'wrap',position:'relative'}}>
                    {/* Profile picture */}
                    <div style={{position:'relative'}} hidden={!verified}>
                        <h3 id='landing-page-profile-pic' onClick={onClick.profilePicture} >{user?.username.substring(0,1)||"Shankhik".substring(0,1)}</h3>
                        <div className={`login-options ${showOption?'enable':'disable'}`} hidden={!showOption} ref={references.loginPopUp}>
                            <h4>{user?.username}</h4>
                            <button onClick={onClick.more}>More</button>
                            <button onClick={onClick.logout}>Logout</button>
                        </div>
                    </div>
                    
                    
                    <button className='lp-nav-btn' hidden={verified} onClick={()=>router.push('/signup')}>Signup</button>
                    <button className='lp-nav-btn' hidden={verified} onClick={()=>router.push('/login')}>Login</button>
                    
                </div>
                
            </nav>
            <div id='hero-section' style={{backgroundImage: `url(${background.HeroSection.src})`,backgroundSize:'cover'}}>
                
                <Image src={logo.fullLogo} alt='We LEarn' priority={true}/>
                <div>
                    <h1>Unlock Your Potential</h1>
                    <p>We all Learn together with <b>We Learn</b></p>
                    <button hidden={!verified} onClick={()=> router.push('home/dashboard')}>{"Let's Learn"}</button>
                    
                </div>
            </div>
            <div className='landing-page-content'>
                <h2 className='content-heading'>Features</h2>
                <div className='highlights-container'>
                    <HighLight1/>
                    <HighLight2/>
                    <HighLight3/>
                    <HighLight4/>
                </div>
            </div>
            <div className='landing-page-footer'>
                <Image src={logo.logoIcon} alt='logo'/>
                <div>
                    <h3>Links</h3>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#e8eaed"><path d="M172.31-180Q142-180 121-201q-21-21-21-51.31v-455.38Q100-738 121-759q21-21 51.31-21h615.38Q818-780 839-759q21 21 21 51.31v455.38Q860-222 839-201q-21 21-51.31 21H172.31ZM480-457.69 160-662.31v410q0 5.39 3.46 8.85t8.85 3.46h615.38q5.39 0 8.85-3.46t3.46-8.85v-410L480-457.69Zm0-62.31 313.85-200h-627.7L480-520ZM160-662.31V-720v467.69q0 5.39 3.46 8.85t8.85 3.46H160v-422.31Z"/></svg>
                        <a href='mailto:s.shankhik.555@gmail.com'>s.shankhik.555@gmail.com</a>
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="24" height="24">    <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"/></svg>
                        <a href='https://www.linkedin.com/in/shankhik-sarkar/'>LinkedIn</a>
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="24" height="24"><linearGradient id="rL2wppHyxHVbobwndsT6Ca" x1="4" x2="44" y1="23.508" y2="23.508" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#4c4c4c"/><stop offset="1" stopColor="#343434"/></linearGradient><path fill="rgb(152, 209, 99)" d="M24,4C12.954,4,4,12.954,4,24c0,8.887,5.801,16.411,13.82,19.016h12.36	C38.199,40.411,44,32.887,44,24C44,12.954,35.046,4,24,4z"/><path d="M30.01,41.996L30,36.198c0-0.939-0.22-1.856-0.642-2.687c5.641-1.133,8.386-4.468,8.386-10.177	c0-2.255-0.665-4.246-1.976-5.92c0.1-0.317,0.174-0.645,0.22-0.981c0.188-1.369-0.023-2.264-0.193-2.984l-0.027-0.116	c-0.186-0.796-0.409-1.364-0.418-1.388l-0.111-0.282l-0.111-0.282l-0.302-0.032l-0.303-0.032c0,0-0.199-0.021-0.501-0.021	c-0.419,0-1.04,0.042-1.627,0.241l-0.196,0.066c-0.74,0.249-1.439,0.485-2.417,1.069c-0.286,0.171-0.599,0.366-0.934,0.584	C27.334,12.881,25.705,12.69,24,12.69c-1.722,0-3.365,0.192-4.889,0.571c-0.339-0.22-0.654-0.417-0.942-0.589	c-0.978-0.584-1.677-0.819-2.417-1.069l-0.196-0.066c-0.585-0.199-1.207-0.241-1.626-0.241c-0.302,0-0.501,0.021-0.501,0.021	l-0.302,0.032l-0.3,0.031l-0.112,0.281l-0.113,0.283c-0.01,0.026-0.233,0.594-0.419,1.391l-0.027,0.115	c-0.17,0.719-0.381,1.615-0.193,2.983c0.048,0.346,0.125,0.685,0.23,1.011c-1.285,1.666-1.936,3.646-1.936,5.89	c0,5.695,2.748,9.028,8.397,10.17c-0.194,0.388-0.345,0.798-0.452,1.224c-0.197,0.067-0.378,0.112-0.538,0.137	c-0.238,0.036-0.487,0.054-0.739,0.054c-0.686,0-1.225-0.134-1.435-0.259c-0.313-0.186-0.872-0.727-1.414-1.518	c-0.463-0.675-1.185-1.558-1.992-1.927c-0.698-0.319-1.437-0.502-2.029-0.502c-0.138,0-0.265,0.01-0.376,0.028	c-0.517,0.082-0.949,0.366-1.184,0.78c-0.203,0.357-0.235,0.773-0.088,1.141c0.219,0.548,0.851,0.985,1.343,1.255	c0.242,0.133,0.765,0.619,1.07,1.109c0.229,0.368,0.335,0.63,0.482,0.992c0.087,0.215,0.183,0.449,0.313,0.732	c0.47,1.022,1.937,1.924,2.103,2.023c0.806,0.483,2.161,0.638,3.157,0.683l0.123,0.003c0,0,0.001,0,0.001,0	c0.24,0,0.57-0.023,1.004-0.071v2.613c0.002,0.529-0.537,0.649-1.25,0.638l0.547,0.184C19.395,43.572,21.645,44,24,44	c2.355,0,4.605-0.428,6.703-1.176l0.703-0.262C30.695,42.538,30.016,42.422,30.01,41.996z" opacity=".05"/><path d="M30.781,42.797c-0.406,0.047-1.281-0.109-1.281-0.795v-5.804c0-1.094-0.328-2.151-0.936-3.052	c5.915-0.957,8.679-4.093,8.679-9.812c0-2.237-0.686-4.194-2.039-5.822c0.137-0.365,0.233-0.75,0.288-1.147	c0.175-1.276-0.016-2.086-0.184-2.801l-0.027-0.116c-0.178-0.761-0.388-1.297-0.397-1.319l-0.111-0.282l-0.303-0.032	c0,0-0.178-0.019-0.449-0.019c-0.381,0-0.944,0.037-1.466,0.215l-0.196,0.066c-0.714,0.241-1.389,0.468-2.321,1.024	c-0.332,0.198-0.702,0.431-1.101,0.694C27.404,13.394,25.745,13.19,24,13.19c-1.762,0-3.435,0.205-4.979,0.61	c-0.403-0.265-0.775-0.499-1.109-0.699c-0.932-0.556-1.607-0.784-2.321-1.024l-0.196-0.066c-0.521-0.177-1.085-0.215-1.466-0.215	c-0.271,0-0.449,0.019-0.449,0.019l-0.302,0.032l-0.113,0.283c-0.009,0.022-0.219,0.558-0.397,1.319l-0.027,0.116	c-0.169,0.715-0.36,1.524-0.184,2.8c0.056,0.407,0.156,0.801,0.298,1.174c-1.327,1.62-1.999,3.567-1.999,5.795	c0,5.703,2.766,8.838,8.686,9.806c-0.395,0.59-0.671,1.255-0.813,1.964c-0.33,0.13-0.629,0.216-0.891,0.256	c-0.263,0.04-0.537,0.06-0.814,0.06c-0.69,0-1.353-0.129-1.69-0.329c-0.44-0.261-1.057-0.914-1.572-1.665	c-0.35-0.51-1.047-1.417-1.788-1.755c-0.635-0.29-1.298-0.457-1.821-0.457c-0.11,0-0.21,0.008-0.298,0.022	c-0.366,0.058-0.668,0.252-0.828,0.534c-0.128,0.224-0.149,0.483-0.059,0.708c0.179,0.448,0.842,0.85,1.119,1.002	c0.335,0.184,0.919,0.744,1.254,1.284c0.251,0.404,0.37,0.697,0.521,1.067c0.085,0.209,0.178,0.437,0.304,0.712	c0.331,0.719,1.353,1.472,1.905,1.803c0.754,0.452,2.154,0.578,2.922,0.612l0.111,0.002c0.299,0,0.8-0.045,1.495-0.135v3.177	c0,0.779-0.991,0.81-1.234,0.81c-0.031,0,0.503,0.184,0.503,0.184C19.731,43.64,21.822,44,24,44c2.178,0,4.269-0.36,6.231-1.003	C30.231,42.997,30.812,42.793,30.781,42.797z" opacity=".07"/><path fill="rgba(12, 12, 12, 0.4)" d="M36.744,23.334c0-2.31-0.782-4.226-2.117-5.728c0.145-0.325,0.296-0.761,0.371-1.309	c0.172-1.25-0.031-2-0.203-2.734s-0.375-1.25-0.375-1.25s-0.922-0.094-1.703,0.172s-1.453,0.469-2.422,1.047	c-0.453,0.27-0.909,0.566-1.27,0.806C27.482,13.91,25.785,13.69,24,13.69c-1.801,0-3.513,0.221-5.067,0.652	c-0.362-0.241-0.821-0.539-1.277-0.811c-0.969-0.578-1.641-0.781-2.422-1.047s-1.703-0.172-1.703-0.172s-0.203,0.516-0.375,1.25	s-0.375,1.484-0.203,2.734c0.077,0.562,0.233,1.006,0.382,1.333c-1.31,1.493-2.078,3.397-2.078,5.704	c0,5.983,3.232,8.714,9.121,9.435c-0.687,0.726-1.148,1.656-1.303,2.691c-0.387,0.17-0.833,0.33-1.262,0.394	c-1.104,0.167-2.271,0-2.833-0.333s-1.229-1.083-1.729-1.813c-0.422-0.616-1.031-1.331-1.583-1.583	c-0.729-0.333-1.438-0.458-1.833-0.396c-0.396,0.063-0.583,0.354-0.5,0.563c0.083,0.208,0.479,0.521,0.896,0.75	c0.417,0.229,1.063,0.854,1.438,1.458c0.418,0.674,0.5,1.063,0.854,1.833c0.249,0.542,1.101,1.219,1.708,1.583	c0.521,0.313,1.562,0.491,2.688,0.542c0.389,0.018,1.308-0.096,2.083-0.206v3.75c0,0.639-0.585,1.125-1.191,1.013	C19.756,43.668,21.833,44,24,44c2.166,0,4.243-0.332,6.19-0.984C29.585,43.127,29,42.641,29,42.002v-5.804	c0-1.329-0.527-2.53-1.373-3.425C33.473,32.071,36.744,29.405,36.744,23.334z M11.239,32.727c-0.154-0.079-0.237-0.225-0.185-0.328	c0.052-0.103,0.22-0.122,0.374-0.043c0.154,0.079,0.237,0.225,0.185,0.328S11.393,32.806,11.239,32.727z M12.451,33.482	c-0.081,0.088-0.255,0.06-0.389-0.062s-0.177-0.293-0.096-0.381c0.081-0.088,0.255-0.06,0.389,0.062S12.532,33.394,12.451,33.482z M13.205,34.732c-0.102,0.072-0.275,0.005-0.386-0.15s-0.118-0.34-0.016-0.412s0.275-0.005,0.386,0.15	C13.299,34.475,13.307,34.66,13.205,34.732z M14.288,35.673c-0.069,0.112-0.265,0.117-0.437,0.012s-0.256-0.281-0.187-0.393	c0.069-0.112,0.265-0.117,0.437-0.012S14.357,35.561,14.288,35.673z M15.312,36.594c-0.213-0.026-0.371-0.159-0.353-0.297	c0.017-0.138,0.204-0.228,0.416-0.202c0.213,0.026,0.371,0.159,0.353,0.297C15.711,36.529,15.525,36.62,15.312,36.594z M16.963,36.833c-0.227-0.013-0.404-0.143-0.395-0.289c0.009-0.146,0.2-0.255,0.427-0.242c0.227,0.013,0.404,0.143,0.395,0.289	C17.381,36.738,17.19,36.846,16.963,36.833z M18.521,36.677c-0.242,0-0.438-0.126-0.438-0.281s0.196-0.281,0.438-0.281	c0.242,0,0.438,0.126,0.438,0.281S18.762,36.677,18.521,36.677z"/></svg>
                        <a href='https://github.com/Shankhik'>GitHub</a>
                    </div>
                </div>
                <div>
                    <h3>About</h3>
                    <div><strong>Version</strong>:<p style={{color:'rgb(176, 250, 255)'}}>0.3.4</p></div>
                    <div>
                        <p><strong>Hosted on</strong>: <a href="https://render.com" target='_blank'>Render</a></p>
                    </div>
                    <div>
                        <p><strong>Learn <Link href="/more/about">More</Link></strong></p>
                    </div>
                </div>
            </div>
        </div>
    )
}
const HighLight1 = ():JSX.Element =>{
    const color={
        faded: "rgb(109, 119, 153)",
        user: 'rgb(105, 127, 197)',
        brush:'rgb(171, 238, 94)',
        brushFaded: "rgb(255, 255, 255)"
    }
    const radii = {
        c1: 0,
        c1Hover: 9.021,
        c2: 0,
        c2Hover: 4.811,
        c3: 5,
        c3Hover: 2
    }
    const elements ={
        hightlight: useRef<HTMLDivElement|null>(null),
        svg:{
            user: useRef<SVGGElement|null>(null),
            effects: {
                c1: useRef<SVGCircleElement|null>(null),
                c2: useRef<SVGCircleElement|null>(null),
                c3: useRef<SVGCircleElement|null>(null),
            },
            brushHead: useRef<SVGGElement|null>(null)
        }
    }

    const onMouseEnter = ()=>{
        let user = elements.svg.user.current
        let c1 = elements.svg.effects.c1.current
        let c2 = elements.svg.effects.c2.current
        let c3 = elements.svg.effects.c3.current
        let brushHead = elements.svg.brushHead.current

        if( !user || !c1 || !c2|| !c3 || !brushHead) return

        c1.style.r = `${radii.c1Hover}`
        c2.style.r = `${radii.c2Hover}`
        c2.style.fill= 'rgb(178, 255, 91)'
        c3.style.r = `${radii.c3Hover}`
        c3.style.fill= 'rgb(178, 255, 91)'

        user.style.fill = color.user

        brushHead.style.fill = color.brush
    }
    const onMouseLeave = ()=>{
        let user = elements.svg.user.current
        let c1 = elements.svg.effects.c1.current
        let c2 = elements.svg.effects.c2.current
        let c3 = elements.svg.effects.c3.current
        let brushHead = elements.svg.brushHead.current
        if( !user || !c1 || !c2|| !c3 || !brushHead ) return

        c1.style.r = `${radii.c1}`
        c2.style.r = `${radii.c2}`
        c3.style.fill = 'rgb(255,255,255)'
        c3.style.r = `${radii.c3}`
        c3.style.fill = 'rgb(255,255,255)'

        user.style.fill = color.faded

        brushHead.style.fill = color.brushFaded
    }
    return(
        <div className='highlight' ref={elements.hightlight}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <h2>Personalized Learning Paths</h2>
            <p>{`Tailored courses and recommendations that adapt to each learner's needs and goals.`}</p>
            <svg xmlns="http://www.w3.org/2000/svg" width={50} height={50} viewBox='0 0 50 50'>
                <defs>
                <filter
                    id="b"
                    width={1.178}
                    height={1.143}
                    x={-0.085}
                    y={-0.068}
                    colorInterpolationFilters='sRGB'
                >
                    <feFlood floodColor="#000" floodOpacity={0.533} result="flood" />
                    <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={0.5} />
                    <feOffset dx={0.1} dy={0.1} in="blur" result="offset" />
                    <feComposite in="flood" in2="offset" operator="in" result="comp1" />
                    <feComposite in="SourceGraphic" in2="comp1" result="comp2" />
                </filter>
                <filter
                    id="a"
                    width={1.078}
                    height={1.056}
                    x={-0.038}
                    y={-0.027}
                    colorInterpolationFilters='sRGB'
                >
                    <feFlood floodColor="#000" floodOpacity={0.2} result="flood" />
                    <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={0.5} />
                    <feOffset dx={0.1} dy={0.1} in="blur" result="offset" />
                    <feComposite in="flood" in2="offset" operator="in" result="comp1" />
                    <feComposite in="SourceGraphic" in2="comp1" result="comp2" />
                </filter>
                </defs>
                <g
                ref={elements.svg.user}
                style={{
                    fill:color.faded,
                    fillOpacity: 1,
                    filter: "url(#a)",
                }}
                >
                <circle
                    cx={25}
                    cy={12.108}
                    r={8.903}
                    style={{
                    fillOpacity: 1,
                    strokeWidth: 3.40157,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    paintOrder: "stroke markers fill",
                    }}
                />
                <path
                    d="M25 24.098A16.085 16.085 0 0 0 9.5 35.959a15.966 9.675 0 0 0-.467 2.225 15.966 9.675 0 0 0 .016.127A15.966 9.675 0 0 0 25 47.857a15.966 9.675 0 0 0 15.96-9.625 16.085 16.085 0 0 0-.19-1.18 16.085 16.085 0 0 1 .19 1.18 15.966 9.675 0 0 0 .007-.048 15.966 9.675 0 0 0-.498-2.393 16.085 16.085 0 0 1 .281 1.164 16.085 16.085 0 0 0-.281-1.164A16.085 16.085 0 0 0 25 24.098Z"
                    style={{
                    fillOpacity: 1,
                    strokeWidth: 3.40157,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    paintOrder: "stroke markers fill",
                    }}
                />
                </g>
                <g transform="translate(-.226 .564)">
                <circle
                    ref={elements.svg.effects.c1}
                    cx={27.197}
                    cy={34.416}
                    r={radii.c1}
                    style={{
                    fill: "#fff",
                    fillOpacity: 0.301923,
                    strokeWidth: 0,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: "none",
                    paintOrder: "stroke markers fill",
                    transition: 'r 0.5s ease'
                    }}
                />
                <circle
                    ref={elements.svg.effects.c2}
                    cx={27.197}
                    cy={34.416}
                    r={radii.c2}
                    style={{
                    fill: "#fff",
                    fillOpacity: 0.301923,
                    strokeWidth: 0,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: "none",
                    paintOrder: "stroke markers fill",
                    transition: 'r 0.5s ease'
                    }}
                />
                <circle
                    ref={elements.svg.effects.c3}
                    cx={27.197}
                    cy={34.416}
                    r={radii.c3}
                    style={{
                    fill: "#fff",
                    fillOpacity: 0.4,
                    strokeWidth: 0,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: "none",
                    paintOrder: "stroke markers fill",
                    transition: 'r 0.5s ease'
                    }}
                />
                </g>
                <g
                style={{
                    fillOpacity: 1,
                    filter: "url(#b)",
                }}
                transform="translate(20.817 11.836)"
                >
                <rect
                    width={15.314}
                    height={3.086}
                    x={-8.854}
                    y={17.741}
                    ry={1.543}
                    style={{
                    fill: "#fff",
                    fillOpacity: 1,
                    strokeWidth: 3.40157,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    paintOrder: "stroke markers fill",
                    }}
                    transform="rotate(-54.645)"
                />
                <g
                    ref={elements.svg.brushHead}
                    style={{
                    fill: color.brushFaded,
                    fillOpacity: 0.982729,
                    }}
                >
                    <circle
                    cx={8.903}
                    cy={20.299}
                    r={1.899}
                    style={{
                        fillOpacity: 0.982729,
                        strokeWidth: 3.40157,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        paintOrder: "stroke markers fill",
                    }}
                    />
                    <path
                    d="M7.03 20.062c-.23 2.392-.986 3.064-.986 3.064s.886-.033 1.322-.105c.42-.07.851-.137 1.238-.315 1.827-.844 2.077-1.7 2.077-1.7z"
                    style={{
                        fillOpacity: 0.982729,
                        strokeWidth: 3.40157,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        paintOrder: "stroke markers fill",
                    }}
                    />
                </g>
                </g>
            </svg>
        </div>
    )
}

const HighLight2 = ():JSX.Element=>{
    const color = {
        minHand: 'rgb(189, 113, 113)',
        hourHand: 'rgb(117, 73, 73)',
        dial: 'rgb(236, 145, 145)',
        faded: 'rgb(204, 159, 159)'
    }
    const elements = {
        highlight: useRef<HTMLDivElement|null>(null),
        svg:{
            dial: useRef<SVGPathElement|null>(null),
            hands: {
                hour: useRef<SVGRectElement|null>(null),
                minute: useRef<SVGRectElement|null>(null)
            }
        }
    }
    const onMouseEnter = (e: React.MouseEvent)=>{
        let minHand = elements.svg.hands.minute.current
        let hourHand = elements.svg.hands.hour.current
        let dial = elements.svg.dial.current

        if(!minHand||!hourHand||!dial) return

        dial.style.fill = color.dial
        minHand.style.transform = `rotate(4290deg)`
        minHand.style.fill = color.minHand
        hourHand.style.transform = `rotate(${450+5}deg)`
        hourHand.style.fill = color.hourHand
        
    }
    const onMouseLeave = (e: React.MouseEvent)=>{
        let minHand = elements.svg.hands.minute.current
        let hourHand = elements.svg.hands.hour.current
        let dial = elements.svg.dial.current

        if(!minHand||!hourHand||!dial) return

        dial.style.fill = color.faded
        minHand.style.transform = 'rotate(-25deg)'
        minHand.style.fill = color.faded
        hourHand.style.transform = 'rotate(60deg)'
        hourHand.style.fill = color.faded
    }
    return(
        <div className='highlight' ref={elements.highlight} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <h2>24/7 Access</h2>
            <p>Access courses anytime, anywhere, on mobile, tablet, or desktop.</p>
            <svg xmlns="http://www.w3.org/2000/svg" width={50} height={50} viewBox='0 0 50 50'>
                <defs>
                <filter
                    id="a"
                    width={1.07}
                    height={1.07}
                    x={-0.033}
                    y={-0.033}
                    colorInterpolationFilters='sRGB'
                >
                    <feFlood floodColor="#000" floodOpacity={0.302} result="flood" />
                    <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={0.5} />
                    <feOffset dx={0.1} dy={0.1} in="blur" result="offset" />
                    <feComposite in="flood" in2="offset" operator="in" result="comp1" />
                    <feComposite in="SourceGraphic" in2="comp1" result="comp2" />
                </filter>
                <filter
                    id="b"
                    width={1.135}
                    height={1.833}
                    x={-0.065}
                    y={-0.4}
                    colorInterpolationFilters='sRGB'
                >
                    <feFlood floodColor="#000" floodOpacity={0.224} result="flood" />
                    <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={0.5} />
                    <feOffset dx={0.1} dy={0.1} in="blur" result="offset" />
                    <feComposite in="flood" in2="offset" operator="in" result="comp1" />
                    <feComposite in="SourceGraphic" in2="comp1" result="comp2" />
                </filter>
                <filter
                    id="c"
                    width={1.169}
                    height={1.674}
                    x={-0.081}
                    y={-0.323}
                    colorInterpolationFilters='sRGB'
                >
                    <feFlood floodColor="#000" floodOpacity={0.224} result="flood" />
                    <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={0.5} />
                    <feOffset dx={0.1} dy={0.1} in="blur" result="offset" />
                    <feComposite in="flood" in2="offset" operator="in" result="comp1" />
                    <feComposite in="SourceGraphic" in2="comp1" result="comp2" />
                </filter>
                </defs>
                <path
                    ref={elements.svg.dial}
                    d="M25 7.016A17.985 17.985 0 0 0 7.016 25 17.985 17.985 0 0 0 25 42.984 17.985 17.985 0 0 0 42.984 25 17.985 17.985 0 0 0 25 7.016Zm0 4.867A13.117 13.117 0 0 1 38.117 25 13.117 13.117 0 0 1 25 38.117 13.117 13.117 0 0 1 11.883 25 13.117 13.117 0 0 1 25 11.883Z"
                    style={{
                        fill: color.faded,
                        fillOpacity: 0.982729,
                        strokeWidth: 3.40157,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        paintOrder: "stroke markers fill",
                        filter: "url(#a)",
                    }}
                />
                <g
                    style={{
                        //filter: "url(#b)",
                    }}
                >
                <rect
                    ref={elements.svg.hands.minute}
                    width={12.5}
                    height={3}
                    x={23.5}
                    y={23.5}
                    ry={1.5}
                    style={{
                    fill: color.faded,
                    fillOpacity: 0.982729,
                    strokeWidth: 3.37729,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    paintOrder: "stroke markers fill",
                    transition:'all 15s ease-in-out',
                    transformOrigin: '25px 25px',
                    transform: 'rotate(-25deg)'
                    }}
                />
                <rect
                    ref={elements.svg.hands.hour}
                    width={9}
                    height={3}
                    x={17.5}
                    y={23.5}
                    ry={1.5}
                    style={{
                    fill: color.faded,
                    fillOpacity: 0.982729,
                    strokeWidth: 3.40157,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    paintOrder: "stroke markers fill",
                    transition:'all 15s ease-in-out',
                    transformOrigin: '25px 25px',
                    transform:'rotate(60deg)'
                    }}
                />
                </g>
                <path
                d="M12.745 3.153a9.004 9.004 0 0 0-9.004 9.004 9.004 9.004 0 0 0 9.004 9.004 9.004 9.004 0 0 0 9.004-9.004 9.004 9.004 0 0 0-9.004-9.004Z"
                style={{
                    fill: "#7bdac3",
                    fillOpacity: 0.982729,
                    strokeWidth: 1.84955,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    paintOrder: "stroke markers fill",
                }}
                />
                <path
                d="M9.065 13.768H6.604v-.51l.513-.44q.258-.22.48-.437.47-.454.643-.72.173-.268.173-.578 0-.284-.188-.442-.185-.161-.52-.161-.222 0-.48.078-.26.078-.506.239h-.025v-.513q.174-.085.462-.156.29-.07.561-.07.56 0 .877.27.317.269.317.73 0 .208-.054.388-.05.179-.153.34-.096.151-.225.298-.127.146-.31.324-.261.257-.54.498-.278.24-.52.445h1.956zm4.262-1.023h-.54v1.023h-.469v-1.023h-1.74v-.561l1.76-2.051h.45v2.222h.539zm-1.009-.39v-1.641l-1.408 1.64zm5.063 1.413h-.579l-.774-1.047-.778 1.047h-.535l1.064-1.36-1.054-1.367h.578l.77 1.03.77-1.03h.538l-1.072 1.343zm4.01-3.09-1.645 3.09h-.523l1.75-3.208h-2.07v-.427h2.488z"
                aria-label="24x7"
                style={{
                    fontSize: 5,
                    lineHeight: "6.92307px",
                    fontFamily: "&quot",
                    letterSpacing: 1,
                    wordSpacing: 0,
                    whiteSpace: "pre",
                    fill: "#fff",
                    fillOpacity: 0.982729,
                    strokeWidth: 3.40157,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    paintOrder: "stroke markers fill",
                    filter: "url(#c)",
                }}
                transform="matrix(.8049 0 0 .952 1.478 .816)"
                />
            </svg>
            
        </div>
        
    )
}

const HighLight3 = ():JSX.Element=>{
    const color = {
        bar1:'rgb(222, 139, 91)',
        bar2:"rgb(82, 170, 240)",
        bar3:"rgb(74, 201, 152)",
        barDefault: 'rgb(166, 199, 229)'
    }
    const elements = {
        highlight: useRef<HTMLDivElement|null>(null),
        svg:{
            bar1: useRef<SVGRectElement|null>(null),
            bar2: useRef<SVGRectElement|null>(null),
            bar3: useRef<SVGRectElement|null>(null),
            circle: useRef<SVGCircleElement|null>(null),
            tick: useRef<SVGPathElement|null>(null)
        }
    }

    const onMouseEnter = (e: React.MouseEvent)=>{
        let bar1 = elements.svg.bar1.current
        let bar2 = elements.svg.bar2.current
        let bar3 = elements.svg.bar3.current
        let circle = elements.svg.circle.current
        let tick = elements.svg.tick.current

        if(!circle || !bar1 || !bar2 || !bar3 || !tick) return

        bar1.style.width = '14'
        bar1.style.fill = color.bar1

        bar2.style.width = '17'
        bar2.style.fill = color.bar2

        bar3.style.width = '40'
        bar3.style.fill = color.bar3

        circle.style.transition = 'stroke-dashoffset 0.7s ease-in-out, fill 0.5s ease 0.3s'
        circle.style.strokeDashoffset = '74'
        circle.style.fill = "rgb(72, 199, 81)"
        
        tick.style.transition = 'stroke-dashoffset 0.7s 0.4s ease'
        tick.style.strokeDashoffset = '0'
    }
    const onMouseLeave = (e: React.MouseEvent)=>{
        let bar1 =elements.svg.bar1.current
        let bar2 = elements.svg.bar2.current
        let bar3 = elements.svg.bar3.current
        let circle = elements.svg.circle.current
        let tick = elements.svg.tick.current

        if(!circle || !bar1 || !bar2 || !bar3 || !tick) return

        bar1.style.width = '12'
        bar1.style.fill = color.barDefault

        bar2.style.width = '15'
        bar2.style.fill = color.barDefault

        bar3.style.width = '34'
        bar3.style.fill = color.barDefault

        circle.style.transition = 'stroke-dashoffset 0.7s ease-in-out 0.3s, fill 1s ease'
        circle.style.strokeDashoffset = '100'
        circle.style.fill = 'rgba(0, 0, 0, 0)'

        tick.style.transition = 'stroke-dashoffset 0.5s ease'
        tick.style.strokeDashoffset = '24'
    }
    return(
        <div className='highlight' ref={elements.highlight} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <h2>Progress Tracking Dashboard</h2>
            <p>Monitor your learning progress, track completed courses, and set personal goals.</p>
            <svg width={50} height={50} viewBox='0 0 50 50'>
                <defs>
                <filter
                    id="d"
                    width={1.403}
                    height={1.403}
                    x={-0.198}
                    y={-0.198}
                    colorInterpolationFilters='sRGB'
                >
                    <feFlood floodColor="#000" floodOpacity={0.227} result="flood" />
                    <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={0.5} />
                    <feOffset dx={0.1} dy={0.1} in="blur" result="offset" />
                    <feComposite in="flood" in2="offset" operator="in" result="comp1" />
                    <feComposite in="SourceGraphic" in2="comp1" result="comp2" />
                </filter>
                <filter
                    id="b"
                    width={1.074}
                    height={1.297}
                    x={-0.035}
                    y={-0.142}
                    colorInterpolationFilters='sRGB'
                >
                    <feFlood floodColor="#000" floodOpacity={0.224} result="flood" />
                    <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={0.5} />
                    <feOffset dx={0.1} dy={0.1} in="blur" result="offset" />
                    <feComposite in="flood" in2="offset" operator="in" result="comp1" />
                    <feComposite in="SourceGraphic" in2="comp1" result="comp2" />
                </filter>
                <filter
                    id="a"
                    width={1.143}
                    height={1.297}
                    x={-0.069}
                    y={-0.142}
                    colorInterpolationFilters='sRGB'
                >
                    <feFlood floodColor="#000" floodOpacity={0.224} result="flood" />
                    <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={0.5} />
                    <feOffset dx={0.1} dy={0.1} in="blur" result="offset" />
                    <feComposite in="flood" in2="offset" operator="in" result="comp1" />
                    <feComposite in="SourceGraphic" in2="comp1" result="comp2" />
                </filter>
                <filter
                    id="c"
                    width={1.144}
                    height={1.297}
                    x={-0.069}
                    y={-0.142}
                    colorInterpolationFilters='sRGB'
                >
                    <feFlood floodColor="#000" floodOpacity={0.224} result="flood" />
                    <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={0.5} />
                    <feOffset dx={0.1} dy={0.1} in="blur" result="offset" />
                    <feComposite in="flood" in2="offset" operator="in" result="comp1" />
                    <feComposite in="SourceGraphic" in2="comp1" result="comp2" />
                </filter>
                </defs>
                <rect
                ref={elements.svg.bar1}
                width={12}
                height={8.428}
                x={3.8}
                y={6.786}
                ry={2.687}
                style={{
                    fill:color.barDefault,
                    fillOpacity: 0.982729,
                    strokeWidth: 3.40157,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    paintOrder: "stroke markers fill",
                    filter: "url(#c)",
                    transform:'translate(2px)',
                    transition:'all 0.3s ease'
                }}
                />
                <rect
                ref={elements.svg.bar2}
                width={15}
                height={8.428}
                x={3.8}
                y={20.786}
                ry={2.687}
                style={{
                    fill: color.barDefault,
                    fillOpacity: 0.982729,
                    strokeWidth: 3.40157,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    paintOrder: "stroke markers fill",
                    filter: "url(#a)",
                    transform:'translate(2px)',
                    transition:'all 0.6s ease'
                }}
                />
                <rect
                ref={elements.svg.bar3}
                width={33.95}
                height={8.428}
                x={3.8}
                y={34.786}
                ry={2.687}
                style={{
                    fill:color.barDefault,
                    fillOpacity: 0.982729,
                    strokeWidth: 3.40157,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    paintOrder: "stroke markers fill",
                    filter: "url(#b)",
                    transform:'translate(2px)',
                    transition:'all 1s ease'
                }}
                />
                <g 
                    style={{
                        translate: '1px 4px'
                    }}
                >
                <circle
                ref={elements.svg.circle}
                cx={-29.869}
                cy={25.209}
                r={8.073}
                style={{
                    fill: "rgba(0,0,0,0)",
                    fillOpacity: 0.982729,
                    stroke:"rgb(72, 199, 81)",
                    strokeWidth: 4,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: 128,
                    strokeDashoffset: 100,
                    strokeOpacity: 1,
                    paintOrder: "fill stroke markers",
                    filter: "url(#d)",
                }}
                transform="rotate(-120)"
                />
                <path
                ref={elements.svg.tick}
                d="m32.737 12.927 2.686 3.861 5.204-6.715"
                style={{
                    fill: "none",
                    fillOpacity: 0.982729,
                    stroke: "rgba(255, 255, 255, 0.8)",
                    strokeWidth: 2,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: 24,
                    strokeDashoffset: 24,
                    strokeOpacity: 1,
                    paintOrder: "stroke markers fill",
                }}
                />
                </g>
            </svg>
            
        </div>
        
    )
}

const HighLight4 = ():JSX.Element=>{
    const intervalId = useRef<NodeJS.Timeout|number|null>(null)
    const transform = {
        innerStar: {
            default: 'matrix(0.44873199,-0.44873199,0.44873199,0.44873199,17.805687,30.046758)',
            hover: 'matrix(0.42413412,0,0,0.42413412,19.21497,23.985083)'
        },
        outerStar: {
            default: "matrix(0.63460287,0,0,0.63460287,16.344256,23.481449)",
            hover: "matrix(0.66383464,0,0,0.66383464,15.945547,23.411499)"
        }
    }
    const elements = {
        highlight: useRef<HTMLDivElement|null>(null),
        svg:{
            circle: useRef<SVGCircleElement|null>(null),
            star: {
                inner: useRef<SVGPathElement|null>(null),
                outer: useRef<SVGPathElement|null>(null),
            }
        }
    }
    const onMouseEnter = (e: React.MouseEvent)=>{
        let circle = elements.svg.circle.current
        let innerStar = elements.svg.star.inner.current
        let outerStar = elements.svg.star.outer.current

        let t = 0;

        if(!circle || !innerStar || !outerStar) return

        circle.style.fill = "rgb(165, 92, 221)"

        innerStar.style.transform = transform.innerStar.hover
        //outerStar.style.transform = transform.outerStar.hover
        
        if(intervalId.current==null){
            intervalId.current = setInterval(()=>{
                if(t==0){
                    outerStar.style.transform = transform.outerStar.hover
                    t++;
                }else{
                    outerStar.style.transform = transform.outerStar.default
                    t--;
                }
            },500)
        }
        
        //console.log(intervalId.current)
        
    }
    const onMouseLeave = (e: React.MouseEvent)=>{
        let circle = elements.svg.circle.current
        let innerStar = elements.svg.star.inner.current
        let outerStar = elements.svg.star.outer.current

        if(!circle || !innerStar || !outerStar) return

        circle.style.fill = "rgb(171, 129, 204)"

        innerStar.style.transform = transform.innerStar.default
        if(intervalId.current){
            clearInterval(intervalId.current)
            intervalId.current = null
        }
        outerStar.style.transform = transform.outerStar.default
    }
    return(
        <div className='highlight' ref={elements.highlight} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <h2>Certifications & Badges</h2>
            <p>Earn industry-recognized certificates and digital badges for each completed course.</p>
            <svg width={50} height={50} viewBox='0 0 50 50'>
                <defs>
                <filter
                    id="a"
                    width={1.064}
                    height={1.064}
                    x={-0.031}
                    y={-0.031}
                    colorInterpolationFilters='sRGB'
                >
                    <feFlood floodColor="#000" floodOpacity={0.224} result="flood" />
                    <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={0.5} />
                    <feOffset dx={0.1} dy={0.1} in="blur" result="offset" />
                    <feComposite in="flood" in2="offset" operator="in" result="comp1" />
                    <feComposite in="SourceGraphic" in2="comp1" result="comp2" />
                </filter>
                </defs>
                <circle
                ref={elements.svg.circle}
                cx={25}
                cy={25}
                r={19.528}
                style={{
                    fill:"rgb(171, 129, 204)",
                    fillOpacity: 0.982729,
                    stroke: "none",
                    strokeWidth: 3.56406,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    paintOrder: "stroke markers fill",
                    filter: "url(#a)",
                    transition:'fill 0.4s ease'
                }}
                />
                <path
                ref={elements.svg.star.inner}
                d="M13.64 22.858c-3.016 0-5.103-11.097-7.236-13.23-2.132-2.132-13.23-4.22-13.23-7.235 0-3.016 11.098-5.103 13.23-7.236 2.133-2.132 4.22-13.23 7.236-13.23 3.015 0 5.103 11.098 7.235 13.23 2.133 2.133 13.23 4.22 13.23 7.236s-11.097 5.103-13.23 7.235c-2.132 2.133-4.22 13.23-7.235 13.23z"
                style={{
                    fill:"rgb(243, 192, 12)",
                    fillOpacity: 0.982729,
                    stroke: "none",
                    strokeWidth: 3.40157,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeOpacity: 1,
                    paintOrder: "stroke markers fill",
                    transition: 'transform 0.7s ease',
                }}
                transform={transform.innerStar.default}
                />
                <path
                ref={elements.svg.star.outer}
                d="M13.64 22.858c-3.016 0-5.103-11.097-7.236-13.23-2.132-2.132-13.23-4.22-13.23-7.235 0-3.016 11.098-5.103 13.23-7.236 2.133-2.132 4.22-13.23 7.236-13.23 3.015 0 5.103 11.098 7.235 13.23 2.133 2.133 13.23 4.22 13.23 7.236s-11.097 5.103-13.23 7.235c-2.132 2.133-4.22 13.23-7.235 13.23z"
                style={{
                    fill:"rgb(243, 207, 12)",
                    fillOpacity: 0.982729,
                    stroke: "none",
                    strokeWidth: 3.40157,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeOpacity: 1,
                    paintOrder: "stroke markers fill",
                    transition:'transform 0.5s linear'
                }}
                transform={transform.outerStar.default}
                />
            </svg>
        </div>
    )
}