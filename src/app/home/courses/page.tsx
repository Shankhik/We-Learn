'use client';

import './style.css'
import CourseBox from "@/components/CourseBox";
import { courseCovers } from "@/images/course/courseCovers";
import { get } from "@/lib/fetchReq";
import { Course } from "@/types/databaseTypes";
import { status } from '@/types/statusType';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import ApiLinks from '@/lib/apiLinks';

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
            {allCourses.map( c => <CourseBox key={c.courseId} cover={courseCovers.cpp} name={c.courseName} skills={c.skills} link={`courses/${c.courseId}`}/>)}
            {/*`/course/${c.courseId}`*/}
        </div>
        </>
    )
}