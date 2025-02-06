'use client'

import { useRouter } from 'next/navigation';
import './CourseCard.css'
import { useColorContext } from '@/context/colorScheme';


type CourseDetails = {
    course: string;
    courseId: string;
    skills: string[];
    price?: number;
    imgLink?: string;
}
const CourseCard = ({courseDetails}:{courseDetails: CourseDetails})=>{
    const {accentColor} = useColorContext()
    const router = useRouter()
    const cldname = process.env.NEXT_PUBLIC_CLD_NAME||''
    const resourse = {
        green: `https://res.cloudinary.com/${cldname}/image/upload/v1737619044/WeLearn/course-cover-1.png`,
        red: `https://res.cloudinary.com/${cldname}/image/upload/v1737619214/WeLearn/course-cover-2.png`,
        blue: `https://res.cloudinary.com/${cldname}/image/upload/v1737619305/WeLearn/course-cover-3.png`
    }
    const onClick = ()=>{
        router.push(`/home/courses/${courseDetails.courseId}`)
    }
    return(
        <div className='course-card' 
            onClick={onClick}
            style={{
                backgroundImage:`url('${ courseDetails.imgLink ||resourse[accentColor] }')`
            }}
        >
            <div className='bg'></div>
            <div>
                <h2>{courseDetails.course}</h2>
                <h6>{courseDetails.price? `Rs. ${courseDetails.price}`:'Free'}</h6>
            </div>
            
            
            <div className='card-skills'>{
                courseDetails.skills.map((skill,index)=>{
                    return <h5 key={`skill-${index}`}>{skill}</h5>
                })
            }</div>
        </div>
    )
}

export default CourseCard