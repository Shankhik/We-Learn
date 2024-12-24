'use client'
import './CourseBox.css'
import { FC } from "react";
import { Skills } from '@/types/databaseTypes';
import { courseCovers } from '@/images/course/courseCovers';
import Image, { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
type Props = {
    name: string;
    skills: Skills[];
    cover?: string | StaticImageData;
    link?:string;
}
const CourseBox:FC<Props> = ({name,skills,cover,link}) =>{
    const router = useRouter();
    const color = !cover?'rgba(0,0,0,0.5)':''
    return(
        <div className="course-box" onClick={()=> router.push(link||'')}>
            <Image src={cover||courseCovers.nothing} alt='cover'/>
            <div className='cover' style={{backgroundColor: color}}>
            </div>
            <h3>{name}</h3>
            <div className='skills'>
                {skills.map((skill,key)=> <div key={key}>{skill}</div>)}
            </div>
        </div>
    )
}
export default CourseBox;