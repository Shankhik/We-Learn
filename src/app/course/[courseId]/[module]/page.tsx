import { getCourseModule, getModuleTitles, getUserCourseTrack, verifyUser } from "../server-actions"
import { Suspense } from "react"
import CourseModule from "./CourseModule"
import { redirect } from "next/navigation"
import Title from "@/components/htmlElements/Title"
import { ModulesBlock } from "../components/ModuleSegment"
import Button from "@/components/buttons/NewButton"
import { ModuleDetailsProvider, useModuleDetails } from "../components/ModuleDetailsContext"

type Params = {
    courseId: string,
    module: string|number
}

const parseModuleNumber = async(mNumber : string|number)=>{
    //let isChanged = false;
    if (typeof mNumber === "string"){
        mNumber = parseInt(mNumber)
        if (Number.isNaN(mNumber))
            mNumber = 1;
    }
    return Math.max(0,Math.floor(mNumber))
}
export default async function CourseModulePage ({params}:{
    params: Promise<Params> | Params
}){
    params = await params;
    params.courseId = decodeURIComponent(params.courseId);

    const moduleNumber = await parseModuleNumber(params.module);

    return <>
    {/* <Suspense fallback={<h1>Loading</h1>}> */}
    <Redirect url={Math.max(moduleNumber,1).toString()}
        condition={ moduleNumber<1 ||
        parseInt(`${params.module}`)!== moduleNumber}
    >
        <Suspense>
        <MainContent
            courseId={params.courseId}
            moduleNumber={moduleNumber}
        />
        </Suspense>
    </Redirect>
    {/* </Suspense> */}
    </>
}
const MainContent = async({courseId, moduleNumber}:{
    courseId: string
    moduleNumber: number
})=>{
    const getTitle = async (promise: ReturnType<typeof getCourseModule>)=>{
        const m = await promise;
        return m? m.title:undefined;
    }

    const userTrack = await getUserCourseTrack(await verifyUser(),courseId);
    
    if (! userTrack) return <>
        <h2>You are not enrolled!</h2>
    </>
    const modulePromise = getCourseModule(courseId, moduleNumber)
    const redirectPath = `/course/${courseId}/${
        userTrack.completedUpto + (userTrack.completionDate? 0:1)
    }`;

    return <>
    <OutOfRange href={redirectPath}
    condition={moduleNumber > (userTrack.completedUpto + 1)}>
        <Suspense>
        <Title titlePromise={getTitle(modulePromise)}/>
        <CourseModule
            initialUserTrack={userTrack}
            modulePromise={modulePromise}
            moduleNumber={moduleNumber}    
            completedUpto={userTrack.completedUpto}         
        />
        </Suspense>
    </OutOfRange>
    {/* <Redirect condition={moduleNumber > (userTrack.completedUpto + 1)}
    url={redirectPath}>
        <Suspense>
        <Title titlePromise={getTitle(modulePromise)}/>
        <CourseModule
            modulePromise={modulePromise}
            moduleNumber={moduleNumber}    
            completedUpto={userTrack.completedUpto}            //userTrackPromise={userTrackPromise}            
        />
        </Suspense>
    </Redirect> */}
    </>
}
const OutOfRange = async ({children, condition, href}:{
    children: React.ReactNode
    condition: boolean,
    href: string
})=>{
    if (condition) return <>
    <ModulesBlock>
        <h1>Complete Your Previous Chapters First.</h1>
        <Button style={{marginTop:"20px"}}
        href={href} hrefMode="replace">
            Continue
        </Button>
    </ModulesBlock>
    </>
    
    return children
}
const Redirect = async ({children, url, condition}:{
    children?: React.ReactNode
    url: string,
    condition?: boolean
})=>{
    if(condition)
        redirect(url);

    return children
}