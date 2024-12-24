'use client'
import './style.css'
import LoadingPage from "@/components/LoadingPage";
import UnauthorizedPage from "@/components/UnauthorizedPage";
import { useAuthContext } from "@/context/authContext";
import { getCookie, setCookie } from "@/lib/cookies";
import { post } from "@/lib/fetchReq";
import { Course, EnrolledCourses } from "@/types/databaseTypes";
import { status } from "@/types/statusType";
import Image from 'next/image';
import { useRouter, useSearchParams } from "next/navigation";
import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from "react";
import { colorScheme } from '@/context/colorScheme';
import parse from 'html-react-parser';
import logo from '@/images/logo/logo';


type AccentColors = 'red'|'green'|'blue'

class apiLinks{
    static apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN||'localhost:3000'
    static httpsOrNot = process.env.NODE_ENV==='production'?'https':'http';
    
    static get getCourseDetails(){ return `${this.httpsOrNot}://${this.apiDomain}/api/courses/findone`}
    static get getCourseHistory(){ return `${this.httpsOrNot}://${this.apiDomain}/api/courses/find-course-history`}
    static get updateLastLoaded(){ return `${this.httpsOrNot}://${this.apiDomain}/api/courses/update-last-loaded`}
    static get markAsRead(){ return `${this.httpsOrNot}://${this.apiDomain}/api/courses/inc`}
    static get setAsCompleted(){ return `${this.httpsOrNot}://${this.apiDomain}/api/courses/complete-course`}
}
export default function CourseLearn ({params}:{params:{courseId:string}}){
    const delay = (ms: number)=> new Promise(resolve=> setTimeout(resolve,ms));
    const {verified,user,updateAuth} = useAuthContext();
    const searchParams = useSearchParams()
    const router = useRouter();
    const [pageState,setPageState] = useState<'loading'|'un-authorized'|'authorized'|'not-enrolled'>('loading');
    
    
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
    const [course,setCourse] = useState<Course>(emptyCourse)
    const completedUpto = useRef<number>(0);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [currentModule,setCurrentModule] = useState<number>(parseInt(searchParams.get('module')||'0'));
    const [showSidebar,setShowSidebar] = useState<boolean>(false);
    
    const [trigger,setTrigger] = useState<boolean>(false);
    const forceUpdate=()=>{
        setTrigger(!trigger)
    }
    //Initial details check about course and user
    useEffect(()=>{
        const loading = async ()=>{
            await delay(800);
            console.log(process.env.NODE_ENV)
            if(!verified||!user?.username){
                setPageState('un-authorized')
            }
            
            var courseDetails:Course|undefined;
            let courseHistory:EnrolledCourses|undefined;
            var numOfModules = 0;
            let moduleParamToSet:number = 0;

            courseDetails = (await post(apiLinks.getCourseDetails,{courseId: params.courseId}) as status).course
            courseHistory = (await post(apiLinks.getCourseHistory,{username:user?.username, courseId:params.courseId}) as status).courseHistory
            if(courseHistory){
                let update:status = await post(apiLinks.updateLastLoaded,{username:user?.username, courseId:params.courseId})
                completedUpto.current = courseHistory.completedUpto;
                setPageState('authorized');
            }else{
                setPageState('not-enrolled')
            }

            if(courseDetails){
                numOfModules = courseDetails.modules.length;
                setCourse(courseDetails)
                if(numOfModules===0) moduleParamToSet=0;
                else if(completedUpto.current<courseDetails.modules.length)
                    moduleParamToSet=completedUpto.current+1
                else moduleParamToSet = courseDetails?.modules.length
            }
            if(completedUpto.current===courseDetails?.modules.length) setIsCompleted(true)
            
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
            
        }
        loading();
    },[verified, params.courseId])

    //Theme Section
    const [effectiveTheme,setEffectedTheme] = useState<'light'|'dark'>('light')
    const [theme,setTheme] = useState<'light'|'dark'|'default'>('light');
    const [accentColor,setAccentColor] = useState<AccentColors>('blue')
    
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
    //Collecting Theme details
    useEffect(()=>{
        let colorScheme = getCookie('ColorScheme').cookie
        let cookie_theme, cookie_accentColor

        if(colorScheme){
            cookie_theme = colorScheme.split('; ')[0].split(': ')[1] as 'light'|'dark'|'default'
            cookie_accentColor = colorScheme.split('; ')[1].split(': ')[1] as AccentColors
        }
        if(cookie_theme && cookie_accentColor){
            setTheme(cookie_theme)
            setAccentColor(cookie_accentColor)
        }else setCookie('ColorScheme', `Theme: ${theme}; AccentColor: ${accentColor}`)
    },[])
    //Checking for Browser color scheme change
    useEffect(()=>{
        const browserThemeChecker = (event:any)=>{
            if (theme === 'default') {
                if (event.matches) setEffectedTheme('dark')
                else setEffectedTheme('light')
            }
            else {
                setEffectedTheme(theme=== 'light'? 'light':'dark')
            }
        }
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        
        //initial Run
        browserThemeChecker(window.matchMedia('(prefers-color-scheme: dark)'))
        
        mediaQuery.addEventListener('change',browserThemeChecker)
        return ()=> mediaQuery.removeEventListener('change',browserThemeChecker)
    },[theme])
    
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
        await post(apiLinks.markAsRead,{username: user?.username||undefined, courseId: params.courseId})
        completedUpto.current = completedUpto.current+1;
        if (completedUpto.current < course.modules.length){
            setCurrentModule(num+1);
            router.replace(`./${params.courseId}?module=${num+1}`)
        }
        else{
            setIsCompleted(true);
            let ack = await post(apiLinks.setAsCompleted,{username: user?.username, courseId: params.courseId})
            console.log(ack)
        }
    }
    const renderSelector = ()=>{
    switch(pageState){
    case "loading":
        return <LoadingPage zIndex={19} show={true}/>
    case "un-authorized":
        return <UnauthorizedPage zIndex={19} show={true}/>
    case "not-enrolled":
        return(
        <div>
            Not Enrolled
        </div>
        )
    case "authorized":
        return(
        <div id="learn-page" style={cssStyles.page}>
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
                <div style={{display:'flex', alignItems:'baseline',whiteSpace:'preserve',marginLeft:'5%'}}>
                    <h1>{course.courseName}</h1>
                    <h5>{`  [ ${course.courseId} ]`}</h5>
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
                    <h5 hidden={currentModule>completedUpto.current}>Completed</h5>
                </div>
            </div>
        </div>
        )
    }
    }
    
    return renderSelector()
}

