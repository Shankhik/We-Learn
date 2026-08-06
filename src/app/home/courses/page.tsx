"use client"

import SearchBar from "@/components/search-bar/searchBar";
import { CardsCollection } from "../Cards";
import { useAllCourses } from "../Hooks";
import useSearch from "@/lib/hooks/searchQuery";
import { ResultRenderer } from "@/components/search-bar/searchResult";

export default function Courses () {
    const search = useSearch();
    const searchFn = async (query: string|undefined)=>{
        return await search<Status>(`/api/courses/get/search?keyword=${
            encodeURIComponent(query??"")
        }`);
    }
    return <>
    <SearchBar placeholder="🔍 Search any course by name"
        searchFunction={searchFn}
        Renderer={ResultRenderer}
        containerStyle={{marginBottom:"15px"}}
    />
    {/* <AllCourses/> */}
    </>
}
// const AllCourses = ()=>{
//     const {data, isFetching} = useAllCourses();
//     return <CardsCollection title="All Courses"
//         loading={isFetching}
//         cardList={data}
//     />
// }