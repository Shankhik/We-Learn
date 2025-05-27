'use client'
import './Sidebar.css'
import icons from '@/images/icons/icons'
import Link from 'next/link'
import { useRouter,usePathname } from 'next/navigation'
import { FC, FormEvent, RefObject, useContext, useEffect, useRef, useState } from 'react'
type Props = {
    classname?: string;
    id?: string;
    width?:number;
    sidebar:{
        active: boolean;
        toogleSidebar: ()=>void;
    }
}
export const Sidebar: FC<Props> = ({classname, id, width, sidebar}) =>{
    const router = useRouter();
    //const [localShow, setLocalShow] = useState<boolean>(show||false);
    const [activeLink,setActiveLink] = useState<'dashboard'|'lib'|'courses'>('dashboard');
    const pathname = usePathname()
    
    
    const checkURLforActiveLink =()=>{
        const paths = pathname.split('/');
        //sets activeLink based on the Url
        setActiveLink(paths[2] as 'dashboard'|'lib'|'courses')
        
        /* Other approach
        if (pathss[2] === activeLink) setActiveLink('dashboard')
        else if (pathss[2] === 'lib') setActiveLink('lib')
        else if (pathss[2] === 'courses') setActiveLink('courses')
        */
    }
    
    useEffect(()=>{
        checkURLforActiveLink();
    },[])
    
    const references = {
        sidebar:useRef<HTMLElement>(null),
        dashboard : useRef<HTMLDivElement>(null),
        myLib: useRef<HTMLDivElement>(null),
        allCourses: useRef<HTMLDivElement>(null)
    }
    const handleLinks = (e: React.MouseEvent<HTMLDivElement>, link:string)=>{
        /*
        //wont need this comment's code because active link is being found out from the link directly
        
        Object.keys(references).forEach((element) => {
            const currentRef = references[element as keyof typeof references].current;
            if (currentRef) {
                if(currentRef.classList.contains('active')){
                    currentRef.classList.remove('active')
                }
            }
        });
        e.currentTarget.classList.add('active');
        */
        router.replace(link)
        sidebar.toogleSidebar();
        //setLocalShow(!localShow)
    }
    return(
        <aside className={`${sidebar.active? 'sidebar show': 'sidebar'}`} id={id||''}
            ref= {references.sidebar}
            style={{
                width: `${width||270}px`
            }}>
            {/* This is active because it is the default in '/dashboard' */}
            <div className={`sidebar-links ${activeLink==='dashboard'?'active':''}`} ref={references.dashboard} onClick={(e)=>handleLinks(e,'dashboard')}>
                {icons.dashboard(30)}
                Dashboard
            </div>
            <div className={`sidebar-links ${activeLink==='lib'?'active':''}`} ref={references.myLib} onClick={(e)=>handleLinks(e,'lib')}>
                {icons.myCourses(30)}
                My Library
            </div>
            <div className={`sidebar-links ${activeLink==='courses'?'active':''}`} ref={references.allCourses} onClick={(e)=>handleLinks(e,'courses')}>
                {icons.allCourses(30)}
                Explore Courses
            </div>
        </aside>
    )
}
