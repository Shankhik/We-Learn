import { getCourseName, getModuleTitles, getUserCourseTrack, verifyUser } from "./server-actions"
import ModulesSegment from "./components/ModuleSegment"

export default async function LearnCourse({params}:{
    params: Promise<{
        courseId: string
    }>
}) {
    let { courseId } = await params;
    courseId = decodeURIComponent(courseId);
    const courseNamePromise = getCourseName(courseId);

    const userTrackPromise = getUserCourseTrack (await verifyUser(),courseId);
    const moduleTitlesPromise = getModuleTitles(courseId);
    
    return <ModulesSegment
        courseNamePromise={courseNamePromise}
        userTrackPromise={userTrackPromise}
        moduleTitlePromise={moduleTitlesPromise}
    />
}