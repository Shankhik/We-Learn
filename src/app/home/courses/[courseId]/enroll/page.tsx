"use server";

import { Heading } from "@/components/htmlElements/Texts";
import moduleStyle from "./page.module.css";
import { getDescription } from "../server";
import { Suspense } from "react";
import EnrollPage, { Wait } from "./EnrollPage";

export default async function ({params}:{
    params: Promise<{courseId: string}>
}){
    const courseId = decodeURIComponent((await params).courseId);

    return <>
    
    <Suspense fallback={<Wait/>}>
        {/* <Wait/> */}
        <EnrollPage coursePromise={getDescription(courseId)}/>
    </Suspense>
    </>
}