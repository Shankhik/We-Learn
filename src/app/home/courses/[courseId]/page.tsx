import CourseDetailsPage, { DescriptionPageLoading } from "./CourseDetails"
import { Suspense } from "react";
import { getDescription } from "./server";
import { getAllCourses } from "@/mongoDB/serverActions/courses";
import { getThumbnail } from "@/images/course/thumbnails/getThumbnail";

// It is the default behavior though
export const dynamicParams = true;

export async function generateStaticParams () {
    if (process.env.NODE_ENV === 'development')
        return [];

    const allCourses = await getAllCourses({},{
        projection:{
            courseId: 1, _id: 0
        }
    })
    if (allCourses.data===undefined || allCourses.error)
        return [];
    return allCourses.data.map((course)=>({
        courseId: course.courseId
    }));
}


export default async function CoursePage({params}:{
    params: Promise<{courseId: string}>
}) {
    const courseId = decodeURIComponent((await params).courseId);
    const coursePromise = getDescription(
        courseId,
    );
    const defaultThumbnail = getThumbnail({random:true});
    return <>
    <Suspense fallback={<DescriptionPageLoading/>}>
        <CourseDetailsPage
            defaultThumbnail={defaultThumbnail}
            coursePromise={coursePromise}
        />
    </Suspense>
    </>
}