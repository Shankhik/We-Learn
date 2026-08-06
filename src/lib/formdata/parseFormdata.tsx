import { ApiError } from "../serverUtils/apiError";

export const parseFormdata = async <T extends unknown>(
    body: ReadableStream<Uint8Array<ArrayBuffer>> | null,
)=>{
    try {
        if(!body) return null;
        return await getFormData(body) as T;
    } catch (error:any) {
        return null;
    }
}
const getFormData = async (
    reqBody: ReadableStream<Uint8Array<ArrayBuffer>> | null
)=>{
try {
    if(!reqBody) throw new ApiError("Request body is null",{
        httpCode: 500
    });

    let chunks = [];
    const reader = reqBody.getReader();
    let isDone = false;

    while(!isDone){
        const {done, value} = await reader.read()
        if(value) chunks.push(value);
        isDone = done;
    }
    const bufferString = Buffer.concat(chunks).toString('binary');
    //const binaryString = buffer.toString();
    const boundary = bufferString.split('\r\n')[0];
    
    let fields = bufferString.split(boundary+'\r\n');
    // Removes the empty string (first element)
    fields.splice(0,1);

    let data = {};

    fields.forEach(((part,i)=>{
        const details = part.split("\r\n\r\n").at(0);
        const name = details?.split("name=")[1].split("\"")[1]!;
        const content = parseJson(getContent(part, boundary));

        if (details?.includes("filename=")){
            const format =  details.split("\r\n")[1].split(": ")[1].split("/").at(-1)!
            const filename = details.split("filename=")[1].split("\"")[1]!;
            const buffer = Buffer.from(content,'binary');

            Object.defineProperty(data,name,{
                value: {filename,buffer},
                writable: true,
                enumerable: true,
                configurable: true
            });
        }else{
            Object.defineProperty(data,name,{
                value: content||-"empty",
                writable: true,
                enumerable: true,
                configurable: true
            });
        }
    }));
    
    // This is a Binary String
    return data;

} catch (error:any) {
    return null;
}}
const getContent = (file: string, boundary: string)=>{
    let binary = file.split("\r\n\r\n")[1]
    binary = binary.trim()
    
    if(binary.endsWith(`\r\n${boundary}--`)){
        binary = binary.split(`\r\n${boundary}--`)[0]
    }
    
    return binary
}
const parseJson = (body: string|undefined|null)=>{
    try {
        if (!body) return '';
        return JSON.parse(body);
    } catch (e:any) {
        return body
    }
}
const getFields = (fields: string[])=>{
    if(fields.length === 0) throw new ApiError("No fields found",{
        httpCode: 500
    });

    fields.forEach((field)=>{
        const details = {
            contentType: field.split('\r\n')[1].split(': ')[1],
        }
    })
}
