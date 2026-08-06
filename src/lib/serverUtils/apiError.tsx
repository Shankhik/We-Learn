import { NextRequest } from "next/server";

export class ApiError extends Error {
    //Default value [Internal Server Error]
    httpCode: number = 500;

    constructor (message: string, options?: ErrorOptions & {httpCode?:number}){
        super (message,options);
        this.httpCode = options?.httpCode??500
    }
}
// export const errorHandler = (callback: (httpCode?: number)=>Promise<any>|any)=>{
//     try{
//         return callback()
//     }catch(e:any){
//         return {
//             error: e
//         }
//     }
// }

export const getReqData = async <T extends unknown>(
    req:NextRequest
): Promise<{
    data?: T,
    error?: ApiError
}>=>{
    try {
        return {
            data: (await req.json()) as T
        }
    } catch (error:any) {
        error.message = "Bad Req Data"
        error.httpCode= 400
        return {
            error
        }
    }
}
export const invalidValueHandler = ()=>{

}