'use client';

import './Navbar.css'

//React Lib
import { FC, useState } from 'react';
//Components
import logo from '@/images/logo/logo';
//Other Libs
import { useAuthContext } from "@/context/authContext";
import { log } from 'console';
import Image from 'next/image';
import icons from '@/images/icons/icons';
import { delCookie } from '@/lib/cookies';
import { useRouter } from 'next/navigation';

type Props = {
    id?: string;
    classname?: string;
    sidebar:{
        active:boolean;
        toogleSidebar: ()=>void;
    }
    
}
export const Navbar : FC<Props> = ({id, classname, sidebar})=> {
    const router = useRouter()
    const {updateAuth, user} = useAuthContext();

    //const [showSidebar, setShowSidebar] = useState<boolean>(false);

    const logoutHandler = ()=>{
        delCookie('authToken');
        alert(`User ${user?.username} has been Logged Out`)
        router.replace('/')
    }
    
    return (
    <nav className={classname||'navbar'} id={id}>
        <div id='navbar-sec1'>
            <div style={{marginLeft:'30px'}} onClick={sidebar.toogleSidebar}>
                {sidebarIcon(sidebar.active,undefined,30)}
            </div>
            
            <Image src={logo.fullLogo} alt='logo' width={150}/>
        </div>
        
        <div id='navbar-sec2'>
            <div id='username'>
                {icons.user(50)}
                {user?.username}
            </div>
            
            <div id='logout-btn' title='Log Out' onClick={logoutHandler}>
                {icons.logout(40)}
            </div>
            
        </div>
        
    </nav>
    )
}
const sidebarIcon = (active:boolean, fill?:string, width?: number) =>{
    return(
        <svg className={active?'sidebar-icon active':'sidebar-icon'} width={`${width}`||'40'} height="100%" viewBox="0 0 40 28" xmlns="http://www.w3.org/2000/svg">
            <g fill={fill||'#ffffff'}>
                <rect width="40" height="6.66667" rx="3.33333" />
                <rect y="21.3333" width="40" height="6.66667" rx="3.33333"/>
                <rect y="10.6667" width="40" height="6.66667" rx="3.33333"/>
            </g>
            
        </svg>
    )
}