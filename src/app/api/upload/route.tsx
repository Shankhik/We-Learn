import { header } from "@/lib/headers";
import {getFormData} from "@/lib/parser";
import sharp, {OutputInfo} from "sharp";
import {unlink, unlinkSync} from "node:fs";

export async function POST (req: Request){
    try {
        const reqCopy = req.clone();
        let response = await getFormData(reqCopy);
        let sharpRes:OutputInfo|null = null;
        const formData = response.formData as any;

        if(formData){
            sharpRes = await sharp('public/upload/'+formData.file)
                .extract({
                    top: Number(formData.top),
                    left: Number(formData.left) ,
                    width: Number(formData.width),
                    height: Number(formData.height),
                }).toFile(`public/upload/dp-${formData.file}`)

            console.log(sharpRes);
        }

        // deleting the original photo
        if(formData.file && sharpRes){
            try{
                unlinkSync(`public/upload/${formData.file}`);
            }catch (e:any){
                console.log(e.message)
            }
        }
        return Response.json({
            status: true,
            message: 'working'
        },{
            status: 200,
            headers: header(req.headers.get('origin')||null)
        })
    } catch (error:any) {
        console.log('error:', error.message)
        return Response.json({
            status: false,
            error: error.message
        },{
            status: 200,
            headers: header(req.headers.get('origin')||null)
        })
    }
}