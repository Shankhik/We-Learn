import { status } from "@/types/statusType";
import { mongoServer } from "./mongoServer";
import { CourseHistory, EnrolledCourses } from "@/types/databaseTypes";
import { Collection, UpdateResult} from "mongodb";

export const checkCourseHistoryDoc = async (username: string, courseId: string): Promise<status>=>{
    //let message = `Found ${username}'s ${courseId} history!`;
    //const date = new Date();
    try {
        const db = mongoServer.db('E-Learning');
        const coll = db.collection('courseHistory') as Collection<CourseHistory>;
        
        const userDocument = await coll.findOne({username: username}) as CourseHistory|null
        
        //document not found
        if (userDocument===null){ 
            return {
                status: false,
                message: `${username}'s document NOT found`
            }
        }
        //document found
        else{ 
            return {
                status: true,
                message: `${username} document found`
            }
        }
        
    } catch (error:any) {
        return {
            status: false,
            error: `Error: ${error.message}`
        }
    }
}
export const findEnrolledCourse = async (username: string, courseId: string): Promise<status> =>{
    try {
        const db = mongoServer.db('E-Learning');
        const coll = db.collection('courseHistory') as Collection<CourseHistory>;
        const documentWithCourse = await coll.findOne({username: username, 'courses.courseId': courseId}) as CourseHistory|null;
        if (documentWithCourse!==null){
            let enrolled = documentWithCourse.courses.find(course=> course.courseId === courseId);
            return {
                status: true,
                message: `${courseId} history found`,
                courseHistory: enrolled
            }
        }
        else{
            return {
                status: false,
                message: `${courseId} history NOT found`
            }
        }
    } catch (error:any) {
        return{
            status: false,
            error: `Error: ${error.message}`
        }
    }
}
export const addEnrolledCourse = async (username:string, courseId: string):Promise<status> => {
    try {
        const date = new Date()
        const db = mongoServer.db('E-Learning');
        const coll = db.collection('courseHistory') as Collection<CourseHistory>;
        let data:EnrolledCourses ={
            courseId: courseId,
            enrollmentDate: date, 
            completedUpto: 0,
            completionDate: null,
            lastLoaded: date
        }
        const log = await coll.updateOne({username: username},{
            $push: {courses: data}
        })
        return {
            status: true,
            message: `Added ${courseId} history!`,
            courseHistory: data
        }
    } catch (error:any) {
        return{
            status: false,
            error: `Error: ${error.message}`
        }
    }
}
export const createNewUserHistory = async (username: string):Promise<status> => {
    try{
        const db = mongoServer.db('E-Learning');
        const coll = db.collection('courseHistory') as Collection<CourseHistory>;
        if (username){
            let data:CourseHistory = {
                username: username,
                courses: []
            }
            const ack = await coll.insertOne(data)
            if (ack.acknowledged){
                return {
                    status: true,
                    message: `${username}'s course history created!`,
                    documentId: ack.insertedId
                }
            }else{
                return {
                    status: false,
                    message: `Couldnt add new user course history!`,
                }
            }
            
        }else{
            return {
                status: false,
                message: `Username is not defined`
            }
        }
        
    }catch(error: any){
        return{
            status: false,
            error: `Error: ${error.message}`
        }
    }
}
export const incCompletedUpto = async (username: string, courseId: string): Promise<status>=>{
    try {
        const db = mongoServer.db('E-Learning');
        const coll = db.collection('courseHistory') as Collection<CourseHistory>;

        await coll.updateOne({username: username, "courses.courseId": courseId},
            {
                $inc : { "courses.$.completedUpto": 1} //$: to find the correct array element
            }
        );

        return {
            status: true,
            message: `Marked as Read!`
        }
    } catch (error:any) {
        return {
            status: false,
            error: `Error: ${error.message}`
        }
    }
}

export const updateLastLoaded = async (username: string, courseId: string):Promise<status> =>{
    try {
        const db = mongoServer.db('E-Learning');
        const coll = db.collection('courseHistory') as Collection<CourseHistory>;

        const date = new Date()
        const res = await coll.updateOne({username: username, 'courses.courseId':courseId},
            {
                $set: {'courses.$.lastLoaded': date}
            }
        );
        if(res.acknowledged){
            return {
                status: true,
                message: `lastLoaded: Today at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
            }
        }
        else{
            return {
                status: false,
                message: `Couldnt update last loaded!`
            }
        }
    } catch (error:any) {
        return {
            status: false,
            error: `Error: ${error.message}`
        }
    }
}
export const completeCourse = async (username: string, courseId: string): Promise<status> => {
    const date = new Date()
    try {
        const db = mongoServer.db('E-Learning');
        const coll = db.collection('courseHistory') as Collection<CourseHistory>;

        let ack = await coll.updateOne({username: username,'courses.courseId':courseId},{
            $set:{
                'courses.$.completionDate': date
            }
        })
        if (ack.acknowledged){
            return {
                status: true,
                message: `Set as Completed (${date.getDate()}/${date.getMonth()}/${date.getFullYear()})`
            }
        }else{
            return{
                status: false,
                message: `Couldnt set completion date!`
            }
        }
    } catch (error:any) {
        return{
            status: false,
            error: `Error: ${error.message}`
        }
    }
}