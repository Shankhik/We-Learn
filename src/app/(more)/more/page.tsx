'use client'
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect } from "react";
export default function More (){ 
    const router = useRouter();
    
    useEffect(()=>{
        router.replace('more/about')
    },[])
    return (
        null
    )
}