"use client";

import ModuleClassname from "@/lib/cssUtil";
import globalStyle from "./global.module.css";
import { useColorContext } from "@/context/colorScheme";
import { Activity, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { useNotification } from "@/context/notification";
import { ApiError } from "@/lib/serverUtils/apiError";
import { Course } from "@/types/databaseTypes";

type Props = {
    searchFunction: (query: string|undefined)=>
        Promise<{
            response?: Response;
            data?: Status | undefined;
            error?: ApiError;
        }>
    placeholder?: string,
    ref?: React.RefObject<HTMLInputElement|null>,
    containerStyle?: React.CSSProperties,
    Renderer: ({data}:{data:Course[]|undefined})=> React.JSX.Element
}
export default function SearchBar ({
    placeholder, searchFunction, Renderer, ref, containerStyle
}:Props){
    const css = new ModuleClassname(globalStyle);
    const {effectiveTheme} = useColorContext();

    const [isEmpty, setIsEmpty] = useState<boolean>(true);
    const {pushNotification} = useNotification();

    const searchBarRef = useRef<HTMLInputElement|null>(ref?.current??null);

    /* |||||||||||||||||||||| Debouncing States and Refs |||||||||||||||||||||| */
    const [lastSearch, setLastSearch] = useState<string>("");
    const [isInactive, setIsInactive] = useState(true);
    const inactiveTimeout = useRef<NodeJS.Timeout>(null);
    const debouncingInterval = useRef<NodeJS.Timeout>(null);
    const [result, setResult] = useState<any[]|null>(null);
    // Fetched Result from Search Function
    const getResults = useEffectEvent(async()=>{
        if (
            searchBarRef.current &&
            lastSearch !== searchBarRef.current.value
        ){
            const {response,data,error} = await searchFunction(searchBarRef.current?.value);
            if (response?.status === 501 || error){
                pushNotification(response?.statusText || error?.message,{
                    color:'red'
                })
            }
            // data===undefined means aborted search or an error
            // or else data will an array (could be empty)
            
            if (data?.courses){
                setResult(data.courses);
                setLastSearch(searchBarRef.current?.value??"");
            }
        }
    });

    // On Input Change
    const onChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setIsEmpty(e.target.value === "");

        // Sets active on change
        setIsInactive(prev=> prev? false: prev);

        // Clears existing timeout
        clearTimeout(inactiveTimeout.current||undefined);
        inactiveTimeout.current = setTimeout(()=>{
            // Sets inactive: true (after 1.5s)
            setIsInactive(true);
            inactiveTimeout.current = null;
        }, 1000);
    }

    useEffect(()=>{
        if (!searchBarRef.current) return;

        // While is active and !empty
        if (!isInactive && !isEmpty) {
            // Sets interval if there isn't any
            if (!debouncingInterval.current)
                debouncingInterval.current = setInterval(getResults,1300);
        }
        // Inactive but isn't empty
        if (isInactive && !isEmpty){
            if (debouncingInterval.current){
                clearInterval(debouncingInterval.current);
                debouncingInterval.current = null;
            }
            getResults();
        }

        // When there is no query
        if(isEmpty){
            // clears inactivity timout (just in-case)
            clearTimeout(inactiveTimeout.current??undefined);
            inactiveTimeout.current = null;

            // clears debouncing interval
            clearInterval(debouncingInterval.current??undefined);
            debouncingInterval.current = null;

            // resets last query (important)
            setLastSearch("");
            setResult(null);
        }
    },[isInactive, isEmpty, lastSearch])

    useEffect(()=>{
        return ()=>{
            clearInterval(debouncingInterval.current||undefined)
            clearTimeout(inactiveTimeout.current||undefined)
        }
    },[]);

    return <>
    <div style={{display:'flex', justifyContent:'center'}}>
        <div className={css.names(`container`)} style={containerStyle}>
            <input type="text" placeholder={placeholder}
                className={css.names(
                    `search-bar ${effectiveTheme} ${!isEmpty?'active':''}`
                )}
                ref={searchBarRef}
                onChange={onChange}
            />
            <Activity mode={(!isEmpty && lastSearch)?'visible':'hidden'}>
                <div className={css.names(`results ${effectiveTheme}`)}>
                    {/* lastSearch?`Searched: ${lastSearch}`:null */}
                    <Renderer data={result as Course[]??undefined}/>
                </div>
            </Activity>
        </div>
    </div>
    
    </>
}