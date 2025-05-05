
import { TransformationOptions } from "cloudinary"
import ApiLinks from "./apiLinks"
import { post } from "./fetchReq"
import {Cloudinary} from "@/lib/cloudinaryConfig";
import {status} from "@/types/statusType";

export const CloudinaryUrl = async(publicName: string, options?: TransformationOptions)=>{
    return await post(ApiLinks.cloudinary.url.this, {
        publicName: `WeLearn/${publicName}`,
        options: options
    })
}

/**
 * @param publicId - Path + Public ID of the file
 * @param opts - Optimization options to add (1 string)
 */

type CloudinaryFolder = 'WeLearn'|'WeLearn/profile-picture'
/**
 * @param file - Path of the file along with its extension.
 * @param uploadFolder - Cloudinary Folder path.
 * @param publicID - Public ID of the file to be uploaded.
 * @param transformationOptions - Cloudinary optimization/transformations
 */
export const cloudinaryUpload = async (
    file: string,
    uploadFolder: CloudinaryFolder,
    publicID: string,
    transformationOptions?: TransformationOptions
): Promise<status>=>{

    const transformations: TransformationOptions[] = [
        {
            crop: 'fill',
            aspect_ratio: '1:1'
        },
        {
            quality: 80,
            format:'auto'
        }
    ]
    const optimizations = {
        profilePicture: [transformations[0],transformations[1]],
    }

    try{
        const response = await Cloudinary.uploader.upload(file,{
            public_id: publicID,
            transformation: transformationOptions,
            folder: uploadFolder
        })
        //console.log(response)
        return {
            status: true,
            message: `${uploadFolder}/${publicID} uploaded successfully.`,
        }
    }catch (e:any) {
        return {
            status: false,
            error: e.message
        }
    }
}