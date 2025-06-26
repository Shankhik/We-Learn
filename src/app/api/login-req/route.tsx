import { bcryptCompare, bcryptHash } from "@/lib/bcrypt";
import { serverLog } from "@/lib/colorText";
import { header } from "@/lib/headers";
import { signToken } from "@/lib/jwt";
import { findUser } from "@/mongoDB/users";
import { loginDataType } from "@/types/authType";
import { status } from "@/types/statusType";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    let reqData:loginDataType = await req.json();
    let response: status;
    //let user: User;
    let token: string|undefined;
    try{
        response = await findUser(reqData, {username: reqData.username});
        if(response.user){
            let password = response.user.password;
            let username = response.user.username;
            let email = response.user.email;
            let admin = response.user.admin;

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
                
                serverLog('success','USER','login',{
                    username:reqData.username
                })

                return NextResponse.json(response,{
                    status: 200,
                    headers: header(origin)
                })
            }
            else{
                serverLog('failed','USER','login',{
                    username: reqData.username,
                    error: `Wrong Password`
                })
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
            serverLog('failed','USER','login',{
                username: reqData.username,
                error: `Wrong Username`
            })
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
        serverLog('failed','USER','login',{
            username: reqData.username,
            error: error.message
        })
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