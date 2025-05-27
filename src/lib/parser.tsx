import { status } from "@/types/statusType";
import { existsSync, writeFileSync } from "fs";

export interface ParseResponse extends status{
    fileName?: string|null;
    formData?: object;
    filePath?: string|null;
}
export const getFormData = async (req: Request):Promise<ParseResponse>=>{

    try {
        existsSync('public/upload')
    } catch (error) {
        console.error('No "public/upload" Found')
    }
    const body = req.body;

    if(body === null) {
        throw new Error("body is null");
    }

    let chunks = [];
    let reader = body.getReader()

    let isDone = false;

    while (!isDone) {
        const {value, done: doneReading} = await reader.read();
        if (value) chunks.push(value);
        isDone = doneReading;
    }
    const buffer = Buffer.concat(chunks)
    const binaryBody = buffer.toString('binary')

    const boundary = binaryBody.split('\r\n')[0]
    let fields = binaryBody.split(boundary+'\r\n')
    fields.splice(0,1)

    let data = {}

    fields.forEach((part)=>{

        const contentType = (part.split('\r\n')[1]).split(": ")[1]
        const contentDisposition = part.split('\r\n')[0]

        const fields = {
            name: getFieldName(contentDisposition, 'name'),
            filename: getFieldName(contentDisposition, 'filename')
        }

        const content = getContent(part,boundary)
        let tempName;
        // If it's a file
        if(contentType && fields.filename!==null){
            let date = new Date();

            tempName = `${getRandomInt(100,999)}-${fields.filename}`
            let buffer = new Uint8Array(Buffer.from(content,'binary'));
            try{
                writeFileSync(`public/upload/${tempName}`,buffer)
            }catch(error:any){
                console.log("Couldn't save file")
            }
        }

        Object.defineProperty(data,fields.name||'field',{
            value: fields.filename? tempName:content,
            writable:true, enumerable:true,
            configurable:true
        })
    })

    if(data){
        console.log(data)
        return {
            status: true,
            message: 'Parsed FormData',
            formData: data
        }
    }
    return{
        status: false,
        error: 'Form Data is Empty!'
    }
}
export const getFormBuffer = async (req: Request):Promise<ParseResponse>=>{
    const body = req.body;
    if(body === null) {
        throw new Error("body is null");
    }

    let chunks = [];
    let reader = body.getReader()

    let isDone = false;

    while (!isDone) {
        const {value, done: doneReading} = await reader.read();
        if (value) chunks.push(value);
        isDone = doneReading;
    }
    const buffer = Buffer.concat(chunks)
    const binaryBody = buffer.toString('binary')

    const boundary = binaryBody.split('\r\n')[0]

    let fields = binaryBody.split(boundary+'\r\n')
    fields.splice(0,1)

    let data = {}

    fields.forEach((part)=>{
        const contentType = (part.split('\r\n')[1]).split(": ")[1]
        const contentDisposition = part.split('\r\n')[0]

        const fields = {
            name: getFieldName(contentDisposition, 'name'),
            filename: getFieldName(contentDisposition, 'filename')
        }

        // Part's content ( string | binary-string )
        const content = getContent(part,boundary)

        let buffer: Buffer|undefined;

        // If it's a file
        if(contentType && fields.filename!==null){
            //console.log(`${fields.name}: ${fields.filename}`)
            buffer = Buffer.from(content,'binary');
        }//else console.log(`${fields.name}: ${content}`);

        Object.defineProperty(data,fields.name||'field',{
            value: !buffer? content: {
                filename: fields.filename,
                buffer: buffer
            },
            writable:true, enumerable:true,
            configurable:true
        })
    })

    if(data){
        return {
            status: true,
            message: 'Parsed FormData',
            formData: data
        }
    }
    return{
        status: false,
        error: 'Form Data is Empty!'
    }
}
export const parseFormData = async (req: Request, fieldName: string): Promise<ParseResponse> => {
    
    const body = req.body;

    const binaryBody = await getBinaryBody(body);

    if(binaryBody===null){
        return {
            status: false,
            message:'Request Body not found'
        }
    }

    let fileName: string|null = null;
    let path:string|undefined = undefined;
    let data = {}

    const boundary = binaryBody.split('\r\n')[0]
    let fields = binaryBody.split(boundary+'\r\n')
    fields.splice(0,1)

    fields.forEach((part)=>{
        const contentType = part.split('\r\n')[1]
        const contentDisposition = part.split('\r\n')[0]

        //field name
        let formFieldName = getFieldName(contentDisposition,'name') as string
        //file name (if it's a media)
        fileName = getFieldName(contentDisposition,'filename')
        
        let content = getContent(part,boundary)

        //For Media : Saves it
        if(getFieldName(contentDisposition,'name') === fieldName && contentType && fileName!==null) {//If this is the file
            let date = new Date()
            let preffix = `${getRandomInt(1000,9999)}-${date.getMilliseconds()}`

            let buffer = new Uint8Array(Buffer.from(content,'binary'))
            try {
                path = `public/upload/${preffix}-${fileName}`;
                //saves the file
                writeFileSync(path,buffer)

            } catch (error) {
                path = undefined;
            }
            
        }
        // Add field value to data
        Object.defineProperty(data,formFieldName,{
            value: fileName||content, // if MEDIA? filename:content
            writable: true,
            enumerable: true,
            configurable:true
        })
    })

    if(data){
        let res = {
            status: true,
            formData: data,
            filePath: path||undefined
        }
        if(!path) delete res.filePath
        return res
    }else{
        return {
            status: false,
            message: 'It is empty',
        }
    }
}
export const saveFile = async (req: Request, fieldName: string):Promise<ParseResponse>=>{
    
    const body = req.body;

    const binaryBody = await getBinaryBody(body);

    if(binaryBody===null){
        return {
            status: false,
            message:'Request Body not found'
        }
    }

    let filename: string|null = null;
    let path = undefined;

    /*Now the parsing*/

    // First Line is the boundary
    const boundary = binaryBody.split('\r\n')[0]
    let files = binaryBody.split(boundary+'\r\n')
    
    files.splice(0,1) //removing tge first element (element:'' blank)
    
    files.forEach((file)=>{
        const contentType = file.split('\r\n')[1]
        const contentDisposition = file.split('\r\n')[0]
        filename = getFieldName(contentDisposition,'filename')
        
        if(getFieldName(contentDisposition,'name') === fieldName && contentType && filename!==null) {//If this is the file
            let date = new Date()
            let preffix = `${getRandomInt(1000,9999)}-${date.getMilliseconds()}`
            
            const content = getContent(file,boundary)

            let buffer = new Uint8Array(Buffer.from(content,'binary'))
            try {
                path = `public/upload/${preffix}-${filename}`;
                writeFileSync(path,buffer)

            } catch (error) {
                path = undefined;
            }
            
        }
    })
    return {
        status: path? true:false,
        message: path? 'File Saved Successfully': 'Couldnt save file',
        fileName: filename
    }
}
export const retriveFieldValues = async(req:Request)=>{
    const body = req.body
    const binaryBody = await getBinaryBody(body);
    if(binaryBody===null){
        return {
            status: false,
            message:'Request Body not found'
        }
    }
    const boundary = binaryBody.split('\r\n')[0]
    let files = binaryBody.split(boundary+'\r\n')
    files.splice(0,1) //removing tge first element (element:'' blank)

    let data = {}
    files.forEach((file)=>{
        const contentType = file.split('\r\n')[1]
        const contentDisposition = file.split('\r\n')[0]
        let field = getFieldName(contentDisposition,'name') as string
        const content = getContent(file, boundary)
        
        // if its a media
        if(contentType) {
            Object.defineProperty(data,field,{
                value: '--MEDIA--',
                writable: true,
                enumerable: true,
                configurable:true
            })
        }else{
            Object.defineProperty(data,field,{
                value: content,
                writable: true,
                enumerable: true,
                configurable:true
            })
        }
    })
    if(Object.keys(data).length===0){
        return {
            status: false,
            message: 'No form fields found'
        }
    }
    return {
        status: true,
        message: `Found ${Object.keys(data).length} Fields`,
        body: data
    }

}
    
