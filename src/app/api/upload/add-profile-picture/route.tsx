import { header } from "@/lib/headers";
import {getFormBuffer} from "@/lib/parser";
import sharp from "sharp";
import {Cloudinary} from "@/lib/cloudinaryConfig";
import {UploadApiResponse} from 'cloudinary'
import {updateUserDetails} from "@/mongoDB/users";

import { colorText, serverLog } from "@/lib/colorText";

import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/serverUtils/apiError";
import { jsonParse } from "@/lib/serverUtils/jsonParsor";

import type { AuthToken } from "@/types/tokenType";

type TypeOfBuffer = {
    [key : string]: string | {
        filename: string;
        buffer: Buffer;
    }
}

const fileFieldName = 'file';

export async function POST (req: NextRequest): Promise<NextResponse<Status>>{
    const reqCopy = req.clone();
    let username:string = "";
    try {
        
        const userDetails = jsonParse<AuthToken>(req.headers.get('x-user-details'),{
            check:"username"
        });

        if(userDetails.error) throw new ApiError("Bad User Details header",{
            httpCode: 400 // Bad request
        });

        username = userDetails.data?.username!;
        
        let sharpImage:Buffer|undefined = undefined;
        
        let {formData, fileName, filePath} = await getFormBuffer(reqCopy);
        //const formData = response.formData as TypeOfBuffer;

        if(!formData) throw new ApiError('No Formdata Found!',{
            httpCode: 400 // Bad Request
        });
        
        let cldRes: UploadApiResponse|undefined = undefined;
        
        // Getting the file object
        const fileObject = formData[fileFieldName]

        // If the file is found
        if(
            typeof fileObject === 'object' &&
            fileObject.filename &&
            fileObject.buffer
        ){
            sharpImage = await sharp(fileObject.buffer)
            .extract({
                top: Number(formData.top),
                left: Number(formData.left) ,
                width: Number(formData.width),
                height: Number(formData.height),
            }).toBuffer()
            
            if(!sharpImage) throw new Error("Couldn't crop the image");
            
            // Uploading the image
            try {
                cldRes = await new Promise<UploadApiResponse|undefined> ((resolve)=>{
                    Cloudinary.uploader.upload_stream({
                        folder:'WeLearn/profile-picture',
                        public_id: userDetails.data?.username ,
                        invalidate:true,
                        transformation:{
                            crop:'fill',aspect_ratio:'1:1',
                            quality:40, format:"jpg"
                        }
                    },(error, result)=>{
                        if(error) return resolve(undefined)
                        return resolve (result)
                    }).end(sharpImage)
                })
            } catch (error:any) {
                throw new Error(error.message)
            }
        }

        if(!cldRes || !cldRes.version) throw new Error ("Couldn't Upload");

        // updating User details
        await updateUserDetails(userDetails.data?.username||'',{
            profilePicture: cldRes.version
        })

        serverLog('success','USER','profile-picture-add',{
            username: userDetails.data?.username
        })
        
        return NextResponse.json({
            status: true,
            message: `Uploaded the File Successfully`,
        },{
            status: 200,
        });
    } catch (error:any) {
        serverLog('failed','USER','profile-picture-add',{
            username: username,
            error: error.message
        })
        return NextResponse.json({
            status: false,
            error: error.message
        },{
            status: error.httpCode || 500,
        })
    }
}
