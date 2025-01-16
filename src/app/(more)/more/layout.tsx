'use client';
import Image from 'next/image';
import logo from '@/images/logo/logo';
import './global.css'
import React, { useState } from "react";
import Link from 'next/link';

export default function Layout ({children}: Readonly<{children: React.ReactNode}>){
    const [showDropLinks, setShowDropLinks] = useState<boolean>(false);
    const dropIcon = (
        <svg id='more-drop-icon' className={showDropLinks?'enabled':'disabled'} width="16" height="16" viewBox="0 0 16 16" fill="rgb(71, 156, 100)" xmlns="http://www.w3.org/2000/svg">
            <path transform='translate(0, 0)' d="M7.29289 15.7071C7.68342 16.0976 8.31658 16.0976 8.70711 15.7071L15.0711 9.34315C15.4616 8.95262 15.4616 8.31946 15.0711 7.92893C14.6805 7.53841 14.0474 7.53841 13.6569 7.92893L8 13.5858L2.34315 7.92893C1.95262 7.53841 1.31946 7.53841 0.928932 7.92893C0.538408 8.31946 0.538408 8.95262 0.928932 9.34315L7.29289 15.7071ZM7 0L7 15H9V0L7 0Z"/>
        </svg>
    )
    return (
        <div className='more-page'>
            <div className='more-page-navbar'>
                <div>
                    <Image src={logo.fullLogo} alt='e'/>
                    <div className='links-container'>
                        <Link href='about'>About</Link>
                        <Link href='changelog'>Changelog</Link>
                        <button onClick={()=>{setShowDropLinks(!showDropLinks)}}>{dropIcon}</button>
                    </div>
                </div>
                <div className={`links-drop ${showDropLinks?'enabled':'disabled'}`}>
                    <Link href='about' onClick={()=>{setShowDropLinks(!showDropLinks)}}>About</Link>
                    <Link href='changelog' onClick={()=>{setShowDropLinks(!showDropLinks)}}>Changelog</Link>
                </div>

            </div>
            <main className='more-page-content'>
                {children}
            </main>
            
        </div>
    )
}