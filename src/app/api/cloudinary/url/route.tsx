import { Cloudinary } from "@/lib/cloudinaryConfig";
import { header } from "@/lib/headers";
import { ImageTransformationAndTagsOptions, TransformationOptions, VideoTransformationAndTagsOptions } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

type reqDataType = {
    publicName: string;
    options?: ImageTransformationAndTagsOptions|VideoTransformationAndTagsOptions
}
export async function POST (req: NextRequest): Promise<NextResponse<string>>{
    const origin = req.headers.get('origin');
    const {publicName, options} = (await req.json()) as reqDataType;
    //let data = Cloudinary.image()
    return NextResponse.json(Cloudinary.url(publicName, options),{
        status: 200,
        headers: header(origin)
    })
}