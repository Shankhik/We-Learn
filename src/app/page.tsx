'use client';

import { useAuthContext } from '@/context/authContext';
import './style.css'
import logo from '@/images/logo/logo'
import Image from 'next/image'
import { background } from '@/images/background/background';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { delCookie } from '@/lib/cookies';
import icons from '@/images/icons/icons';

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
    const [showPopUpBG,setShowPopUpBG] = useState<boolean>(false);
    
    const onClick = {
        profilePicture: ()=>{
            setShowPopUpBG(!showPopUpBG);
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
    return(
        <div id='landing-page'>
            {/*<div style={{gridArea:'1/1/-1/-1',zIndex:'0',width:'100%',height:'100dvh', overflow:'hidden', backgroundColor:'green', opacity:'0.2', position:'sticky', top:'0px', left:'0px'}} hidden={!showPopUpBG} onClick={()=> {setShowOption(false); setShowPopUpBG(false)}}></div>*/}
            <nav id='landing-page-navbar' ref={references.navbar}>
                <div style={{
                    padding:'30px'
                }}>
                    <Image src={logo.fullLogo} alt='logo' width={150} ref={references.navbarLogo}/>
                </div>
                <div style={{
                    display:'flex',
                    padding:'0px 50px 0px 0px'
                }}>
                    {/* Profile picture */}
                    <div style={{position:'relative'}} hidden={!verified}>
                        <h3 style={cssStyles.profilePicture} onClick={onClick.profilePicture} >{user?.username.substring(0,1)||"SHankhik".substring(0,1)}</h3>
                        <div id='login-options' hidden={!showOption} ref={references.loginPopUp}>
                            <h4>{user?.username}</h4>
                            <button style={cssStyles.profileBtn}>More</button>
                            <button style={cssStyles.logoutBtn} onClick={onClick.logout}>Logout</button>
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
                    <button hidden={!verified} onClick={()=> router.push('home/dashboard')}>Let's Learn</button>
                    
                </div>
            </div>
            <div className='landing-page-content'>
                <div className='highlights-container'>
                    <div className='highlight'>
                        <h2>Personalized Learning Paths</h2>
                        <p>Tailored courses and recommendations that adapt to each learner’s needs and goals.</p>
                        <Image src={icons.personalize} alt='perosnalize'/> 
                    </div>
                    <div className='highlight'>
                        <h2>24/7 Access</h2>
                        <p>Access courses anytime, anywhere, on mobile, tablet, or desktop.</p>
                        <Image src={icons.personalize} alt='perosnalize'/>
                    </div>
                    <div className='highlight'>
                        <h2>Progress Tracking Dashboard</h2>
                            <p>Monitor your learning progress, track completed courses, and set personal goals.</p>
                            <Image src={icons.personalize} alt='perosnalize'/>
                    </div>
                    <div className='highlight'>
                        <h2>Certifications & Badges</h2>
                        <p>Earn industry-recognized certificates and digital badges for each completed course.</p>
                        <Image src={icons.personalize} alt='perosnalize'/>
                    </div>
                </div>
                
            </div>
        </div>
    )
}
type Divnames = 'profilePicture'|'logoutBtn'|'profileBtn'|'highlightDivs';
const cssStyles: {[key in Divnames]:CSSProperties} = {
    profilePicture: {
        width: '50px',
        height: '50px',
        display: 'flex',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'green',
        color:'white',
        border:'2px solid rgba(255, 255, 255,0.6)',
        borderRadius: '50%',
    },
    logoutBtn: {
        marginTop:'10px',
        border:'1px solid rgba(0,0,0,0.1)',
        borderRadius:'10px',
        color:'white',
        padding:'8px',
        backgroundColor: '#e96161'
    },
    profileBtn: {
        margin:'10px 10px 0px 0px',
        border:'1px solid rgba(0,0,0,0.1)',
        borderRadius:'10px',
        color:'rgba(0,0,0,0.8)',
        padding:'8px',
        backgroundColor: '#b1ddd4'
    },
    highlightDivs: {
        height: '100px',
        width: '200px',
        border: '1px solid black',
        borderRadius:'10px',
        padding: '20px',
        flex:'1 1 200px'
    }
}

