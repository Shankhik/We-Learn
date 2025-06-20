import { header } from "@/lib/headers";
import {getFormBuffer} from "@/lib/parser";
import sharp from "sharp";
import {Cloudinary} from "@/lib/cloudinaryConfig";
import {UploadApiResponse} from 'cloudinary'
import {updateUserDetails} from "@/mongoDB/users";
import { status } from "@/types/statusType";

type TypeOfBuffer = {
    [key : string]: string | {
        filename: string;
        buffer: Buffer;
    }
}

const fileFieldName = 'file';
export async function POST (req: Request){
    const reqCopy = req.clone();
    let userDetailsHeader: status['decoded']|string = req.headers.get('x-user-details')
    try {
        if(!userDetailsHeader) throw new Error('User Details Not Found!');
        const userDetails = JSON.parse(userDetailsHeader) as status['decoded']

        let sharpImage:Buffer|undefined = undefined;
        
        let response = await getFormBuffer(reqCopy);
        const formData = response.formData as TypeOfBuffer;

        if(!formData) throw new Error('No Formdata Found!');
        
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
                        public_id: userDetails?.username ,
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

        if(!cldRes) throw new Error ("Couldn't Upload");

        if (cldRes && cldRes.version){
            await updateUserDetails(userDetails?.username||'',{
                profilePicture: cldRes.version
            })
            console.log(`-> User [${userDetails?.username}] : Profile-picture updated `)
        }
        
        return Response.json({
            status: true,
            message: `Uploaded the File Successfully`,
        },{
            status: 200,
            headers: header(req.headers.get('origin')||null)
        })
    } catch (error:any) {
        //console.log('error:', error.message)
        return Response.json({
            status: false,
            error: error.message
        },{
            status: 500,
            headers: header(req.headers.get('origin')||null)
        })
    }
}
