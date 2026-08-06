export default async function CoursePage({
    params
}:AsyncPageProps<never,{
    "course-id": string
}>) {
    const courseId = (await params)["course-id"]
    return <h1>{courseId}</h1>
}