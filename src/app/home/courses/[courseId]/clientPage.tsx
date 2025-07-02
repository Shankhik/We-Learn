'use client';
import './style.css';
import { useAuthContext } from "@/context/authContext";
import { post } from "@/lib/fetchReq";
import { Course } from "@/types/databaseTypes";
import { status } from "@/types/statusType";
import { useEffect, useState } from "react";

import { colorScheme, useColorContext } from '@/context/colorScheme';

import ApiLinks from '@/lib/apiLinks';
import Link from 'next/link';

export default function CourseDescription ({courseId}:{
    courseId: string
}) {
    const {user, updateAuth} = useAuthContext();
    const [course,setCourse] = useState<Course>({
        courseName: "",
        courseId: "",
        description: "",
        author:{
            name:''
        },
        skills: [],
        rating: {
            rateCount: 0,
            userCount: 0
        },
        modules: []
    })
    const [enrolled, setEnrolled] = useState<boolean>(false);

    const {effectiveTheme, accentColor, theme} = useColorContext();

    const enroll = async ()=>{
        if(!enrolled){
            const data:status = await post(ApiLinks.courses.enroll.this,{username:user?.username,courseId: courseId});
            if (data.status && data.courseHistory) setEnrolled(true);
            console.log(data)
        }else console.log({
            status: false,
            message: 'Already Enrolled. No request Sent'
        })
        
    }


    useEffect(()=>{
        const loadCourseDetails = async () => {
            //console.log(user?.username)
            const data:status = await post(ApiLinks.courses.findone.this,{courseId: courseId});
            //console.log(data.course)
            if(data.course){
                setCourse(data.course)
            }
            if(user?.username){
                const history:status = await post(ApiLinks.courses.findCourseHistory.this,{username:user?.username, courseId:courseId})
                if (history.courseHistory){
                    setEnrolled(true);
                }
            }
            
        }
        loadCourseDetails()
    },[user?.username])

    const content:JSX.Element =(
        <div className='course-details-page'>
            <div className='course-name'>
                <h1 style={{color: colorScheme.sidebar[accentColor].active[effectiveTheme]}}>{`${course.courseName}`}</h1>
                <p>{`(${course.courseId})`}</p>
            </div>
            <h4 id='course-rating'>{course.rating.userCount!==0?`${(course.rating.rateCount/course.rating.userCount).toFixed(1)}/5.0 (${course.rating.userCount})`:'Not Yet Rated'}</h4>
            <div className='course-description'>
                <h4>Description</h4>
                <p>{course.description}</p>
                <div>
                    {course.skills.map(skill=> <h5 style={{border: effectiveTheme==='light'? '2px solid rgba(0, 0, 0, 0.3)':''}} key={skill}>{skill}</h5>)}  
                </div>
            </div>
            <div className='course-modules'>
                <div> {/* buttons section*/}
                    <button className={`enroll-btn ${enrolled? 'enrolled':''}`} onClick={enroll}>{enrolled? 'Enrolled':'Enroll'}</button>
                    <div className={`go-to-btn ${!enrolled?'hidden':''}`} style={{backgroundColor: colorScheme.sidebar[accentColor].active[effectiveTheme]}}>
                        <Link href={`/course/${course.courseId}`} hidden={!enrolled} target='_blank'>Go to Course</Link>
                    </div>
                </div>
                <br/>
                <h4>Modules</h4>
                <ul>
                    {course.modules.map(module => <li key={module.moduleNumber}>{`${module.moduleNumber}. ${module.title}`}</li>)}
                </ul>
            </div>
        </div>
    )
    return course.courseName?content:null;
}