import {header} from "@/lib/headers";
import {NextResponse} from "next/server";
import {updateUserDetails} from "@/mongoDB/users";
import {Cloudinary} from "@/lib/cloudinaryConfig";
import { colorText, serverLog } from "@/lib/colorText";

export async function GET (req: Request): Promise<NextResponse<Status>> {
    let userDetailsHeader: Status['decoded']|string = req.headers.get('x-user-details');
    let userDetails: Status['decoded'];
    try {
        if(!userDetailsHeader) throw new Error('User Details Not Found!');
        userDetails = JSON.parse(userDetailsHeader) as Status['decoded'];
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

        serverLog('success','USER','profile-picture-delete',{
            username: userDetails?.username,
        })

        return NextResponse.json({
            status: true,
            message: "Successfully Deleted the file",
        },{
            status: 200, headers: header(req.headers.get('origin'))
        })
    }catch (e:any) {

        serverLog('failed','USER','profile-picture-delete',{
            username: userDetails?.username,
            error: e.message
        })

        return NextResponse.json({
            status: false,
            error: e.message,
        },{
            status: 500, headers: header(req.headers.get('origin')||null)
        })
    }


}