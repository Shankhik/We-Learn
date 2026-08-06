import { Course } from "@/types/databaseTypes";
// import { mongoServer } from "./mongoServer";
import { WithId } from "mongodb";
import { mongoCollection } from "./operations";

type CourseShort = {
    courseId: string;
    courseName?: string;
}
export const findCourse = async(courseQuery:CourseShort): Promise<Status> => {
    try{
        // const db = mongoServer.db('E-Learning');
        // const courses = db.collection<Course>('courses');
        const courses = mongoCollection("Courses")?.collection!
        
        const oneCourse = await courses.findOne(courseQuery);

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
}):Promise<Status>=>{

    // console.log("skip:", options?.skip)
    // console.log("limit:", options?.limit)
    try{
        // const db = mongoServer.db('E-Learning');
        // const courses = db.collection('courses');
        const courses = mongoCollection("Courses")?.collection!;

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
export const addCourse = async(courseObject: Course):Promise<Status> => {
    try {
        // const db = mongoServer.db('E-Learning');
        // const courses = db.collection('courses');
        const courses = mongoCollection("Courses")?.collection!;

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

/**
 * @param findOne - whether to find one course or multiple
 * @param filter - filter to find courses 
 * @param projection - projection of fields to include or exclude
 * @returns 'status' type with courses array
 */
export const findCourses = async(
    findOne: boolean,
    filter: Partial<Course>,
    projection?: Partial<{[key in keyof Course]: 0|1}>,
    options?: {
        skip?: number,
        limit?: number
    }
    //projection?: Partial<Record<keyof PropSelective, 0|1>>
):Promise<Status>=>{

    // Response variable [for multiple or single course]
    let res:WithId<Course>[]|WithId<Course>|null = null;
    
    try{
        // const db = mongoServer.db('E-Learning');
        // const courses = db.collection<Course>('courses');
        const courses = mongoCollection("Courses")?.collection!;
        
        // Gets Total collection length
        const collectionLength = await courses.countDocuments({});

        if(findOne){
            res = await courses.findOne(filter,{
                projection,
            })
        }else{ // For finding array of courses
            res = await courses.find(filter,{
                projection,
                skip: options?.skip || 0,
                limit: options?.limit || 20
            }).toArray();
        }
        // Getting the documents
        

        if (res===null || // res is null (for findOne)
        // res is an empty array
        (Array.isArray(res) && res.length===0)) return{
            status: true,
            message: `No course${findOne?"":'s'} found!`,
        }

        return {
            status: true,
            message: `Courses found!`,

            // We return either single course or undefined
            ...(findOne? {
                course: res as WithId<Course>
            }: {
                courses: res as WithId<Course>[],
                moreAvailable: (res as []).length > collectionLength
            })
            // If length exceeds limit, moreAvailable is true
            
        }
    }catch(error:any){
        return {
            status: false,
            error: `Error: ${error.message}`,
        }
    }
}