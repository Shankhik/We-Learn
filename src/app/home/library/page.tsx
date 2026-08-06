import moduleStyle from "./page.module.css";
import ModuleClassname from "@/lib/cssUtil";

import { Heading } from "@/components/htmlElements/Texts";
// import { useEnrolledCourses } from "../Hooks";
// import { CardsCollection } from "../Cards";
import SearchSection from "./SearchSection";
import { headers as nextHeaders } from "next/headers";
import PageContextProvider from "./PageContext";
import MyChannel from "./MyChannel";

export default async function Courses ({
    searchParams
}:AsyncPageProps<'query'|'tag'|'channel'>) {
    const css = new ModuleClassname(moduleStyle);

    return <PageContextProvider
    searchParamsPromise={searchParams}>
        <title>Library</title>
        <SearchSection/>
        <MyChannel/>
    </PageContextProvider>
}



// const EnrolledCourses = ()=>{
//     const {data, isFetching} = useEnrolledCourses();
//     return <CardsCollection cardList={data}
//         title="Enrolled" maxCount={7}
//         loading={isFetching}
//     />
// }