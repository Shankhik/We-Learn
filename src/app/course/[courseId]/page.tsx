import CourseLearn from "./clientPage";
export default async function Page({params}:{
    params: Promise<{
        courseId: string;
    }>
}) {
    return(
        <CourseLearn courseId={(await params).courseId}/>
    ) 
} 