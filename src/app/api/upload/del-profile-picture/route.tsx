import {header} from "@/lib/headers";
import {NextResponse} from "next/server";
import {status} from "@/types/statusType";
import {updateUserDetails} from "@/mongoDB/users";
import {Cloudinary} from "@/lib/cloudinaryConfig";

export async function GET (req: Request): Promise<NextResponse<status>> {
    let userDetailsHeader: status['decoded']|string = req.headers.get('x-user-details')
    try {
        if(!userDetailsHeader) throw new Error('User Details Not Found!');
        const userDetails = JSON.parse(userDetailsHeader) as status['decoded']

        // Deleting media from CDN
        const folder = 'WeLearn/profile-picture/'
        let cldRes = await Cloudinary.uploader.destroy(folder+userDetails?.username,{
            invalidate: true
        }) as {result: 'ok'|'not found'}
        
        if(cldRes.result !== 'ok') throw new Error ("Couldn't Delete the File!");

        // Updating MongoDB
        let res = updateUserDetails(userDetails?.username||"",{
            profilePicture: null
        })
        console.log(`-> User [${userDetails?.username}] : Profile-picture removed `)

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
            status: 500, headers: header(req.headers.get('origin')||null)
        })
    }


}