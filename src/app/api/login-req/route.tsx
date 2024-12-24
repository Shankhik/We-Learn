import { bcryptCompare, bcryptHash } from "@/lib/bcrypt";
import { header } from "@/lib/headers";
import { signToken } from "@/lib/jwt";
import { checkAdmin, findUser } from "@/mongoDB/users";
import { loginDataType } from "@/types/authType";
import { User } from "@/types/databaseTypes";
import { status } from "@/types/statusType";
import { log } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    let response: status;
    let user: User;
    let token: string|undefined;
    try{
        let reqData:loginDataType = await req.json();
        
        response = await findUser(reqData, {username: reqData.username});
        if(response.user){
            let password = response.user.password;
            let username =response.user.username;
            let email =response.user.email;
            let admin =response.user.admin;
            //let samePwd = await bcryptCompare(reqData.password, password)

            if((await bcryptCompare(reqData.password, password)).status){
                token = signToken({
                    username: username,
                    email: email,
                    admin: admin
                }).token
                response = {
                    status: true,
                    message: `Login Successfull`,
                    token: token
                }
                return NextResponse.json(response,{
                    status: 200,
                    headers: header(origin)
                })
            }
            else{
                response = {
                    status: false,
                    message: `Wrong Password`,
                }
                return NextResponse.json(response,{
                    status: 200,
                    headers: header(origin)
                })
            }
            
        }
        else{
            response = {
                status: false,
                message: `Wrong Username`,
            }
            return NextResponse.json(response,{
                status: 200,
                headers: header(origin)
            })
        }
    }catch(error: any){
        response = {
            status: false,
            error: `Error: ${error.message}`
        }
        return NextResponse.json(response,{
            status: 500,
            headers: header(origin)
        })
    }
}