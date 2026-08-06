import { compare, hash } from "bcrypt-ts";

const saltRound = 11;

export const bcryptHash = async ( text : string ) : Promise<Status> => {
    try {
        const hashed = await hash (text, saltRound);
        return {
            status: true,
            message: 'Hashed Successfully!',
            hashed: hashed
        };
    } catch (error: any) {
        return {
            status: false,
            message: `Error: ${error.message}`,
        };
    }
    
    
}
export const bcryptCompare = async (text: string, hashed: string ) : Promise<Status> =>{
    try{
        const check = await compare (text, hashed);
        if (check){
            return {
                status: true,
                message: 'Matched'
            }
        }
        else{
            return {
                status: false,
                message: 'Not Matched'
            }
        }
    }catch (error:any){
        return {
            status: false,
            error: error.message
        }
    }
}