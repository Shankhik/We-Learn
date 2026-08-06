'use client';

import { Heading } from "@/components/htmlElements/Texts";
import moduleSyle from "./CourseDetails.module.css";
import { Course } from "@/types/databaseTypes";
import ModuleClassname from "@/lib/cssUtil";
import { useColorContext } from "@/context/colorScheme";
import Button from "@/components/buttons/NewButton";
import { useEnrolledCourses } from "../../Hooks";
import { Suspense, use, useEffect, useMemo, useState } from "react";
import React from "react";
import { ParseHtml, ParseMarkdown } from "@/lib/htmlParser";
import LoadingAnimation from "@/components/loading/LoadingAnimation";
import { appColors } from "@/lib/color/appColors";
import HideIf from "@/components/HideIf";
import Image, { StaticImageData } from "next/image";
import { getThumbnail } from "@/images/course/thumbnails/getThumbnail";

type DefaultThumbnail = {
    image: StaticImageData,
    dominantColor: string
}
type Props = {
    CourseDetailsPage:{
        coursePromise: Promise<"NOT-VERIFIED"|Course|undefined>,
        defaultThumbnail: DefaultThumbnail
        refetchPromise?: Promise<()=>Promise<void>>
    },
    MainPage: {
        course: Course,
        defaultThumbnail: DefaultThumbnail
    }
    
}
export default function CourseDetailsPage({
    coursePromise, defaultThumbnail
}:Props['CourseDetailsPage']) {

    /* ||||||||||||||||||| Course Data |||||||||||||||||||*/
    const course = use(coursePromise);

        /* If NOT VERIFIED */
    if(course==='NOT-VERIFIED') return <NotVerified/>

        /* If no course if found */
    if(course===undefined) return <CourseUnavailable/>

    return <MainPage
        course={course} defaultThumbnail={defaultThumbnail}
    />
}

/* ||||||||||||||||||||   Main Page  |||||||||||||||||||| */
const EnrollButton = ({courseId, isEnrolled, price}:{
    courseId: string, isEnrolled: boolean, price?:Course['price']
})=>{
    const {effectiveTheme} = useColorContext();
    const color = {
        bg: isEnrolled?
            appColors.violet[effectiveTheme][1]:
            appColors.teal[effectiveTheme][1]
    }
    return <>
    <Button // Enroll/Go-to-course Button
        style={{
            color:"rgba(255, 255, 255, 0.8)",
            borderRadius:"10px",
            margin:"0 auto 10px 2px",
            backgroundColor: color.bg
        }}
        href={isEnrolled?`/course/${courseId}`:`${courseId}/enroll`}
    >{
        isEnrolled?"Go to course"
        :price?.cost?`Purchase: ${price.cost} Rupees`:"Enroll"
    }</Button>
    </>
}
const MainPage = ({course, defaultThumbnail}:Props['MainPage']) => {

    const css = new ModuleClassname(moduleSyle);
    const { effectiveTheme } = useColorContext();

    const enrolledCourses = useEnrolledCourses();

    const [isEnrolled, setIsEnrolled] = useState(()=> {
        // Has to be initialized with false
        // To avoid hydration error
        return false
    });
    useEffect(()=>{
        setIsEnrolled(!!enrolledCourses.findCourse(course.courseId))
    },[enrolledCourses.data]);

        /* Getting */
    const courseRating = {
        rating: Number((course.rating.rateCount!/course.rating.userCount!).toFixed(1)),
        rateCount: course.rating.rateCount,
        userCount: course.rating.userCount,
    };
    
    const colors = {
        light: "rgba(56, 55, 129, 1)",
        dark: "rgba(143, 141, 228, 1)",
    }

    const thumbnail = useMemo(()=>{
        if (course.images?.thumbnail?.url){
            return {
                url: course.images.thumbnail.url,
                dominantColor: course.images.thumbnail.dominantColor
            }
        }
        return {
            url: defaultThumbnail.image.src,
            dominantColor: defaultThumbnail.dominantColor
        }
    },[course.images?.thumbnail?.url]);

    const coverImageStyle:React.CSSProperties = {

        backgroundColor: course.images?.cover?.dominantColor||'',
        //backgroundImage: `linear-gradient(30deg, rgb(0,0,0), rgb(0,0,0))`,
        backgroundImage: course.images?.cover?.url?
            `url(${course.images.cover.url})`:'',
    }
    return <>
    <div style={{position:'relative'}}>
        <div className={css.names(`cover-image ${effectiveTheme}`)}
            style={coverImageStyle}
        />
        <Image src={thumbnail.url}
            className={moduleSyle['thumbnail']}
            alt={course.courseName||"Thumbnail"}
            width={140} height={140} style={{
                aspectRatio:'1/1', position:'absolute',
                borderRadius:'50%', bottom:'2vh', left:'20px',
                boxShadow:"0 2px 10px -4px rgba(0, 0, 0, 0.4)",
                border:`7px solid ${thumbnail.dominantColor}`
            }}
        />
        {/* <HideIf hideIf={!course.images?.thumbnail?.url}>
            
        </HideIf> */}
    </div>
    
    <Block>
        <Heading>{course?.courseName}</Heading>

        <div style={{margin:"0 0 0 auto", lineHeight:'2rem'}}>
            {!isNaN(courseRating.rating)?
                `${courseRating.rating}⭐ (${courseRating.userCount})`:
                "Unrated ⭐"
            }
        </div>
    </Block>

    <Block margin={'20px 0'} gap={"20px"}
        className='split'
    >
        <div className={moduleSyle['description']}>
            <EnrollButton
                courseId={course.courseId}
                isEnrolled={!!isEnrolled}
                price={course.price}
            />
            {/* <Button>{isEnrolled?"enrolled":"not enrolled"}</Button> */}
            
            <br/>
            
            <div className={moduleSyle['html-content']}>
                <Description // Description Blocks to HTML
                    description={course?.description}
                />
            </div>
            
            
            <div className={moduleSyle['skills-field']}>{
                course?.skills.map((skill, index) => {
                return <h4 key={index}
                    style={{
                        border:`2px solid ${colors[effectiveTheme]}`,
                        color: colors[effectiveTheme]
                    }}
                >
                    {skill}
                </h4>
            })}</div>
            
            <RatingBlock style={{margin:"0 auto", alignSelf:'center'}}/>
        </div>

        <div className={moduleSyle['modules']}>
            <Heading style={{fontSize:'1.1rem'}}>Modules</Heading>
            {course?.modules.map((module,index)=>{
                return <div key={index}>
                    {index+1}: {module.title}
                </div>
            })
        }</div>
    </Block>
    </>;
}
/* ||||||||||||||||||||   NOT-VERIFIED  |||||||||||||||||||| */

