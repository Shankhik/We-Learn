import { User } from '@/types/databaseTypes'
import {JwtPayload, Secret, sign,verify} from 'jsonwebtoken'
import { status } from '@/types/statusType'

export interface tokenType extends JwtPayload {
    username: string;
    email: string;
    admin: boolean;
}
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY||'';

export const signToken = (payload: tokenType): status =>{
    try{
        const token = sign(payload, secretKey,{
            algorithm: 'HS256',
            expiresIn: 60*60*5,
            issuer: 'we-learn'
        })
        
        let status:status = {
            status: true,
            message: "Token Created",
            token: token
        }
        return status
    }catch(error:any){
        let status:status = {
            status: false,
            error: `Error: ${error.message}`
        }
        return status
    }
}
export const verifyToken = (token: string) :status  =>{
    try {
        const decoded: tokenType = verify(token, secretKey, { algorithms: ['HS256'] }) as tokenType;
        
        if(decoded) /* undefined = tampered */{
            return {
                status: true,
                message: `Token Verified`,
                decoded: decoded
            }
        }
        else{
            return {
                status: false,
                message: `Token Not Genuine`,
            }
        }
    } catch (error:any) {
        return {
            status: false,
            error: `Error: ${error.message}`
        }
    }
}