'use client';

import './style.css'
import CourseBox from "@/components/CourseBox";
import { courseCovers } from "@/images/course/courseCovers";
import { get } from "@/lib/fetchReq";
import { findAllCourses } from "@/mongoDB/courses";
import { Course } from "@/types/databaseTypes";
import { status } from '@/types/statusType';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

class apiLinks {
    static apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN||'localhost:3000'
    static httpsOrNot = process.env.NODE_ENV==='production'?'https':'http';

    static get getAllCourses() { return `${this.httpsOrNot}://${this.apiDomain}/api/courses/findall`}
}
export default function Courses (){
    const router = useRouter()
    const [allCourses,setAllCourses] = useState<Course[]>([]);
    useEffect(()=>{
        let getCourses = async ()=>{
            let data:status = await get(apiLinks.getAllCourses);
            if (data.courses){
                setAllCourses(data.courses);
            }
        }
        getCourses();
    },[])
    return(
        <>
        <h2>Explore Courses</h2>
        <div className="course-list">
            {allCourses.map( c => <CourseBox key={c.courseId} cover={courseCovers.cpp} name={c.courseName} skills={c.skills} link={`courses/${c.courseId}`}/>)}
            {/*`/course/${c.courseId}`*/}
        </div>
        </>
    )
}