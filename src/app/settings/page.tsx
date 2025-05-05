'use client';
import { useAuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function Page (){
    const router = useRouter();
    const {verified,updateAuth} = useAuthContext()
    useEffect(()=>{
        updateAuth();
        router.replace("/settings/profile")
    },[verified])
    return null
}