'use client'
import { useAuthContext } from '@/context/authContext'
import './style.css'
import { useEffect, useState } from 'react';
import CourseCard from '@/components/CourseCard';
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
        <h2>New</h2>
        <div className='course-list'>
            <CourseCard courseDetails={{
                course:'java',
                courseId:'java101',
                skills: ['coding', 'java', 'oops'],
            }}/>
        </div>
        </>
    )
        
}