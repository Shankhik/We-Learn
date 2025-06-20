import { bcryptCompare, bcryptHash } from "@/lib/bcrypt";
import { header } from "@/lib/headers";
import { signToken } from "@/lib/jwt";
import { checkAdmin, findUser } from "@/mongoDB/users";
import { loginDataType } from "@/types/authType";
import { status } from "@/types/statusType";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    let response: status;
    //let user: User;
    let token: string|undefined;
    try{
        let reqData:loginDataType = await req.json();
        
        response = await findUser(reqData, {username: reqData.username});
        if(response.user){
            let password = response.user.password;
            let username =response.user.username;
            let email =response.user.email;
            let admin =response.user.admin;

            if((await bcryptCompare(reqData.password, password)).status){
                token = signToken({
                    username: username,
                    email: email,
                    admin: admin
                },60*20).token
                response = {
                    status: true,
                    message: `Login Successfull`,
                    token: token
                }
                
                console.log(`-> Logged-In [${reqData.username}]`)

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