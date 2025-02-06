
type FileFor = 'course'|'user'
export type FileType = {
    name: string|null;
    type: string|null;
    fileFor: FileFor;
    base64: string|ArrayBuffer|null|undefined;
}
export const fileUploadPath = 'public/upload'

export const staticToBase64 = (file: File, type: FileFor):Promise<FileType>=>{
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.readAsDataURL(file);
        let status:FileType = {
            name: null,
            type: null,
            fileFor: 'course',
            base64: null
        };
        reader.onloadend = (e:ProgressEvent<FileReader>)=>{
            let data = e.target?.result
            
            if(data){
                data = data.toString();
                status = {
                    name: file.name,
                    type: data.split(',')[0].split("/")[0].split(":")[1],
                    fileFor: type,
                    base64: data.split(',')[1]
                }
                
            }
            resolve(status) 
        }
        reader.onerror = (error)=>{
            console.error('error ',error.target?.error)
            reject("Error Reading the file")
        }
    })
    
}
export const dynamicToBase64 = (name: string, file: File, type: FileFor):Promise<FileType>=>{
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.readAsDataURL(file);
        let status:FileType = {
            name: null,
            type: null,
            fileFor: 'course',
            base64: null
        };
        reader.onloadend = (e:ProgressEvent<FileReader>)=>{
            let data = e.target?.result
            
            if(data){
                data = data.toString();
                status = {
                    name: name,
                    type: data.split(',')[0].split("/")[0].split(":")[1],
                    fileFor: type,
                    base64: data.split(',')[1]
                }
                
            }
            resolve(status) 
        }
        reader.onerror = (error)=>{
            console.error('error ',error.target?.error)
            reject("Error Reading the file")
        }
    })
    
}