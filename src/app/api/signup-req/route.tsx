import ApiLinks from "@/lib/apiLinks";
import { bcryptHash } from "@/lib/bcrypt";
import { post } from "@/lib/fetchReq";
import { header } from "@/lib/headers";
import { signToken } from "@/lib/jwt";
import { createNewUserHistory } from "@/mongoDB/usercourses";
import { addUser, checkAdmin, findUser } from "@/mongoDB/users";
import { signupDataType } from "@/types/authType";
import { status } from "@/types/statusType";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    let response:status;
    let token: string|undefined;
    try {
        let reqData: signupDataType = await req.json();
        //checks if the user is an Preset admin or not
        if (checkAdmin(reqData.username,reqData.password)){
            reqData.admin = true;
        }
        //finds user
        const mongoUser = (await findUser(reqData,{username: reqData.username})).user;
        //checks if the user already exists or not

        if (!mongoUser) /*User Doesnt exists*/ {
            //generating token
            token = signToken({
                username: reqData.username,
                email: reqData.email,
                admin: reqData.admin
            }).token
            //creating user course history document
            await createNewUserHistory(reqData.username)
            //hashes password or make no changes
            reqData.password = (await bcryptHash(reqData.password)).hashed || reqData.password
            
            //Adding user to Database
            response = await addUser(reqData);
            response.token = token

            //If added successfully
            if(response.status){
                let emailDetails = {
                    username: reqData.username,
                    email: reqData.email
                }
                // Sending Signup Email
                await post(ApiLinks.email.signup.this, emailDetails)
            }
            
        }else /*User exists*/{
            response = {
                status: false,
                message: `User ${reqData.username} already exists`
            }
        }
        return NextResponse.json(response,{
            status: 200,
            headers: header(origin)
        })
    } catch (error:any) {
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