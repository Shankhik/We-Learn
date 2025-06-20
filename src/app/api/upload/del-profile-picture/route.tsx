import {header} from "@/lib/headers";
import {NextResponse} from "next/server";
import {status} from "@/types/statusType";
import {updateUserDetails} from "@/mongoDB/users";
import {Cloudinary} from "@/lib/cloudinaryConfig";

export async function GET (req: Request): Promise<NextResponse<status>> {
    const userDetails = JSON.parse(
        req.headers.get('x-user-details') as string
    ) as status['decoded']
    
    try {
        // Deleting media from CDN
        const folder = 'WeLearn/profile-picture/'
        let cldRes = await Cloudinary.uploader.destroy(folder+userDetails?.username,{
            invalidate: true
        }) as { result: string } // just defining the actual type [by default: any]

        // Updating MongoDB
        if(cldRes.result === 'ok'){
            await updateUserDetails(userDetails?.username||'',{
                profilePicture: null
            })
            console.log(`-> Profile Picture Removed [${userDetails?.username}]`);
        }
        
        return NextResponse.json({
            status: true,
            message: "Successfully Deleted the file",
        },{
            status: 200, headers: header(req.headers.get('origin'))
        })
    }catch (e:any) {
        return NextResponse.json({
            status: false,
            error: e.message,
        },{
            status: 500, headers: header(req.headers.get('origin'))
        })
    }


}