const getBinaryBody = async (
    body: ReadableStream<Uint8Array>|null
):Promise<string|null>=>{
    
    // if Body isnt found
    if (body===null) return null;

    let chunks = [];
    let reader = body.getReader()

    let isDone = false;

    while(!isDone){
        const { value, done: doneReading } = await reader.read();
        if (value) chunks.push(value);
        isDone = doneReading;
    }
    const buffer = Buffer.concat(chunks)
    const text = buffer.toString('binary')

    return text
}

const getFieldName = (contentDisposition: string, fieldName: string)=>{
    let fields = contentDisposition.split(':')[1].split(' form-data;')[1];
    let data = fields.split(`${fieldName}="`)[1]
    if(data){
        return data.split(`"`)[0]
    }
    return null
}

const getContent = (file: string, boundary: string)=>{
    let binary = file.split("\r\n\r\n")[1]
    binary = binary.trim()
    
    if(binary.endsWith(`\r\n${boundary}--`)){
        binary = binary.split(`\r\n${boundary}--`)[0]
    }
    
    return binary
}
function getRandomInt(min:number, max:number) {
    // Ensure min and max are integers
    min = Math.ceil(min);
    max = Math.floor(max);
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    // Generate random integer between min (inclusive) and max (inclusive)
    return num
}
