'use client';

import './style.css'

import { get } from "@/lib/fetchReq";
import { Course } from "@/types/databaseTypes";
import { status } from '@/types/statusType';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import ApiLinks from '@/lib/apiLinks';
import CourseCard from '@/components/CourseCard';

export default function Courses (){
    const router = useRouter()
    const [allCourses,setAllCourses] = useState<Course[]>([]);
    useEffect(()=>{
        let getCourses = async ()=>{
            let data:status = await get(ApiLinks.courses.findall.this);
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
            {allCourses.map( c => <CourseCard key={c.courseId} courseDetails={{
                course: c.courseName,
                courseId: c.courseId,
                skills: c.skills
            }}/>)}
        </div>
        </>
    )
}