import { header } from "@/lib/headers";
import {getFormBuffer, getFormData} from "@/lib/parser";
import sharp, {OutputInfo} from "sharp";
import {readFileSync, unlinkSync} from "node:fs";
import {tokenType, verifyToken} from "@/lib/jwt";
import {Cloudinary} from "@/lib/cloudinaryConfig";
import {UploadApiResponse} from 'cloudinary'
import {updateUserDetails} from "@/mongoDB/users";

type TypeOfBuffer = {
    [key : string]: string | {
        filename: string;
        buffer: Buffer;
    }
}

const fileFieldName = 'file';
export async function POST (req: Request){
    try {
        const reqCopy = req.clone();
        const token = req.headers.get("authorization");

        if(!token){
            throw new Error("No token provided");
        }

        const decoded:tokenType|null|undefined = verifyToken(token.split('Bearer ')[1]).decoded

        if( !decoded || !decoded.username ){
            throw new Error("Tampered Token provided");
        }

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
            }).toBuffer()//.toFile(`public/upload/dp-${formData[fileFieldName].filename}`);
            
            if(!sharpImage) throw new Error("Could'nt crop the image");

            // Uploading the image
            try {
                cldRes = await new Promise<UploadApiResponse|undefined> ((resolve)=>{
                    Cloudinary.uploader.upload_stream({
                        folder:'WeLearn/profile-picture',
                        public_id: decoded.username,
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

        if(!cldRes) throw new Error ('Couldnt Upload');

        if (cldRes && cldRes.version){
            await updateUserDetails(decoded.username,{
                profilePicture: cldRes.version
            })
        }
        
        /*
        let response = await getFormData(reqCopy);
        
        const formData = response.formData as any;

        if(formData){
            sharpRes = await sharp('public/upload/'+formData.file)
                .extract({
                    top: Number(formData.top),
                    left: Number(formData.left) ,
                    width: Number(formData.width),
                    height: Number(formData.height),
                }).toFile(`public/upload/dp-${formData.file}`)

        }

        // deleting the original photo
        if(formData.file && sharpRes){
            try{
                unlinkSync(`public/upload/${formData.file}`);
            }catch (e:any){
                console.log(e.message)
            }
        }
        if(!decoded.username){
            throw new Error("Tampered Token provided");
        }

        let cldRes: UploadApiResponse|null = null;
        try {
            cldRes = await Cloudinary.uploader.upload(`public/upload/dp-${formData.file}`,{
                public_id: decoded.username,
                folder: "WeLearn/profile-picture",
                transformation: {
                    crop:'fill',
                    aspect_ratio:'1:1',
                    quality:80,
                    format:'jpg'
                },
                invalidate:true
            })
        }catch (e:any){
            console.log("Couldn't upload file");
        }
        if (cldRes!==null && cldRes.version){
            await updateUserDetails(decoded.username,{
                profilePicture: cldRes.version
            })
        }
        // Deleting the 2nd image from disk
        try {
            unlinkSync(`public/upload/dp-${formData.file}`);
        }catch (e:any){
            console.log("Couldn't delete the cropped image from disk")
        }

        if(cldRes===null || !cldRes.version){
            throw new Error(`Couldnt upload the file`);
        }
        */
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
            status: 200,
            headers: header(req.headers.get('origin')||null)
        })
    }
}