const NotVerified = ()=>{
    return <>
        <Heading style={{
            margin:'10vh auto 10px auto'
        }}>Not Verified.</Heading>
        <p style={{margin:'0 auto'}}>
            Make sure you are signed in.
        </p>
        <h1 style={{margin:'20px auto'}}>😒</h1>
    </> 
}
/* |||||||||||||||||||| No Course Found |||||||||||||||||||| */

const CourseUnavailable = ()=>{
    return <>
        <Heading style={{
            margin:'10vh auto 10px auto'
        }}>Course not found.</Heading>
        <p style={{margin:'0 auto'}}>
            You sure this is a course❓
        </p>
        <h1 style={{margin:'20px auto'}}>❓🤔❓</h1>
    </> 
}
const Description = ({description}:{
    description: Course['description']|undefined
})=>{
    if (!description) return null;
    return description.map((block, index)=>{
        switch (block.type){
            case "markdown":
                return <ParseMarkdown key={index} content={block.content}/>
            case "html":
                return <ParseHtml key={index} content={block.content}/>
            case "video-iframe":
                return <ParseHtml key={index} content={block.content}/>
        }
    })
}
const Block =({children, className, ...styles}: React.CSSProperties &{
    children?: React.ReactNode,
    className?: string
})=>{
    const css= new ModuleClassname(moduleSyle);
    return <>
    <div 
        style={{...styles}}
        className={css.names(`block ${className}`)}
    >
        {children}
    </div>
    </>
}

