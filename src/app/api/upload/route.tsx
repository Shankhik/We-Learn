import { header } from "@/lib/headers";
import { parseFormData, ParseResponse } from "@/lib/parser";

export async function POST (req: Request){
    let bodyParsed;
    try {
        //const data = await retriveFieldValues(req);
        //bodyParsed = await parseFormData(req,'file') as ParseResponse
        console.log(bodyParsed)
    } catch (error) {
        console.log(req.body?.locked)
    }
    
    return Response.json({
        status: true,
        message: 'working'
    },{
        status: 200,
        headers: header(req.headers.get('origin')||null)
    })
}