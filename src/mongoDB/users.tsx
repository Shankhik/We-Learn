// import { mongoServer } from "./mongoServer";
import { mongoCollection } from "./operations";
import { User } from "@/types/databaseTypes";

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
    if (!username || !password) return false;
    let user = { username, password }
    let present = adminUsers.some((adminUser)=>{
        return (adminUser.username === user.username && adminUser.password === user.password)
    })
    return present;
}

export const addUser = async (userObject : User): Promise<Status> =>{
    try{
        //checks if username is in adminUsers list or not
        
        const users = mongoCollection('Users')?.collection!;
        // const db = mongoServer.db('E-Learning');
        // const users = db.collection('users');
        
        const info = await users.insertOne( userObject );

        if (!info.insertedId) throw new Error("Couldn't add User!");
        
        return {
            status: true,
            message: `User ${userObject.username} Added to Users collection`,
            documentId: info.insertedId
        }
    }catch(error: any){
        return {
            status: false,
            error: error.message
        }
    }
}

export const updateUserDetails = async (
    username:string,
    fields: {[key in keyof User]?: any}
):Promise<Status> => {
    
    try {
        // const db = mongoServer.db('E-Learning')
        // const users = db.collection('users') as Collection<User>
        const users = mongoCollection('Users')?.collection!;
        
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