const RatingBlock = ({style}:{style?: React.CSSProperties})=>{
    return <>
    <Heading style={{margin:"20px 0"}}>Rate the course</Heading>
    <Ratings width={"30%"}height={"40px"} style={style}/>
    </>
}
const Ratings = ({width,height, style}:{
    width?: string|number,
    height?: string|number,
    style?: React.CSSProperties
}) => {
    const [hovered, setHovered] = useState<boolean>(false);
    const [fixed, setFixed] = useState<boolean>(false);
    const [rating, setRating] = useState<number>(0);
    const getColor = (starNumber: number)=>{
        return rating >= starNumber? "rgba(230, 195, 0, 1)":"rgba(87, 87, 87, 1)"
    }
    const onMouseEnter = (starNum: number)=> (e:React.MouseEvent<SVGPathElement>)=>{
        !fixed && setRating(starNum);
    }
    const onMouseLeave = (starNumber: number)=> (e: React.MouseEvent<SVGPathElement>)=> {
        if(fixed) return;
        if (hovered) setRating(starNumber);
        else setRating(0);
    }
    const onClick = (starNumber: number)=> ()=>{
        setFixed(true);
        
        !fixed && setRating(starNumber)
    }
    return <>
    <svg
    //width={width||70} height={height||10}
    viewBox="0 0 70 10"
    className={moduleSyle['rating-block']}
    style={style}
    onMouseEnter={()=> setHovered(true)} onMouseLeave={()=>{
        !fixed && setRating(0)
        setHovered(false)
    }}
    >
        <path onClick={onClick(1)}
        onMouseEnter={onMouseEnter(1)} onMouseLeave={onMouseLeave(1)}
        d="M8.785 9.497c-.594.431-2.115-1.109-2.848-1.108-.734 0-2.253 1.541-2.847 1.11-.593-.43.4-2.353.174-3.05-.227-.698-2.162-1.667-1.936-2.364.226-.698 2.362-.346 2.955-.778.593-.431.917-2.571 1.65-2.572.734 0 1.06 2.14 1.653 2.57.593.431 2.729.078 2.956.775.227.698-1.708 1.669-1.934 2.366-.226.698.77 2.62.177 3.05Z"
        fill= {getColor(1)}
        transform="translate(5.065 -.155)"
        />
        <path onClick={onClick(2)}
        onMouseEnter={onMouseEnter(2)} onMouseLeave={onMouseLeave(2)}
        d="M8.785 9.497c-.594.431-2.115-1.109-2.848-1.108-.734 0-2.253 1.541-2.847 1.11-.593-.43.4-2.353.174-3.05-.227-.698-2.162-1.667-1.936-2.364.226-.698 2.362-.346 2.955-.778.593-.431.917-2.571 1.65-2.572.734 0 1.06 2.14 1.653 2.57.593.431 2.729.078 2.956.775.227.698-1.708 1.669-1.934 2.366-.226.698.77 2.62.177 3.05Z"
        fill= {getColor(2)}
        transform="translate(17.065 -.155)"
        />
        <path onClick={onClick(3)}
        onMouseEnter={onMouseEnter(3)} onMouseLeave={onMouseLeave(3)}
        d="M8.785 9.497c-.594.431-2.115-1.109-2.848-1.108-.734 0-2.253 1.541-2.847 1.11-.593-.43.4-2.353.174-3.05-.227-.698-2.162-1.667-1.936-2.364.226-.698 2.362-.346 2.955-.778.593-.431.917-2.571 1.65-2.572.734 0 1.06 2.14 1.653 2.57.593.431 2.729.078 2.956.775.227.698-1.708 1.669-1.934 2.366-.226.698.77 2.62.177 3.05Z"
        fill={getColor(3)}
        transform="translate(29.065 -.155)"
        />
        <path onClick={onClick(4)}
        onMouseEnter={onMouseEnter(4)} onMouseLeave={onMouseLeave(4)}
        d="M8.785 9.497c-.594.431-2.115-1.109-2.848-1.108-.734 0-2.253 1.541-2.847 1.11-.593-.43.4-2.353.174-3.05-.227-.698-2.162-1.667-1.936-2.364.226-.698 2.362-.346 2.955-.778.593-.431.917-2.571 1.65-2.572.734 0 1.06 2.14 1.653 2.57.593.431 2.729.078 2.956.775.227.698-1.708 1.669-1.934 2.366-.226.698.77 2.62.177 3.05Z"
        fill={getColor(4)}
        transform="translate(41.065 -.155)"
        />
        <path onClick={onClick(5)}
        onMouseEnter={onMouseEnter(5)} onMouseLeave={onMouseLeave(5)}
        d="M8.785 9.497c-.594.431-2.115-1.109-2.848-1.108-.734 0-2.253 1.541-2.847 1.11-.593-.43.4-2.353.174-3.05-.227-.698-2.162-1.667-1.936-2.364.226-.698 2.362-.346 2.955-.778.593-.431.917-2.571 1.65-2.572.734 0 1.06 2.14 1.653 2.57.593.431 2.729.078 2.956.775.227.698-1.708 1.669-1.934 2.366-.226.698.77 2.62.177 3.05Z"
        fill={getColor(5)}
        transform="translate(53.065 -.155)"
        />
    </svg>
    </>
}

export const DescriptionPageLoading = ()=>{
    const {effectiveTheme} = useColorContext();

    const color = {
        light: "rgba(87, 89, 209, 1)",
        dark: "rgba(135, 126, 255, 1)"
    }
    return <>
    <div className={moduleSyle['loading']}>
        <LoadingAnimation
            style={{margin:'20vh auto 0 auto'}}
            circlesFill={color[effectiveTheme]}
            width="clamp(100px, 13%, 300px)"
        />
        <h2 style={{margin:"30px auto 0 auto"}}>
            Taking longer than usual!
        </h2>
    </div>
    
    </>
}