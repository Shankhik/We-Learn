'use client';
import './style.css';
import { useAuthContext } from "@/context/authContext";
import { post } from "@/lib/fetchReq";
import { Course } from "@/types/databaseTypes";
import { status } from "@/types/statusType";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

type Props= {
    courseId: string;
}
export default function CourseDescription ({params}:{params: Props}) {
    const {user, updateAuth} = useAuthContext();
    const router = useRouter();
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
    const gotoCourse = ()=>{
        if (course.courseId) router.push(`/course/${course.courseId}`)
    }
    const enroll = async ()=>{
        if(!enrolled){
            const data:status = await post('http://localhost:3000/api/courses/enroll',{username:user?.username,courseId: params.courseId});
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
            const data:status = await post('http://localhost:3000/api/courses/findone',{courseId: params.courseId});
            //console.log(data.course)
            if(data.course){
                setCourse(data.course)
            }
            if(user?.username){
                const history:status = await post('http://localhost:3000/api/courses/find-course-history',{username:user?.username, courseId:params.courseId})
                if (history.courseHistory){
                    setEnrolled(true);
                }
            }
            
        }
        loadCourseDetails()
    },[user?.username])
    
    return (
        <div id="course-details-page">
            <div style={{display: 'flex', alignItems:'center',marginLeft:'10px'}}>
                <h1 className='course-name'> {`${course.courseName}`}</h1>
                <h4 style={{whiteSpace:'pre',translate:'0px 2px'}} >{`   (${course.courseId})`}</h4>
            </div>
            
            <h4 style={{position:'absolute', top:'0px', right:'10px'}}>{course.rating.userCount!==0?`${(course.rating.rateCount/course.rating.userCount).toFixed(1)}/5.0 (${course.rating.userCount} users)`:'Not Yet Rated'}</h4>
            
            <div className='main-desc' /* DEVIDES INTO 2 COLUMNS */>
                
                <div style={{display:'flex', flex:'1 1 600px',flexDirection:'column',margin:'10px 0px 0px 0px'}}>
                    <h4 style={{margin:'0px 0px 10px 0px',alignSelf:'flex-start'}}>Description</h4>
                    <p style={{width:'95%', textAlign:'justify'}}>{course.description}</p>
                    <div style={{margin:'10px 0px 0px 0px', display:'flex', gap:'10px',flex:'0 1 auto'}}>
                        {course.skills.map(skill=> <h5 key={skill} style={{padding:'3px 10px 3px 10px',border:'2px solid grey',color:'grey', borderRadius:'20px', height:"fit-content"}}>{skill}</h5>)}
                        
                    </div>
                </div>

                <div style={{margin:'10px 0px 10px 0px', flex:'1 1 200px'}}>
                    <button className={enrolled?'desc-btn enroll disabled':'desc-btn enroll'} onClick={enroll}>{enrolled? 'Enrolled':'Enroll'}</button>
                    <button className='desc-btn goto' hidden={!enrolled} onClick={gotoCourse}>Goto Course</button>
                    <br/>
                    <br/>
                    <h4>Modules</h4>
                    <ul>
                        {course.modules.map(module => <li style={{translate:'-30px 0px',margin:'5px'}} key={module.moduleNumber}>{`${module.moduleNumber}. ${module.title}`}</li>)}
                    </ul>
                </div>
                
            </div>
            
            
        </div>

    )
}