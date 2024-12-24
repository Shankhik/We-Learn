'use client'
import { useAuthContext } from '@/context/authContext'
import './style.css'
import { useEffect, useState } from 'react';
import CourseBox from '@/components/CourseBox';
import { courseCovers } from '@/images/course/courseCovers';
export default function Dashboard (){

    const {user, updateAuth} = useAuthContext();
    const notes:string[] = [
        `Welcome ${user?.username}!`,
        `What's Up ${user?.username}?`,
        `How's it going ${user?.username}?`
    ]
    const [welcomeNote,setWelcomeNote] = useState<string>('');
    
    useEffect(()=>{
        setWelcomeNote(notes[Math.floor(Math.random()*notes.length)])
    },[user]);

    return(
        <>
        <h1>{welcomeNote}</h1>
        <h2>Trending</h2>
        <div className='course-list'>
            <CourseBox cover={courseCovers.java}name={'Java'} skills={['coding','java','oops']}/>
            <CourseBox cover={courseCovers.java}name={'Java'} skills={['coding','java','oops']}/>
            <CourseBox cover={courseCovers.java}name={'Java'} skills={['coding','java','oops']}/>
        </div>
        </>
    )
        
}