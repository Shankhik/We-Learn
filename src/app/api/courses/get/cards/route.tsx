import { mongoCollection } from "@/mongoDB/operations";
import { NextRequest, NextResponse } from "next/server";
import { jsonParse } from "@/lib/serverUtils/jsonParsor";
import { ApiError } from "@/lib/serverUtils/apiError";
import { getAllCourses } from "@/mongoDB/serverActions/courses";
import { getDocumentsCount } from "@/mongoDB/serverActions/general";

import type { ReqDataType } from "@/lib/apiReqDataType";
import type { AuthToken } from "@/types/tokenType";
import type { WithId } from "mongodb";
import type { Course } from "@/types/databaseTypes";

type SearchParams = ReqDataType['courses']['get']['cards']['params'];
type ReturnParamType = ReqDataType['courses']['get']['cards']['params']['return']
export async function GET (req: NextRequest): Promise<NextResponse<Status>|void> {

    try {
        const userDetails = jsonParse<AuthToken>(req.headers.get("x-user-details"),{
            check: "username"
        });

        if (userDetails.error) throw new ApiError("Bad User Details",{
            httpCode: 400
        })

        const courseIds = req.nextUrl.searchParams.getAll("id");

        // if course ids are given
        if (courseIds.length>0) {
            const {data, error} = await getCertain(courseIds);
            if (error) throw error;

            return NextResponse.json({
                status: true,
                message: `Found ${data?.length} courses`,
                data
            })
        }

        // Gets "return" search param
        const returnParam = req.nextUrl.searchParams
        .get('return') as ReturnParamType|null
        
        // If "return" param is not found (all courses are returned)
        if (!returnParam){
            const {data, error, moreAvailable} = await getAll();
            if (error) throw error;
            
            return NextResponse.json({
                status: true,
                message: `Found ${data?.length} courses`,
                data,
                moreAvailable
            })
        }

        if( returnParam!=='enrolled' ) throw new ApiError(
            "?return should be 'enrolled'"
        ,{httpCode:400});
        
        const {data, error} = await getEnrolled(userDetails.data?.username?? undefined)
        if(error) throw error;

        return NextResponse.json({
            status: true,
            message: `Found ${data?.length} enrolled course(s)`,
            data
        })
        
    } catch (error:any) {
        return NextResponse.json({
            status:false, error: error.message
        }, {
            status: error.httpCode ||500
        });
    }
}

/* Projections needed for Cards */
const cardsProjection = {
    _id: 0,
    courseId: 1, courseName: 1,
    rating: 1, images: 1,
    price: 1
}
const getCertain = async(courseIds:string[])=>{
    let data: WithId<Course>[] | undefined;
    let error: ApiError|undefined = undefined;
    try {
        const collection = mongoCollection('Courses')?.collection!
        data = await collection.find({
            courseId: {$in: courseIds}
        },{
            projection: cardsProjection
        }).toArray();
    }catch(e:any){
        error = e ;
        // Internal Server Error
        if (error?.message) error.httpCode = 500;
    }
    return{ data, error }
}

const getEnrolled = async (username: string|undefined):Promise<{
    data?: Course[],
    moreAvailable?: boolean,
    error?: ApiError
}> => {
    try {
        const collUserTrack = mongoCollection("UserTracks")?.collection!

        if(!username) return{
            error: new ApiError("Username not provided!",{
                // Bad x-user-details
                httpCode: 400
            })
        }

        const enrolled = await collUserTrack.findOne({username},{
            projection: {
                _id:0,
                "enrolled.courseId": 1
            }
        })
        
        if (!enrolled) return {
            data:[],
            moreAvailable: false
            //error: new Error("User history not found!")
        }

        let enList: string[] = [];

        enrolled.enrolled.forEach (course => enList.push(course.courseId));

        const cards = await getAllCourses({
            courseId: {$in: enList}
        }, {
            projection: cardsProjection
        })
        if (cards.data===undefined)
            throw new ApiError("Couldn't get enrolled courses");
        return {
            data: cards.data,
            moreAvailable: cards.data.length<enList.length
        }
    } catch (error:any) {
        error.httpCode = 500;
        return {
            error: error
        }
    }
}
const getAll = async ():Promise<{
    data?: Course[],
    moreAvailable?: boolean,
    error?: ApiError
}>=>{
    
    try{
        const count = await getDocumentsCount('Courses');
        const courses = await getAllCourses({},{
            projection:cardsProjection
        });
        if (courses.data===undefined || courses.error || !count)
            throw new ApiError("Couldn't get all courses");
        return {
            data: courses.data,
            moreAvailable: count> courses.data.length
        }
    }catch(e:any){
        e.httpCode = 500;
        return{
            error: e
        }
    }
}

// export const getNewCards = async (cards: WithId<Course>[])=>{
//     try {
//         let newCards: typeof cards = [];

//         for (const c of cards){
//             let dominantColor: string|undefined = undefined;
//             if (c.images?.thumbnail?.url){
//                 const imgBuffer = await getArrayBuffer(c.images?.thumbnail?.url);
//                 console.log(dominantColor)
//                 if (imgBuffer){
//                     dominantColor = await getDominantColor(imgBuffer.buffer) as string;
                    
//                     c.images.thumbnail.dominantColor = dominantColor;
//                 }
//             }
//             newCards.push(c);
//         }
//         return newCards;
//     } catch (error:any) {
//         return null;
//     }

// }