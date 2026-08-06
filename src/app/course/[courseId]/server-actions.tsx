"use server";

import { verifyToken } from "@/lib/jwt";
import { getOneCourse, getOneCourseField } from "@/mongoDB/serverActions/courses";
import { getTrackRecord } from "@/mongoDB/userTrack";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import { cache as reactCache } from "react";

// Verifies user AuthToken
export const verifyUser = reactCache(async ()=> {
    const token = (await cookies()).get('AUTH_TOKEN')?.value
    if (!token) return undefined;
    const user = await verifyToken(token);
    return user.decoded?.username;
})

// Gets courseName from courseId
export const getCourseName = reactCache(async (courseId: string)=>{
    const getName = unstable_cache(async ()=>{
        const course = await getOneCourseField(courseId,'courseName');
        if (course.data?.courseName){
            //console.log(`Fetched: courseName of ${courseId}`)
            return course.data.courseName
        }
        //console.log(`Course ${courseId||"UNKNOWN"} not found`)
        return undefined;
    },["generated-metadata","course-name",courseId||"unknown"],{
        revalidate: 600, // 10 mins
        tags: ["generated-metadata", courseId||"unknown"]
    });
    return await getName()
})

// Gets Course <module.title>[]
export const getModuleTitles = reactCache(async (courseId: string)=>{
    // Used Cached Course
    const {data, error} = await getOneCourse({courseId},{projection:{
        _id: 0, "modules.title": 1
    }},{key:"include:modules-title", time: 60*20});

    if (!data || error ||!data.modules) return undefined;
    return data.modules.map(module=> module.title);
})

// Gets User's Course Track Record
export const getUserCourseTrack = reactCache(async (
    username: string|undefined,
    courseId: string|undefined,
)=> {
    if(!username)
        return null;
    try {
        const track = await getTrackRecord(username,{
            enrolled: 1, username: 1
        });
        // Finds enrolled course with courseId
        const courseTrack = track.enrolled
        .filter( course => course.courseId === courseId)
        .at(0)|| null;

        return courseTrack
    } catch (error:any) {
        return null
    }
})

// Gets Course' module[n]
export const getCourseModule = reactCache(async (courseId: string, moduleNumber: number)=>{

    // Getting cached course
    const course = await getOneCourse({courseId},{
        projection:{
            _id:0, "modules":1
        }
    },{
        key: "include:modules", time: 3600
    });
    // If not course is found
    if (!course.data ||course.error) return null;

    // If moduleNumber is out of range
    const modulesLength = course.data.modules.length||0
    if(moduleNumber<1 || moduleNumber> modulesLength)
        return null;

    const module = course.data.modules.at(moduleNumber-1);
    // Getting certain course module
    return module? {...module, modulesLength}: null;
})