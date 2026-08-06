"use client";

import HomeLayout from "@/components/layouts/HomeLayout";
import { usePathname } from "next/navigation";

type Segments = "login"|"signup"|"forgot-password";

export default function Authlayout ({
    children
}:{
    children?: React.ReactNode
}){
    const segment = usePathname().split("/").at(2)
    return <>
    <HomeLayout
        removeContainer
        bypassAuth activePath={segment}
    >
        {children}
    </HomeLayout>
    </>
}