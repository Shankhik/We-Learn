"use server";

import { TransformationOptions, UploadApiErrorResponse, UploadApiOptions, UploadApiResponse } from 'cloudinary'
import { Cloudinary } from './config'

type FileType = 'course-cover'|'course-thumbnail'|'user-profile'
// const folderMap:{[keys in FileType]:`WeLearn/${string}`} = {
//     'course-cover'
// }
const getFolder = (fileFor: FileType)=>{
    switch (fileFor){
        case 'course-cover':
            return `WeLearn/course-images/cover`
        case 'course-thumbnail':
            return `WeLearn/course-images/thumbnail`
        case 'user-profile':
            return `WeLearn/profile-picture`
        default:
            return null;
    }
}
export const uploadFromBuffer = async (
    bufferFor: FileType,
    buffer: Buffer|undefined,
    publicId: string,
)=>{
    try {
        let result: UploadApiResponse|undefined;
        let error: UploadApiErrorResponse|undefined;

        const folder = getFolder(bufferFor);
        if(!folder) return null;

        let transformation: TransformationOptions = {
            quality: 40, format: 'webp', crop:'fill'
        };

        switch(bufferFor){
            case 'course-cover':
                transformation = {
                    ...transformation,
                    aspect_ratio: "2:1"
                }; break;
            case 'course-thumbnail':
                transformation = {
                    ...transformation,
                    quality: 10,
                    aspect_ratio: "1:1",
                }; break;
            case 'user-profile':
                transformation = {
                    ...transformation,
                    aspect_ratio: "1:1",
                }; break;
        }

        return await new Promise<
            UploadApiErrorResponse|UploadApiResponse|null
        >((resolve,reject)=>{
            Cloudinary.uploader.upload_stream({
                folder, public_id: publicId,
                invalidate: true, transformation
            },(error, result)=>{
                if (error) return reject(error||null);
                return resolve(result||null);
            }).end(buffer);
        })
        

        return {
            ...(result??error)
        } as UploadApiResponse|UploadApiErrorResponse
    } catch (err:any) {
        return null;
    }
    
}