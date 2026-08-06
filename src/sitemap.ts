import { getAllCourses } from "./mongoDB/serverActions/courses";
import { MetadataRoute } from "next";

type SiteType = 'description'|'learn'
export default async function sitemap (): Promise<MetadataRoute.Sitemap> {
    
    const courses = await getAllCourses({},{
        projection: {
            _id: 0, courseId: 1
        }
    });

    const urlDetails = {
        protocol: process.env.NODE_ENV === 'production'?"https":"http",
        domain: process.env.NEXT_PUBLIC_API_DOMAIN || "localhost:3000"
    }

    let courseSites: {[key in SiteType]: Array<MetadataRoute.Sitemap[0]>} = {
        description: [],
        learn: []
    }
    if (courses.data) {
        courses.data.forEach(c=>{
            courseSites.description.push({
                url: `${urlDetails.protocol}://${urlDetails.domain}/home/courses/${c.courseId}`,
                lastModified: new Date()
            });
            courseSites.learn.push({
                url: `${urlDetails.protocol}://${urlDetails.domain}/course/${c.courseId}`,
                lastModified: new Date()
            });
        })
        
    }
    return [
        {url:`${urlDetails.protocol}://${urlDetails.domain}`,
        lastModified: new Date()},

        {url:`${urlDetails.protocol}://${urlDetails.domain}/home`,
        lastModified: new Date()},

        {url:`${urlDetails.protocol}://${urlDetails.domain}/settings`,
        lastModified: new Date()},

        {url:`${urlDetails.protocol}://${urlDetails.domain}/auth/login`,
        lastModified: new Date()},
        
        {url:`${urlDetails.protocol}://${urlDetails.domain}/auth/signup`,
        lastModified: new Date()},

        ...courseSites.description,
        ...courseSites.learn
    ]
}