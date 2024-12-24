import { mongoServer } from "./mongoServer";
import { loginDataType, signupDataType } from "@/types/authType";
import { User } from "@/types/databaseTypes";
import type { status } from "@/types/statusType";

type seachObjectType = {
    username: string
    password?: string;
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

//checks if the user is an preset Admin User or not
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
export const findUser = async ( userObject: loginDataType|signupDataType, searchObject: seachObjectType): Promise<status> =>{
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