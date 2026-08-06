import { NextRequest } from "next/server";
import { ApiError } from "./apiError";

// For safely parsing req body json
export const parseReqJson = async <T extends unknown>(req:NextRequest|Request)=>{
    try {
        return await req.clone().json() as T;
    } catch (error:any) {
        // console.log("[parse-req-json]:",error.message)
        return undefined;
    }
}
export const jsonParse = <T extends unknown>(
    json:string|undefined|null,
    options?: {
        check?: string,
        httpCode?: number
    }
):{
    data: T|null,
    error?: ApiError
}=>{
    try {
        if (!json) return {
            data: null,
            error: new ApiError("Invalid Json string",{
                cause: "Json string is Either"
            })
        };
        const data = JSON.parse(json);
        
        if (options?.check && !(options?.check in data)){
            throw new ApiError("Json type expectation failed",{
                ...(options.httpCode?{
                    httpCode: options.httpCode
                }:{})
            })
        }
        return {
            data
        }
    } catch (error: any) {
        if (options?.httpCode) error.httpCode = options.httpCode;
        return {
            data: null,
            error: error
        }
    }
}