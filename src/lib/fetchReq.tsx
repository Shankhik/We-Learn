import { status } from "@/types/statusType";

const appDevPort = 3000;
export async function get(endPoint: string, header?: HeadersInit): Promise<any>{
    try{
        const response = await fetch(endPoint,{
            method: 'GET',
            headers: header || {}
        })
        const data = await response.json();
        return data;
    }catch(error:any){
        console.error('GET Fetch Error',error);
        return undefined;
    }
}
export async function post(endPoint: string, data:object, header?: HeadersInit){
    try{
        const response = await fetch(endPoint,{
            method: 'POST',
            headers: header || {},
            body: JSON.stringify(data)
        })
        const Resdata = await response.json()
        //console.log(Resdata);
        
        return Resdata;
    }catch(error:any){
        console.error('POST Fetch Error',error.message);
        return undefined;
    }
}

export const apiLink = (endpoint: string|'root',port?:number) => {
    const domain = process.env.NODE_ENV === 'development'?
    `http://localhost:${port||appDevPort}`:
    `https://${process.env.NEXT_PUBLIC_API_DOMAIN}`

    while (endpoint.startsWith("/") || endpoint.startsWith('api')){
        if(endpoint.startsWith("/")) endpoint = endpoint.split("/")[1];
        else{
            endpoint = endpoint.split('api/')[1]
        }
    }
    return endpoint==='root'?`${domain}/api`:`${domain}/api/${endpoint}`
}