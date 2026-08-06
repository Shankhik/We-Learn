import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from "react"

type CallBackFn = (...args:any[])=> Promise<void>|void;

export default function useDebouncing <T extends CallBackFn> (
    callback:T,
    debouncingTime:number = 1200,
    useInactivityOnly?: number
){

    // Timings
    const timings = useMemo(()=>({
        inactivityTimeout: useInactivityOnly || (debouncingTime-300) || 1000,
        debouncingInterval: debouncingTime || 1300
    }),[debouncingTime]);

    // If OnChange is Inactive: User is not typing
    const [isInactive, setIsInactive] = useState(true);

    // Interval/Timeout References
    const debouncingInterval = useRef<NodeJS.Timeout>(undefined);
    const inactivityTimeout = useRef<NodeJS.Timeout>(undefined);
    
    const debouncingCallback = useEffectEvent(async ()=>{
        await callback();

        // Clears Interal if The Field is Inactive
        if (isInactive && debouncingInterval.current){
            clearInterval(debouncingInterval.current);
            debouncingInterval.current = undefined
        }
    });

    // Debouncing Side Effect
    useEffect(()=>{
        if (
            // When Timeout is Active
            !isInactive
            // When it not used for Inactivity Only
            && !useInactivityOnly
        ){
            // Creates debouncing interval if not found
            if (!debouncingInterval.current)
            debouncingInterval.current = setInterval(
                debouncingCallback,
                timings.debouncingInterval
            );
        }

        // Will run after Inactivity
        if (useInactivityOnly && isInactive){
            debouncingCallback();
        }
    },[isInactive]);

    const onChange = async (
        e?: React.ChangeEvent<HTMLInputElement>,
        callBack?: (e?: React.ChangeEvent<HTMLInputElement>)=>any
    )=>{
        if (callBack)
            await callBack(e);

        setIsInactive(prev=> prev? false: prev);
        clearTimeout(inactivityTimeout.current);

        inactivityTimeout.current = setTimeout(()=>{
            setIsInactive(true);
            inactivityTimeout.current = undefined;
        }, timings.inactivityTimeout);
    }
    return {
        onChange,
        isActive: useInactivityOnly!==undefined
            ? !isInactive
            : !!debouncingInterval.current
    }
}