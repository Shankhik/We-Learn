
import fs from 'fs';
import { NextResponse } from "next/server";
import { header } from "@/lib/headers";
import { FileType, fileUploadPath } from "@/lib/file";
import { status } from "@/types/statusType";
import { Cloudinary } from '@/lib/cloudinaryConfig';
/*
export const config = {
    api: {
        bodyParser: false, // Disable body parsing for formidable
    },
};
*/
export async function POST(req:Request):Promise<NextResponse<status>>{
    const origin = req.headers.get('origin')
    if (!fs.existsSync(fileUploadPath)){
       fs.mkdirSync(fileUploadPath);
    }
    let response:status ={
        status: false
    }
    const {name,base64,fileFor,type} = (await req.json()) as FileType
    const newName = `${fileFor}-${name}`
    const buffer = new Uint8Array(Buffer.from(base64 as string, 'base64'))
    try {
        fs.writeFileSync(`${fileUploadPath}/${newName}`,buffer)
        const res = await Cloudinary.uploader.upload(`${fileUploadPath}/${newName}`,{
            public_id: newName.split(".")[0],
            folder: 'WeLearn'
        })
        if(res.url){
            console.log(res.url)
            response ={
                status: true,
                message:'uploaded'
            }
            fs.unlinkSync(`${fileUploadPath}/${newName}`)
        }else{
            response ={
                status: false,
                error:'couldnt upload'
            }
        }
        
    } catch (error:any) {
        response = {
            status: false,
            error: error.message
        }
    }
    
    
    /*try {
        
        const [fields, files] = await form.parse(r1)
        console.log(fields)
        console.log(files)
    } catch (error:any) {
        console.log(error.message)
    }*/

    /*
    handler(r1,r2,()=>{
        console.log(r1.files)

    })
    */
    
    
    return NextResponse.json({
        status: true,
        message: 'working'
    },{
        status: 200,
        headers: header(origin)
    })

}