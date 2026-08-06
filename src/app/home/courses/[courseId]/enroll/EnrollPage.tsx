"use client";

import { Heading, Hr } from "@/components/htmlElements/Texts";
import { Course } from "@/types/databaseTypes";
import moduleStyle from "./page.module.css";
import { use } from "react";
import LoadingAnimation from "@/components/loading/LoadingAnimation";
import { useColorContext } from "@/context/colorScheme";
import Button from "@/components/buttons/NewButton";
import { appfetch } from "@/lib/fetchReq";
import { useQueryClient } from "@tanstack/react-query";
import { queryDetails } from "@/app/home/Hooks";
import { useRouter } from "next/navigation";
import { useNotification } from "@/context/notification";

const colors = {
    light: ['rgba(41, 143, 104, 1)','rgba(202, 64, 82, 1)','rgba(98, 99, 204, 1)','rgb(0,0,0)'],
    dark: ['rgba(32, 134, 92, 1)','rgba(248, 85, 107, 1)','rgba(105, 112, 211, 1)','rgb(0,0,0)']
}
export default function EnrollPage ({coursePromise}:{
    coursePromise: Promise<"NOT-VERIFIED"|undefined|Course>
}){
    const course = use(coursePromise);
    const qClient = useQueryClient();
    const {replace} = useRouter();
    const {pushNotification} = useNotification()
    
    // const {effectiveTheme} = useColorContext();
    if (!course) return <>
        <div className={moduleStyle['details-block']}>
            <Heading>Bad Request</Heading>
        </div>
    </>
    else if (course==='NOT-VERIFIED') return <>
        <div className={moduleStyle['details-block']}>
            <Heading>Not Verified</Heading>
        </div>
    </>
    
    const priceString = course.price?.cost?`Rs. ${course.price.cost}`: "Free"
    const buttonMessage = course.price?.cost?
        <>Proceed to <strong>PURCHASE</strong></>:
        <>Get it for <strong>FREE</strong></>;
    
    const proceedPurchase = async ()=>{

        const res = await appfetch<Status,any>("/api/user/enroll",{
            courseId: course.courseId
        });
        if (!res || !res.status){
            // alert(res.error||res.message)
            pushNotification(res?.error||res?.message||"Enrollement Failed",{
                color:'red'
            });
            return;
        };
        qClient.refetchQueries({
            queryKey: queryDetails.enrolledCourses.queryKey
        });
        // qClient.invalidateQueries({
        //     queryKey: queryDetails.enrolledCourses.queryKey
        // });
        replace(`/home/courses/${course.courseId}`);
    }
    return <>
    <div className={moduleStyle['details-block']}>
        <Heading style={{margin:'0 auto 15px auto'}}>Enroll</Heading>
        <p><strong>Course name:</strong> {course.courseName}</p>
        <p><strong>Price: </strong> {priceString}</p>
        <Hr style={{margin:"14px 0"}}/>
        <p><strong>Date: </strong>{new Date().toDateString()}</p>

        <div style={{margin:"30px 0 0 0"}}>
            <LocalButton colorIndex={course.price?.cost?0:2}
            onClick={proceedPurchase}>
                {buttonMessage}
            </LocalButton>
        </div>
    </div>
    </>
}
const LocalButton = ({children, colorIndex, onClick}:{
    children: React.ReactNode,
    colorIndex?: number,
    onClick?: ()=>Promise<any>|any
})=>{
    const {effectiveTheme} = useColorContext();
    return <>
    <Button style={{
        borderRadius:'10px',
        color: colorIndex===0||colorIndex?"rgba(255, 255, 255, 0.9)":'',
        backgroundColor: colors[effectiveTheme][colorIndex===0?colorIndex:colorIndex||10]??''
    }} hoverStyle={{
        boxShadow:'none'
    }} showLoading onClick={onClick}
    >{children}</Button>
    </>
}
export const Wait = ()=>{
    const {effectiveTheme} = useColorContext();
    const color = {
        light: "rgba(82, 70, 189, 1)",
        dark: "rgba(113, 123, 255, 1)"
    }
    return <>
    <div className={moduleStyle['details-block']}>
        <LoadingAnimation
            style={{margin:'0 auto 0 auto'}}
            circlesFill={color[effectiveTheme]}
            width="clamp(70px, 10%, 300px)"
        />
    </div>
    
    </>
}