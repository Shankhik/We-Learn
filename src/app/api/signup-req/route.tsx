import ApiLinks from "@/lib/apiLinks";
import { bcryptHash } from "@/lib/bcrypt";
import { post } from "@/lib/fetchReq";
import { header } from "@/lib/headers";
import { signToken } from "@/lib/jwt";
import { createNewUserHistory } from "@/mongoDB/usercourses";
import { addUser, checkAdmin, findUser } from "@/mongoDB/users";
import { signupDataType } from "@/types/authType";
import { User } from "@/types/databaseTypes";
import { status } from "@/types/statusType";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    let response:status;
    let token: string|undefined;
    let userDocument: User = {
        username: "",
        displayName: "",
        email:"",
        password: "",
        profilePicture: null,
        admin: false
    };
    try {
        const reqData: signupDataType = await req.json();

        userDocument.username = reqData.username;
        userDocument.email = reqData.email;
        userDocument.displayName = reqData.username;
        userDocument.password = reqData.password; // already hashed
        userDocument.profilePicture = null;

        //checks if the user is an Preset admin or not
        if (checkAdmin(reqData.username,reqData.password)){
            userDocument.admin = true;
        }
        //finds user
        const mongoUser = (await findUser(reqData,{username: reqData.username})).user;
        //checks if the user already exists or not

        if (!mongoUser) /*User Doesnt exists*/ {
            //generating token
            token = signToken({
                username: userDocument.username,
                email: userDocument.email,
                admin: userDocument.admin
            },60*20).token
            
            //creating user course history document
            await createNewUserHistory(userDocument.username)
            
            //Adding user to Database
            response = await addUser(userDocument);
            response.token = token

            //If added successfully
            if(response.status){
                let emailDetails = {
                    username: userDocument.username,
                    email: userDocument.email
                }
                // Sending Signup Email
                await post(ApiLinks.email.signup.this, emailDetails)
                //await post('/api/email/signup', emailDetails)
                console.log(`-> Signed-Up [${userDocument.username}]`)
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