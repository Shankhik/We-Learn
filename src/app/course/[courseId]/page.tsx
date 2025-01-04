'use client'

import './style.css';
import { useAuthContext } from "@/context/authContext";
import {colorScheme, useColorContext} from "@/context/colorScheme"
import { post } from "@/lib/fetchReq";
import { Course, EnrolledCourses } from "@/types/databaseTypes";
import { status } from "@/types/statusType";
import Image from 'next/image';
import { useRouter, useSearchParams } from "next/navigation";
import { CSSProperties, useEffect, useRef, useState } from "react";
import parse from 'html-react-parser';
import logo from '@/images/logo/logo';
import ApiLinks from '@/lib/apiLinks';
import LockedPage from '@/components/Locked';
import LoadingPage from '@/components/Loading';

export default function CourseLearn ({params}:{params:{courseId:string}}){
    const delay = (ms: number)=> new Promise(resolve=> setTimeout(resolve,ms));
    const {verified,user,updateAuth} = useAuthContext();
    const searchParams = useSearchParams()
    const router = useRouter();

    //UI variables
    const [showLoading, setShowLoading] = useState<boolean>(true);
    const [showLocked, setShowLocked] = useState<boolean>(false);
    const [showSidebar,setShowSidebar] = useState<boolean>(false);
    
    //CourseDetails
    const emptyCourse:Course= {
        courseName: '',
        courseId: '',
        description: '',
        author: {
            name: '',
            website: undefined
        },
        skills: [],
        rating: {
            rateCount: 0,
            userCount: 0
        },
        modules: []
    }
    const [enrolled, setEnrolled] = useState<boolean>(true);
    const [course,setCourse] = useState<Course>(emptyCourse);
    const completedUpto = useRef<number>(0);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [currentModule,setCurrentModule] = useState<number>(parseInt(searchParams.get('module')||'0'));
    
    //Initial details check about course and user
    useEffect(()=>{
        const loading = async ()=>{
            if(!verified||!user?.username){
                setShowLocked(true);
                await delay(1500);
                setShowLoading(false);
                return
            }
            
            var courseDetails:Course|undefined;
            let courseHistory:EnrolledCourses|undefined;
            var numOfModules = 0;
            let moduleParamToSet:number = 0;

            courseHistory = (await post(ApiLinks.courses.findCourseHistory.this,{username:user?.username, courseId:params.courseId}) as status).courseHistory
            
            //first checks if you are enrolled or not
            if(courseHistory){
                //loads course details
                courseDetails = (await post(ApiLinks.courses.findone.this,{courseId: params.courseId}) as status).course
                let update:status = await post(ApiLinks.courses.updateLastLoaded.this,{username:user?.username, courseId:params.courseId})
                completedUpto.current = courseHistory.completedUpto;
                //sets enrolled: true
                setEnrolled(true);
                //sets unauthorized: false
                setShowLocked(false);
            }else{
                setEnrolled(false);
                setShowLocked(true);
            }

            if(courseDetails){
                numOfModules = courseDetails.modules.length;
                setCourse(courseDetails)
                if(numOfModules===0) moduleParamToSet=0;
                else if(completedUpto.current<courseDetails.modules.length)
                    moduleParamToSet=completedUpto.current+1
                else moduleParamToSet = courseDetails?.modules.length
            }
            if(completedUpto.current===courseDetails?.modules.length) setIsCompleted(true);
            
            //params and current module handler
            if(searchParams.get('module')===null){
                setCurrentModule(moduleParamToSet);
                router.replace(`./${params.courseId}?module=${moduleParamToSet}`);
            }else{
                let temp = parseInt(searchParams.get('module')||'0')
                if (temp<=moduleParamToSet && temp!==0){
                    setCurrentModule(temp)
                    router.replace(`./${params.courseId}?module=${temp}`);
                }else{
                    setCurrentModule(moduleParamToSet)
                    router.replace(`./${params.courseId}?module=${moduleParamToSet}`);
                }
            }
            await delay(1500);
            setShowLoading(false);
        }
        loading();
    },[verified, params.courseId])

    //Theme Section
    const {effectiveTheme, theme, setTheme, accentColor, setAccentColor}= useColorContext();
    
    //Elements Reference
    const elements = {
        sidebar: useRef<HTMLDivElement|null>(null)
    }
    type CssStylesType = {
        [key in 'page'|'navbar'|'sidebar'|'content']: CSSProperties;
    }
    //Elements Style
    const cssStyles:CssStylesType = {
        page: {
            backgroundColor: colorScheme.page[accentColor].backgroundColor[effectiveTheme],
            color: effectiveTheme==='dark'? 'rgba(255,255,255,0.8)': ''
        },
        navbar: {
            background: `linear-gradient(${colorScheme.navbar[accentColor].background[effectiveTheme]},#00000000)`
        },
        sidebar: {
            backgroundColor: colorScheme.sidebar[accentColor].backgroundColor[effectiveTheme]
        },
        content: {

        }
    }
    
    //Course Name color changer
    const [inMobile,setInMobile] = useState<boolean>(false);
    
    useEffect(()=>{
        const maxWidth = 400; //width you want to check
        const widthChecker = (event:any) =>{
            if (event.matches) setInMobile(true)
            else setInMobile(false)
        }
        const mediaQuery = window.matchMedia(`(max-width: ${maxWidth}px)`);
        //initial check
        widthChecker(mediaQuery);

        mediaQuery.addEventListener('change',widthChecker)
        return ()=>{
            mediaQuery.removeEventListener('change',widthChecker)
        }
    },[])

    //module click handler
    const moduleClickHandler =(e:React.MouseEvent)=>{
        let num = parseInt(e.currentTarget.getAttribute('id')?.split('-')[1]||'1');
        
        if(num<=completedUpto.current+1){
            setCurrentModule(num);
            //changes the search query
            router.replace(`./${params.courseId}?module=${num}`)
            
            setShowSidebar(!showSidebar);
        }
    }
    //Module Hover: ON
    const mouseEnterHandler = (e: React.MouseEvent)=>{
        const target = e.currentTarget as HTMLDivElement
        //if its the current module
        if (currentModule === parseInt(target.id.split('-')[1]||'0')){
            target.style.backgroundColor = colorScheme.sidebar[accentColor].activeHover[effectiveTheme];
        }
        //if it isnt the current module
        else{
            //if it is available to click
            if(parseInt(target.id.split('-')[1]||'0')<=completedUpto.current+1)
                target.style.backgroundColor = colorScheme.sidebar[accentColor].hover[effectiveTheme];
            //module isnt available to open
            else
                target.style.backgroundColor = '';
        }
    }
    //Module Hover: OFF
    const mouseExitHandler = (e: React.MouseEvent)=>{
        const target = e.currentTarget as HTMLDivElement
        if (currentModule === parseInt(target.id.split('-')[1]||'0')){
            target.style.backgroundColor = colorScheme.sidebar[accentColor].active[effectiveTheme];
        }
        else{
            target.style.backgroundColor = '';
        }
    }
    //Outside Click Handler
    useEffect(()=>{
        const sidebarOutsideClick = (e: globalThis.MouseEvent)=>{
            if(showSidebar && !elements.sidebar.current?.contains(e.target as Node)){
                setShowSidebar(false)
            }
        }
        //Add all event Listeners here
        document.addEventListener('click',sidebarOutsideClick)
        //All event listener Cleanup funntion
        return ()=>{
            document.removeEventListener('click',sidebarOutsideClick)
        }
    },[showSidebar])// add dependencies related to Event Listeners

    //'Mark as Read' Button Handler
    const btnHandlerMarkAsRead = async()=>{
        let num = parseInt(searchParams.get('module')||'1');
        await post(ApiLinks.courses.inc.this,{username: user?.username||undefined, courseId: params.courseId})
        completedUpto.current = completedUpto.current+1;
        if (completedUpto.current < course.modules.length){
            setCurrentModule(num+1);
            router.replace(`./${params.courseId}?module=${num+1}`)
        }
        else{
            setIsCompleted(true);
            let ack = await post(ApiLinks.courses.completeCourse.this,{username: user?.username, courseId: params.courseId})
            console.log(ack)
        }
    }
    const loadingAndLockedStyle:CSSProperties ={
        background: effectiveTheme==='light'?'rgba(0, 0, 0, 0.6)':'rgba(0, 0, 0, 0.31)',
        backdropFilter: 'blur(80px)'
    }
    return (
        <div id="learn-page" style={cssStyles.page}>
            <LoadingPage show={showLoading} style={loadingAndLockedStyle} zIndex={6}/>
            <LockedPage show={showLocked||(!enrolled)} message={showLocked?'UnAuthorized':'Not Enrolled'}
                zIndex={4}
                style={loadingAndLockedStyle}
            />
            <div className='fader' style={{zIndex:'5'}}></div>
            <nav id='learn-page-navbar' style={cssStyles.navbar}>
                <svg width="50" height="40" viewBox="0 0 50 50.000002"
                    id='show-sidebar-icon'
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
                <div>
                    <h1 style={{
                        color: !inMobile && effectiveTheme==='light'?'rgba(0,0,0,0.4)':'rgba(255,255,255,0.8)',
                        transition: 'all 0.2s ease'
                    }}
                    >{course.courseName}</h1>
                    {/*<h5>{`  [ ${course.courseId} ]`}</h5>*/}
                </div>
                
            </nav>
            <aside className={`learn-page-sidebar ${showSidebar===true?'enabled':'disabled'}`} style={cssStyles.sidebar} ref={elements.sidebar}>
                {course.modules.map(module => 
                    <div className='modules' id={`module-${module.moduleNumber}`} key={module.moduleNumber}
                        onClick={moduleClickHandler}
                        onMouseEnter={mouseEnterHandler} onMouseLeave={mouseExitHandler}
                        style={{
                            backgroundColor: module.moduleNumber===parseInt(searchParams.get('module')||'0')? colorScheme.sidebar[accentColor].active[effectiveTheme]: '',
                            color: module.moduleNumber===parseInt(searchParams.get('module')||'0')?'rgba(255,255,255,0.9)':(module.moduleNumber<=completedUpto.current+1?'':(effectiveTheme==='light'?'rgba(0,0,0,0.3)':'rgba(255, 255, 255, 0.3)'))
                        }}
                    >
                        <h4>{module.title}</h4>
                    </div>
                )}
                <div className='modules'
                    style={{
                        backgroundColor: colorScheme.sidebar[accentColor].active[effectiveTheme],
                        marginTop:'auto',
                        justifyItems:'center'
                    }}
                    hidden={!(completedUpto.current === course.modules.length)}
                >
                    <h4 style={{textAlign:'center',color:'rgba(255,255,255,0.9'}}>Download Certificate</h4>
                </div>
            </aside>
            <div id='learn-page-content' className='jsx-styles'>
                {parse(course.modules[currentModule-1]?.jsx||'<div></div>')}
                <div style={{marginTop:'30px'}}>
                    <button id='complete-btn' onClick={btnHandlerMarkAsRead} hidden={isCompleted}
                        style={{backgroundColor:colorScheme.sidebar[accentColor].active[effectiveTheme]}}
                    >Mark as Completed</button>
                    <h4 hidden={currentModule>completedUpto.current}>Completed</h4>
                </div>
            </div>
        </div>
    )
}

