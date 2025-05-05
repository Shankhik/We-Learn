import {header} from "@/lib/headers";
import {verify} from "jsonwebtoken";
import {verifyToken} from "@/lib/jwt";
import {NextResponse} from "next/server";
import {status} from "@/types/statusType";
import {updateUserDetails} from "@/mongoDB/users";
import {Cloudinary} from "@/lib/cloudinaryConfig";

export async function GET (req: Request): Promise<NextResponse<status>> {
    try {
        const token = req.headers.get('authorization');
        if (!token) throw new Error ("No token provided");

        const decoded = verifyToken(token.split("Bearer ")[1]).decoded
        if(!decoded?.username) throw new Error ("Tampered token provided");

        // Deleting media from CDN
        const folder = 'WeLearn/profile-picture/'
        let cldRes = await Cloudinary.uploader.destroy(folder+decoded.username,{
            invalidate: true
        })
        console.log(cldRes)

        // Updating MongoDB
        let res = updateUserDetails(decoded.username,{
            profilePicture: null
        })
        return NextResponse.json({
            status: true,
            message: "Successfully Deleted the file",
        },{
            status: 200, headers: header(req.headers.get('origin')||null)
        })
    }catch (e:any) {
        return NextResponse.json({
            status: false,
            error: e.message,
        },{
            status: 200, headers: header(req.headers.get('origin')||null)
        })
    }


}