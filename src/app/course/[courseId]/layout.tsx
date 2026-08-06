import React, { Suspense } from "react";
import { getCourseName, getModuleTitles, getUserCourseTrack, verifyUser } from "./server-actions";
import AutoRedirect from "./Redirect";
import MainContent from "@/components/ui-components/layout-structure/MainContent";
import Layout from "./components/Layout";
import FloatingButtons from "./components/FloatingButtons";
import { Metadata } from "next";
import { ModuleDetailsProvider } from "./components/ModuleDetailsContext";

type Params = {
    courseId: string,
}

export async function generateMetadata({params}:{
    params: Promise<Params>
}):Promise<Metadata> {
    const courseId:string|undefined = (await params).courseId
    if (courseId){
        const courseName = await getCourseName(courseId);
        if(!courseName) return {
            title: `Course Not Found`,
            description: `Course with id '${courseId} doesn't exists.'`
        }
        return {
            title: courseName,
            description: `Learn Course '${courseName}'`
        }
    }
    return {
        title: "Invalid Course Id",
        description:`Invalid Course ID`
    }
}

export default async function CourseLayout({
    children, params
}: {
    children: React.ReactNode,
    params: Promise<Params>|Params
}) {
    let { courseId } = (await params);
    courseId = decodeURIComponent(courseId);
    const courseName = await getCourseName(courseId);
    return <>
    <Layout courseName={courseName}>
        <Content courseId={courseId}>
            {children}
        </Content>
    </Layout>
    </>
}

const Content = React.memo(async ({
    children, courseId
}:{
    courseId: string,
    children?: React.ReactNode
})=>{
    const verificationPromise = verifyUser();
    const userTrackPromise = getUserCourseTrack(
        await verificationPromise, courseId
    );

    const moduleTitlePromise = getModuleTitles(courseId);

    return <>
    <ModuleDetailsProvider courseId={courseId}
        userTrackPromise={userTrackPromise}
        moduleTitlesPromise={moduleTitlePromise}
    >
    <MainContent style={{flexGrow:1}}>
        <AutoRedirect message={
            <h1 style={{margin:'0 auto'}}>Access Denied!</h1>
        } verificationPromise={verificationPromise}>
            {children}
        </AutoRedirect>
    </MainContent>
    
    <FloatingButtons courseId={courseId}/>
    </ModuleDetailsProvider>
    </>
})