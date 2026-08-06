import { verifyToken } from "@/lib/jwt";
import { jsonParse } from "@/lib/serverUtils/jsonParsor";
import { mongoCollection } from "@/mongoDB/operations";
import { ApiError } from "@/lib/serverUtils/apiError";
import { NextRequest, NextResponse } from "next/server";
import { httpStatusCode } from "@/lib/fetchReq";
import { parseFormdata } from "@/lib/formdata/parseFormdata";
import { uploadFromBuffer } from "@/lib/cloudinary/utils";
import { InsertOneResult, UpdateResult } from "mongodb";
import { ansiColor } from "@/lib/colorText";
import { getDominantColor } from "../get/cards/sharpUtil";

import type { AuthToken } from "@/types/tokenType";
import type { Course } from "@/types/databaseTypes";

type FormdataType = Omit<Course,'images'> & {
    'image-cover'?: {
        filename: string,
        buffer: Buffer
    },
    'image-thumbnail'?: {
        filename: string,
        buffer: Buffer
    },
}
export async function POST(req: NextRequest):Promise<NextResponse<Status>> {
    try {
        /* ||||||||||||||||| Bad Request + Authorization checks ||||||||||||||||||| */
        const userDetails = jsonParse<AuthToken>(req.headers.get("x-user-details"),{
            check: "username",
        });
        
        if (userDetails.error) throw new ApiError("Bad User Details",{
            httpCode: 400
        });
        if(userDetails.data?.admin!==true) throw new ApiError("Not Authorized to add courses",{
            httpCode: httpStatusCode['unauthorized']
        });

        /* |||||||||||||||||| Request Data Parsing + Checks |||||||||||||||||| */
        const reqCopy = req.clone();
        const reqData = reqCopy.body;
        
        const formdata = await parseFormdata<FormdataType>(reqData);
        if(!formdata) throw new ApiError("Bad request body.",{
            httpCode: 400
        })
        //console.log(formdata);
        /* |||||||||||||||||| Checking existing courses |||||||||||||||||| */
        const courseCollection = mongoCollection('Courses')?.collection!
        const exists = await courseCollection.countDocuments({
            courseId: formdata.courseId
        })

        /* |||||||||||||||||| Search query 'mode' check |||||||||||||||||| */
        const mode = req.nextUrl.searchParams.get('mode');
        if (!mode || (mode!=='add' && mode!=='update'))
            throw new ApiError("Bad search-query 'mode'",{
                cause: "mode must be 'add' or 'update'",
                httpCode: 400
            });
        // For "add": If course already exists
        if (exists>0 && mode==='add') throw new ApiError("Course already exists",{
            httpCode: 400
        });
        // For "update": If course doesn't already exists
        else if (exists===0 && mode==='update') throw new ApiError("No such course to update",{
            httpCode: 400
        });

        /* |||||||||||||||||| Building up Course object |||||||||||||||||| */
        let course:Partial<Course>={};
        
        // Converts Formdata into Object for insertion
        for (const [key,value] of Object.entries(formdata)){
            // For Image files
            if (key==='image-cover' || key === 'image-thumbnail'){
                const isCover = key==='image-cover'? true:false
                if ('buffer' in (value as any)){
                    const res = await uploadFromBuffer(
                        isCover? 'course-cover':'course-thumbnail',
                        formdata[key]?.buffer,
                        formdata.courseId
                    );
                    
                    if (res?.version && res.public_id){
                        // Create object if it doesnt already exists
                        if (!course.images) course.images={
                            // Just an Empty Object
                        }
                        // Finding the dominant color
                        const dominantColor = await getDominantColor(
                            formdata[key]?.buffer!
                        );
                        // Addind Images data
                        course.images[isCover?'cover':'thumbnail'] = {
                            publicId: res.public_id,
                            version: res.version,
                            ...(res.secure_url? { url: res.secure_url }:{}),
                            dominantColor: dominantColor as string
                        }
                    }
                }
            }else{
                if(!course[key as keyof Partial<Course>])
                    course[key as keyof Partial<Course>] = value as any
            }
        }
        let res: InsertOneResult|UpdateResult
        if (mode==='add'){
            res = await courseCollection.insertOne(course as Course);
            if(!res.acknowledged) throw new ApiError(
                `Couldn't add the course ${course.courseId}`,{
                httpCode: 500
            })
        }else{
            res = await courseCollection.updateOne({courseId: formdata.courseId},{
                $set:{...course}
            });
            if(!res.acknowledged) throw new ApiError(
                `Couldn't add the course ${course.courseId}`,{
                httpCode: 500
            })
            // res = {} as InsertOneResult;
            // res.acknowledged=true;
        }
        if (res.acknowledged) console.log(
            ansiColor('green',"✔ Course:"),
            mode==='add'?
            `Course [${formdata.courseId}] added.`:
            `Course [${formdata.courseId}] updated.`
        )
        
        return NextResponse.json({
            status: true,
            message: mode==='add'?
            `Course [${course.courseId}] added!`:
            `Course [${formdata.courseId}] updated.`,
            course: course as Course
        })
    } catch (error:any) {
        return NextResponse.json({
            status: false,
            error: error.message
        },{
            status: error.httpCode||500
        })
    }
}

// const addDominantColor = (course: Course)=>{
//     try {
//         let newCourse: typeof cards = [];

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
