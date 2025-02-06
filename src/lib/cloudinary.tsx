
import { TransformationOptions } from "cloudinary"
import ApiLinks from "./apiLinks"
import { post } from "./fetchReq"

export const CloudinaryUrl = async(publicName: string, options?: TransformationOptions)=>{
    return await post(ApiLinks.cloudinary.url.this, {
        publicName: `WeLearn/${publicName}`,
        options: options
    })
}