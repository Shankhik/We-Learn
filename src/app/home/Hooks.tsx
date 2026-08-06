import { appfetch } from "@/lib/fetchReq";
import { Course, EnrolledCourses } from "@/types/databaseTypes";
import { QueryClient, QueryKey, QueryMeta, QueryObserver, QueryObserverResult, useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { WithId } from "mongodb";
import { useEffect, useState } from "react";

export type QueryParameter = {
    client: QueryClient;
    queryKey: string[];
    signal: AbortSignal;
    meta: QueryMeta | undefined;
    pageParam?: unknown;
    direction?: unknown;
}
export const queryDetails = {
    /* Fetches course details for Cards */

    // All courses
    allCourses:{ // line: 187
        queryKey: ['cards','all-courses'],
        staleTime: 60000*10, // 10 mins
    },
    // Enrolled Courses
    enrolledCourses: {
        queryKey: ['cards','enrolled-courses'],
        staleTime: 60000*5, // 5 mins
    },

    // Gets User's course history list [not course card details]
    courseHistory: { // line: 86
        queryKey: ['course-history'],
        staleTime: 60000*5, // 5 mins
    },
    weather: {  // line: 36
        queryKey: ['weather'],
        staleTime: 60000*10, // 10 mins
    }
}
// query.isLoading: isFetching && isPending. [initial data is unavailable]
// query.isRefetching: isFetching && !isPending [initial data is available]
// query.isFetching: queryFn is running irrespective of initial data

export const courseQueryDetails = queryDetails;

/* Gets Weather */
export const useWeather = ()=>{
    type Weather = {
        temperature: number|undefined,
        unit: '°C'|'°F'|undefined
    }
    const getPosition = async ():Promise<GeolocationPosition>=>{
        return new Promise ((res, rej)=> navigator.geolocation.getCurrentPosition(res, rej));
    }
    const {data, refetch} = useQuery({
        queryKey: queryDetails.weather.queryKey,
        queryFn: async (): Promise<Weather> => {
            try{
                const position = await getPosition();
                if(!position.coords.latitude||!position.coords.longitude){
                    return {
                        temperature: undefined,
                        unit: undefined
                    }
                }
                const stringDetails = {
                    url : "https://api.open-meteo.com/v1/forecast",
                    coordString: `latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`,
                    query: "current=temperature_2m&timezone=auto"
                }
                const response = await appfetch<any>(`${stringDetails.url}?${stringDetails.coordString}&${stringDetails.query}`)

                if(!response.current.temperature_2m) throw new Error("Couldn't get weather")
                return {
                    temperature: response.current.temperature_2m,
                    unit: response.current_units.temperature_2m
                }
            }
            // This will catch "location permission denied"
            catch(e:any){
                return {
                    temperature: undefined,
                    unit: undefined
                }
            }
        },
        staleTime: queryDetails.weather.staleTime,
        meta:{
            persist: true
        }
    })
    return {...data, retry: refetch};
}

/* Gets User's Track Record */

/* Gets all courses cards */
export const useAllCourses = ()=>{
    const query = useQuery({
        queryKey: queryDetails.allCourses.queryKey,
        queryFn: async () : Promise<Array<Course>>=>{
            
            // client.getQueryData(['dashboard','all-courses']) // -> This reads the previous value of the same query
        
            const promise = await fetch(`/api/courses/get/cards`,{
                method:"GET"
            })
            const res = await promise.json() as Status<WithId<Course>[]>;
            
            // If Loading failed or no 'courses' key found
            if (!res.status || !res.data)
                throw new Error(res.error);

            return res.data;
        },
        
        staleTime: queryDetails.allCourses.staleTime,
        meta:{
            persist: true,  // will be saved in Local Storage
        }
    })
    
    // query.isLoading: isFetching && isPending. [initial data is unavailable]
    // query.isRefetching: isFetching && !isPending [initial data is available]
    // query.isFetching: queryFn is running irrespective of initial data
    return query
}

/* Gets enrolled courses cards */
export const useEnrolledCourses = ()=>{
    const query = useQuery({
        queryKey: queryDetails.enrolledCourses.queryKey,
        queryFn: async ()=>{
            // gets the cards
            const res = await appfetch<Status, undefined>("/api/courses/get/cards?return=enrolled");
            //if(res === undefined)
            if(!res || !res.data || !Array.isArray(res.data))
            throw new Error(res?.error||"Couldn't retrieve enrolled cards");
    
            return res.data as Course[];
        },
        staleTime: queryDetails.enrolledCourses.staleTime,   // 5 mins
        meta:{
            persist: true
        }
    });

    const findCourse = (courseId: string)=>{
        if (!query.data) return null;
        return query.data.find(
            c=>c.courseId === courseId
        )||null
    }

    return {
        ...query,
        findCourse,
        //enroll: async (courseId: string)=> mutation.mutateAsync(courseId)
    }
}
// export const useEnrolledCourses = ()=>{
//     const client = useQueryClient();
//     const queryFn = async ()=>{
//         // gets the cards
//         const res = await appfetch<status, undefined>("/api/courses/get/cards?return=enrolled");
        
//         if(!res.data || !Array.isArray(res.data))
//         throw new Error(res.error||"Couldn't retrieve enrolled cards");

//         return res.data as Course[];
//     }

//     const query = useQuery({
//         queryKey: queryDetails.enrolledCourses.queryKey,
//         queryFn,
//         staleTime: queryDetails.enrolledCourses.staleTime,
//         meta:{
//             persist: true
//         }
//     })
    
//     const mutationFn = async (courseId: string)=>{
//         const res = await appfetch<status, unknown>("/api/user/user-track?enroll="+courseId)
        
//         if (!res.status || !res.data)
//         throw new Error(res.error||res.message);

//         return res.data as EnrolledCourses[]
//     }

//     const mutation = useMutation({
//         // If this doesn't work, update the page/s onCLick to refetch manually
//         onSuccess: async (data)=>{
//             await client.invalidateQueries({
//                 queryKey:queryDetails.courseHistory.queryKey,
//             })
//             await client.invalidateQueries({
//                 queryKey:queryDetails.enrolledCourses.queryKey,
//             })
//         },
//         mutationFn,
//         onError: (error)=>{
//         }
//     })

//     // Finds a course
//     const find = (courseId: string|undefined)=> query.data?.find(c=> c.courseId === courseId)
    
//     return {
//         ...query,
//         // For finding a certain course
//         findData: find,
//         // For enrolling in an Course
//         enroll: async(courseId: string)=> mutation.mutateAsync(courseId)
//     }
// }

export function useWatchedQuery(queryKey:QueryKey) {
    const client = useQueryClient();
    const [result, setResult] = useState<QueryObserverResult|null>(null);

    useEffect(() => {
        const observer = new QueryObserver(client, { queryKey });

        // Initialize with current cached value
        setResult(observer.getCurrentResult());

        // Subscribe to updates
        const unsubscribe = observer.subscribe((res) => {
        setResult(res);
        });

        return unsubscribe;
    }, [client, JSON.stringify(queryKey)]);

    return result;  // always the latest live data
}

