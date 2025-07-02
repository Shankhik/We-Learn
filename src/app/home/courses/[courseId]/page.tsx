import CourseDescription from "./clientPage"
export default async function Course({params}:{
    params: Promise<{
        courseId: string
    }>
}) {
    // nextJs>=15 need server async component for dynamic routes
    // what a bull shit! It was working fine before
    return (
        <CourseDescription courseId={(await params).courseId}/>
    )
}