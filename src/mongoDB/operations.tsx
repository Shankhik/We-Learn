import { Changelog, Course, OTPs, User, UserTrack } from "@/types/databaseTypes";
import { mongoServer } from "./mongoServer"
import { Abortable, Filter, FindOptions, InsertOneOptions, OptionalUnlessRequiredId, WithId } from "mongodb";

export type Collections = {
    Users: User,
    Otps: OTPs,
    Courses: Course,
    UserTracks: UserTrack,
    Changelogs: Changelog
}
export const mongoCollection = <K extends keyof Collections>(collection: K)=>{
    try{
        const db = mongoServer.db("E-Learning");
        const col = db.collection<Collections[K]>(collection);
        
        return {
            // Actual DB collection
            collection: col,

            // For inserting one document
            insertOne: async (
                document: OptionalUnlessRequiredId<Collections[K]>,
                options?: InsertOneOptions
            ): Promise<Status> =>{
                try {
                    const res = await col.insertOne(document,options);
                    if (!res.acknowledged) throw new Error(`Couldn't insert document in '${collection}'`);
                    return {
                        status: true,
                        message: `Document inserted in '${collection}'`,
                        documentId: res.insertedId
                    }
                } catch (error:any) {
                    return {
                        status: false,
                        error: error.message
                    }
                }
            },

            // For finding one document
            findOne: async (
                filter: Filter<Collections[typeof collection]>,
                options?: Omit<FindOptions,"timeoutMode"> & Abortable
            ):Promise<Status>=>{
                try {
                    const res = await col.findOne(filter,options);
                    
                    if(!res) return{
                        status: false,
                        message: `Document not found in '${collection}'`
                    }
                    return{
                        status: false,
                        message: `The document found in '${collection}'`,
                        document: res
                    }
                } catch (error:any) {
                    return{
                        status: false,
                        error: error.message
                    }
                }
            },

            // For finding many documents
            // find: async (
            //     filter: Filter<Collections[typeof collection]>,
            //     options?: FindOptions & Abortable
            // ): Promise<status>=>{
            //     try {
            //         const res = await col.find(filter,options).toArray()
                    
            //         if (res.length===0) return{
            //             status: false,
            //             message: `No document(s) found in '${collection}'`
            //         }

            //         return {
            //             status: true,
            //             message: `Found document(s) in '${collection}'`,
            //             documents: res as WithId<User|CourseHistory|OTPs|Course>
            //         }
            //     } catch (error:any) {
            //         return {
            //             status: false,
            //             message: error.message,
            //         }
            //     }
            // },
        }
    } catch(error: any){
        return null
    }
}