import { mongoCollection } from "./operations";
import { ApiError } from "@/lib/serverUtils/apiError";
import { Document } from "mongodb";

export const createTrack = async (username: string) => {
    try {
        const collection = mongoCollection('UserTracks')?.collection!
        
        const res = await collection.insertOne({
            username,
            likedCourses: [],
            enrolled: [],
        })

        if (res.acknowledged) return res;
        
        throw new Error ("Couldn't create Track Record");

    } catch (error:any) {
        throw error;
    }
}

export const enroll = async (
    username: string|undefined, courseId: string|undefined
) => {
    
    if (!username||!courseId) throw new ApiError("courseId is not a string",{
        httpCode: 400
    });
    const coll = {
        userTrack: mongoCollection('UserTracks')?.collection!,
        courses: mongoCollection("Courses")?.collection!,
    }
    
    const userDoc = await coll.userTrack.countDocuments({
        username
    })

    // If collection doesn't already exists
    // -> Creates an user track document first
    if (userDoc<=0) {
        await createTrack(username);
    }

    // If the course doesn't exists
    if (await coll.courses.countDocuments({courseId})===0)
        throw new ApiError("Course doesn't exist",{
            httpCode: 404 // not found
    });

    // Checks if already enrolled
    if (await coll.userTrack.countDocuments({
        username,
        "enrolled.courseId": courseId
    })>0 ){
        throw new ApiError("Already enrolled!",{
            httpCode: 409 // Conflict
        });}
    
    // Enrolls the course
    return await coll.userTrack.updateOne({username},{
        $push:{
            enrolled: {
                courseId,
                completedUpto: 0,
                enrollmentDate: new Date()
            }
        }
    })
}
export const getTrackRecord = async (username: string, projection?: Document)=>{
    const collection = mongoCollection('UserTracks')?.collection!;
    const trackRecord = await collection.findOne({
        username
    },{
        projection:{
            _id:0,
            ...projection
        }
    })
    if(!trackRecord) throw new ApiError("Track Record not found!",{
        httpCode: 404 // not found
    });
    return trackRecord;
}

export const rate = async (
    username: string,
    courseId: string,
    rate: number
)=>{
    try {
        const collections = {
            userTrack: mongoCollection('UserTracks')?.collection!,
            courses: mongoCollection('Courses')?.collection!
        }

        // Getting user track record first
        const record = await collections.userTrack.findOne({
            username: username,
        },{
            projection:{
                "enrolled.courseId": 1,
                "enrolled.rating": 1,
            }
        })

        // If track record is not found
        if(!record) throw new Error("Track Record not found!");

        // Finding course in enrolled courses
        const enrolledCourseTrack = record.enrolled
        .find(course=> course.courseId === courseId);
        
        // If course is not enrolled in
        if (!enrolledCourseTrack)
            throw new Error("Can't rate an unenrolled course");

        const incOrDec = {
            // effective inc/dec
            rateCount: enrolledCourseTrack.rating?
                rate - enrolledCourseTrack.rating: rate,
            userCount: enrolledCourseTrack.rating?
                0:1
        }
        // If the course to rate is not found
        if (await collections.courses.countDocuments({courseId})===0)
            throw new Error(`Course [${courseId}] to rate not found`);

        // Updates course's rating
        const courseRatingUpdate = await collections.courses.updateOne({
            courseId
        },{
            $inc:{
                "rating.rateCount": incOrDec.rateCount,
                "rating.userCount": incOrDec.userCount
            }
        })

        // If course rating updation fails
        if(!courseRatingUpdate.acknowledged)
            throw new Error("Couldn't rate");

        // Updating user track record
        return await collections.userTrack.updateOne({
            username,
            "enrolled.courseId": courseId
        },{
            $set:{
                "enrolled.$.rating": rate
            }
        })

    } catch (error:any) {
        throw error
    }
    
}