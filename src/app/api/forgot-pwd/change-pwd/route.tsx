import { bcryptHash } from "@/lib/bcrypt";
import { header } from "@/lib/headers";
import { verifyToken } from "@/lib/jwt";
import { changePwd } from "@/mongoDB/users";
import { status } from "@/types/statusType";
import { NextRequest, NextResponse } from "next/server";
type ReqDataType = {
    username: string;
    password: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<status>> {
    const origin = req.headers.get('origin');
    const auth = req.headers.get('authorization')||'test';
    let status: status;
    try{
        let decoded = verifyToken(auth?.split(' ')[1]).decoded

        if (decoded && decoded.password && decoded.username){
            const hashedPwd = (await bcryptHash(decoded.password)).hashed as string;
            status = await changePwd(decoded.username, hashedPwd);
            console.log(`Changed Password for: ${decoded.username}`)
        }else{
            status = {
                status: false,
                message: 'Authorization Failed'
            }
        }
    }catch (e:any) {
        status = {
            status: false,
            error: e.message
        }
    }
    return NextResponse.json(status, {
        status: 200,
        headers: header(origin)
    })
}