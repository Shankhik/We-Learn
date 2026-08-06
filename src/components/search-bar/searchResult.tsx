"use client";

import { Course } from "@/types/databaseTypes";
import globalStyle from "./global.module.css";
import ModuleClassname from "@/lib/cssUtil";
import { useColorContext } from "@/context/colorScheme";
import Image, { StaticImageData } from "next/image";
import HideIf from "../HideIf";
import { getThumbnail } from "@/images/course/thumbnails/getThumbnail";
import { useMemo, useState } from "react";
import Link from "next/link";

export const SearchCard = ({data}:{
    data: Course
})=>{
    const css = new ModuleClassname(globalStyle);
    const {effectiveTheme} = useColorContext();

    const [isHovered, setIsHovered] = useState(false);

    const details = {
        maxSkills: 3,
        skillLength: 15
    }

    const thumbnail = useMemo<{
        image: string|StaticImageData,
        dominantColor: string
    }>(()=>{
        if (data.images?.thumbnail?.url)
            return {
                image: data.images.thumbnail.url,
                dominantColor: data.images.thumbnail.dominantColor||""
            };
        return getThumbnail({random:true})
    },[data.images?.thumbnail?.url]);

    return <>
    <div className={css.names(`search-card ${effectiveTheme}`)}
        onMouseEnter={()=> setIsHovered(true)}
        onMouseLeave={()=> setIsHovered(false)}
    >
        <Image src={thumbnail.image} width={150} height={150}
            alt={data.courseName}
            className={globalStyle['thumbnail']}
        />
        <div style={{width:"20px",
            maskImage:'linear-gradient(-90deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.7))',
            backgroundColor: isHovered? thumbnail.dominantColor:'',
            transition: "all 0.5s ease", flexShrink:0
        }}/>
        <div className={css.names(`main`)}>
            <Link className={globalStyle['course-name']}
                href={`/home/courses/${data.courseId}`}
            >
                {data.courseName}
            </Link>

            <span style={{fontSize:'0.8rem'}}>By {data.author.name||"UNKNOWN"}</span>
            
            <div // Skills container
                style={{
                    display:'flex', flexWrap:'wrap', gap:'5px',
                    marginTop:'8px'
                }}
            >
                {data.skills.map((skill,i)=>{
                    if (i>=4) return null;
                    const leftCharacter = Math.max(0,skill.length-details.skillLength)
                    return <span key={i}
                    title={leftCharacter>0? skill:undefined}
                    className={css.names(`skill ${effectiveTheme}`)}>
                        {leftCharacter>0?
                            skill.slice(0,details.skillLength)+"...":
                            skill
                        }
                    </span>
                })}
                {data.skills.length>details.maxSkills? <>
                    <span
                    className={css.names(`skill ${effectiveTheme}`)}>
                        +{data.skills.length-details.maxSkills}
                    </span>
                </>:null}
            </div>
            
        </div>
        
    </div>
    </>
}

export const ResultRenderer = ({data}:{
    data: Course[]|undefined
})=>{
    const css = new ModuleClassname(globalStyle);
    
    if (data?.length===0 || !data){
        return <>
        <div className={css.names(`nothing-found`)}>
            <h4>Nothing Found 😔</h4>
        </div>
        </>
    }
    return <>{
        data.map((course, i)=>{
            return <SearchCard data={course} key={i}/>
        })
    }</>
}