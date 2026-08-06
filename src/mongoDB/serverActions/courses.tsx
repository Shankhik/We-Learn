"use server";

import { Abortable, Filter, FindOneOptions, FindOptions } from "mongodb";
import { mongoCollection } from "../operations";
import { Course } from "@/types/databaseTypes";
import { ApiError } from "@/lib/serverUtils/apiError";
import { unstable_cache } from "next/cache";
import serverLog from "@/lib/serverUtils/log";

type CourseFields = Exclude<keyof Course, "_id"> | "modules-title"| "modules-blocks"
type Props = {
    type: "full"|`exclude:${CourseFields}`|`include:${CourseFields}`,
}

type TagName = `${string}:${Props['type']}`;
type NonEmptyString = `${string}${string}`;

export async function getAllCourses (
    filter?: Filter<Course>,
    options?: FindOptions & Abortable
):Promise<{
    data: Course[]|undefined,
    error: ApiError|undefined
}>{
    try {
        const coll = mongoCollection('Courses')?.collection!
        const data = await coll.find({...filter},options).toArray();
        return {
            data: data as Course[],
            error: undefined
        };
    } catch (error:any) {
        return {
            data: undefined,
            error: error as ApiError
        }
    }
}

export async function getOneCourse (
    filter: Filter<Course> & {courseId: string},
    options: Omit<FindOneOptions, "timeoutMode"|"projection"> & Abortable,
    useCache: {
        key: "full",
        time: number
    }
):Promise<{
    data: Course|null|undefined,
    error: ApiError|undefined
}>;

export async function getOneCourse (
    filter: Filter<Course> & {courseId: string},
    options: Omit<FindOneOptions, "timeoutMode"> & Abortable,
    useCache: {
        key: Exclude<Props['type'],"full">,
        time: number
    }
):Promise<{
    data: Course|null|undefined,
    error: ApiError|undefined
}>;

export async function getOneCourse (
    filter: Filter<Course>,
    options?: Omit<FindOneOptions, "timeoutMode"> & Abortable,
    useCache?: {
        key: Exclude<Props['type'],"full">,
        time: number
    }
):Promise<{
    data: Course|null|undefined,
    error: ApiError|undefined
}>;

export async function getOneCourse(
    filter: Filter<Course>,
    options?: Omit<FindOneOptions, "timeoutMode"> & Abortable,
    useCache?: {
        key: Props['type'],
        time: number
    }
){
    const getCourse = async(option: typeof options)=>{
        try {
            const coll = mongoCollection('Courses')?.collection!
            const data = await coll.findOne({...filter},option)
            if (data===undefined)
                throw new ApiError("Couldn't get course");
            return {
                data: data,
                error: undefined
            }
        } catch (error:any) {
            return {
                data: undefined,
                error: error as ApiError
            }
        }
    }

    const tag = `${filter.courseId||"unknown"}:${useCache?.key!}` satisfies TagName
    const cached = unstable_cache(async()=>{
        const {data, error} = await getCourse(options);
        if( data ){
            serverLog("success","we-learn",null,
            `cached <${filter.courseId}> | tag <${tag}>`);
        }
        return {data, error}
    },[
        'course-cache',
        tag
    ],{
        revalidate: useCache?.time||0,
        tags: ['server-cache',tag]
    })
    
    if (useCache?.key && useCache.time)
        return cached();
    return getCourse(options);
}

export async function getOneCourseField(courseId: string, field: keyof Course): Promise<{
    data: Course|undefined,
    error: ApiError|undefined
}> {
    try {
        const coll = mongoCollection('Courses')?.collection!
        const data = await coll.findOne({courseId},{
            projection: {
                [field] : 1, _id: 0
            }
        });
        if (!data)
            throw new ApiError("Couldn't get course");
        return {
            data: data,
            error: undefined
        }
    } catch (error:any) {
        return {
            data: undefined,
            error: error as ApiError
        }
    }
}

// Gets only the module titles of a Course
export async function getAllModules(courseId: string):Promise<{
    data: Course['modules']|undefined,
    error: ApiError|undefined
}> {
    try {
        const coll = mongoCollection('Courses')?.collection!
        const data = await coll.findOne({courseId},{
            projection: {
                _id: 0, "modules.title":1
            }
        });
        if (!data)
            throw new ApiError("Couldn't get course");
        return {
            data: data.modules,
            error: undefined
        }
    } catch (error:any) {
        return {
            data: undefined,
            error: error as ApiError
        }
    }
}