import { Course } from "@/types/databaseTypes";
import { mongoServer } from "./mongoServer";
import { status } from "@/types/statusType";

type CourseShort = {
    courseId: string;
    courseName?: string;
}
export const findCourse = async(courseQuery:CourseShort): Promise<status> => {
    try{
        const db = mongoServer.db('E-Learning');
        const courses = db.collection('courses');
        const oneCourse = await courses.findOne(courseQuery) as Course;

        if(oneCourse!==null){
            return {
                status: true,
                message: `Course (${courseQuery.courseId}) found!`,
                course: oneCourse
            }
        }else {
            return {
                status: false,
                message: `Course (${courseQuery.courseId}) NOT found!`,
            }
        }
    }catch(error:any){
        return {
            status: false,
            error: `Error: ${error.message}`,
        }
    }
}
export const findAllCourses = async (options?:{
    skip?: number, limit?: number
}):Promise<status>=>{

    // console.log("skip:", options?.skip)
    // console.log("limit:", options?.limit)
    try{
        const db = mongoServer.db('E-Learning');
        const courses = db.collection('courses');

        const collectionLength = await courses.countDocuments({});
        const allCourses = await courses.find({})
        .skip(options?.skip || 0)
        .limit(options?.limit || 20)
        .toArray() as Course[]
        
        const moreAvailable = collectionLength > (options?.skip||0)+allCourses.length
        if(allCourses.length!==0){
            return {
                status: true,
                message: `All Courses:`,
                courses: allCourses,
                moreAvailable: moreAvailable
            }
        }else {
            return {
                status: false,
                message: `No courses available`,
                moreAvailable: moreAvailable
            }
        }
    }catch(error:any){
        return {
            status: false,
            error: `Error: ${error.message}`,
        }
    }
}
export const addCourse = async(courseObject: Course):Promise<status> => {
    try {
        const db = mongoServer.db('E-Learning');
        const courses = db.collection('courses');
        const oneCourse = await findCourse(courseObject);

        if(!oneCourse.course){
            await courses.insertOne(courseObject);
            return {
                status: true,
                message: `Course (${courseObject.courseId}) added!`
            }
        }else{
            return {
                status: false,
                message: `Course (${courseObject.courseId}) Already exists!`
            }
        }

    } catch (error:any) {
        return {
            status: false,
            error: `Error: ${error.message}`
        }
    }
}