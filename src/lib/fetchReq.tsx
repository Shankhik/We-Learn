import { status } from "@/types/statusType";

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