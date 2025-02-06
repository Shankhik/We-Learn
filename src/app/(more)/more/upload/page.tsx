'use client'

import { FormEvent } from "react"
import ApiLinks from "@/lib/apiLinks";
import { status } from "@/types/statusType";
import { dynamicToBase64, FileType, staticToBase64 } from "@/lib/file";

export default function UploadImageTest (){
    const upload = async (e:FormEvent) => {
        e.preventDefault();
        const field = (e.target as Element).children[0] as HTMLInputElement
        const files = field.files
        
        if(files && files[0]){
            console.log((files[0].size/(1024*1024)).toFixed(3) , 'MB')
            let formData = new FormData();
            
            formData.append('file', files[0])
            const res = await fetch('/api/upload',{
                method: 'POST',
                headers:{
                    'Content-Type':"multipart/form-data"
                },
                body: formData
            })
            let data = (await res.json()) as status
            
            console.log(data)
        }
    }
    return null
    return(
        <form onSubmit={upload}>
            <input type="file" name="file"/>
            <input type="submit" value={'upload'}/>
        </form>
    )
}