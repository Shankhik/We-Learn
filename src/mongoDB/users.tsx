import { bcryptHash } from "@/lib/bcrypt";
import { mongoServer } from "./mongoServer";
import { forgotPwdDataType, loginDataType, signupDataType } from "@/types/authType";
import { User } from "@/types/databaseTypes";
import type { status } from "@/types/statusType";
import { Collection } from "mongodb";

type seachObjectType = {
    username: string;
    password?: string;
    email?: `${string}@${string}`;
}
const adminUsers :{ username: string,password: string }[]= [
    // presets Admin Users
    {
        username: 'PeaceKeeperOP',
        password: 'imbetter#always'
    },
    {
        username: 'Shankhik',
        password: 'shankhik2003'
    }
];

//checks if the user is a preset Admin User or not
export const checkAdmin = (username: string, password: string): boolean=>{
    let user: { username: string, password: string } = {
        username: username,
        password: password
    }
    let present = adminUsers.some((adminUser)=>{
        return (adminUser.username === user.username && adminUser.password === user.password)
    })
    return present;
}

export const findUsers = async () : Promise<status>=>{
    
    try {
        const db = mongoServer.db('E-Learning');
        const users = db.collection('users');
        
        const manyUsers = await users.find({}).toArray();
        //{ usersList return [] if no entries found }
        
        if (manyUsers.length !== 0){
            return {
                status: true,
                message: `${manyUsers.length} users found`,
                users: manyUsers
            }
        }
        else{
            return {
                status: true,
                message: `No users found`
            }
        }

    } catch (error: any) {
        return{
            status: false,
            error: error.message
        }
    }
    
}
export const findUser = async (
        userObject: loginDataType|signupDataType|forgotPwdDataType,
        searchObject: seachObjectType
    ): Promise<status> =>{
    try {
        const db = mongoServer.db('E-Learning');
        const users = db.collection('users');
        
        const oneUser = await users.findOne(searchObject)
        if (oneUser !== null){
            return {
                status: true,
                message: `User {${userObject.username}} Found!`,
                user: oneUser
            }
        }
        else{
            return {
                status: false,
                message: `No User {${userObject.username}} Found!`
            }
        }
    } catch (error: any) {
        return {
            status: false,
            error: error.message
        }
    }
}
export const userAuthenticate = async (userObject: User):Promise<any> =>{
    try{
        const db = mongoServer.db('E-Learning');
        const users = db.collection('users');

        const oneUser = await users.findOne({ username : userObject.username, password:userObject.password })
        if (oneUser !== null){
            return {
                status: true,
                message: `User {${userObject.username}} Found!`,
                user: oneUser
            }
        }
        else{
            return {
                status: false,
                message: `No User {${userObject.username}} Found!`
            }
        }
    } catch (error: any) {
        return {
            status: false,
            error: error.message
        }
    }
        
}

export const addUser = async (userObject : User): Promise<status> =>{
    try{
        //checks if username is in adminUsers list or not
        
            
        const db = mongoServer.db('E-Learning');
        const users = db.collection('users');
        
        await users.insertOne( userObject );
        return {
            status: true,
            message: `User ${userObject.username} Added to Users collection`
        }
    }catch(error: any){
        return {
            status: false,
            error: error.message
        }
    }
}

export const changePwd =  async (username: string, password: string): Promise<status>=>{
    try{

        const db = mongoServer.db('E-Learning');
        const users = db.collection('users') as Collection<User>;

        let res = await users.updateOne({username: username},{
            $set:{
                password: password
            }
        })

        return {
            status: true,
            message: `${username}'s password updated!`
        }
        
    }catch(error: any){
        return {
            status: false,
            error: error.message
        }
    }
}

export const getUserDetails = async (username: string):Promise<status>=>{
    try {
        const db = mongoServer.db('E-Learning');
        const users = db.collection('users') as Collection<User>

        let res = await users.findOne({username: username})
        let user = {...res} //if res=null => user={}

        if(res !== null){
            delete user.password
            return {
                status: true,
                message: 'retrieved user details',
                user: user
            }
        }
        return {
            status: false,
            message: 'No User Found!'
        }
        
    } catch (error:any) {
       return {
            status: false,
            error: error.message
        }
    }
}

export const updateUserDetails = async (
    username:string,
    fields: {[key in keyof User]?: any}
):Promise<status> => {
    
    try {
        const db = mongoServer.db('E-Learning')
        const users = db.collection('users') as Collection<User>
        
        let res = await users.updateOne({username: username},{
            $set: fields
        })

        if(res.acknowledged){
            return {
                status: true,
                message: `Update Successfull`
            }
        }else{
            return {
                status: false,
                message: `Update Unsuccessfull`
            }
        }
    } catch (error:any) {
        return {
            status: false,
            error: error.any
        }
    }
}