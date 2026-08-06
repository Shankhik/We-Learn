'use client';

import { useEffect, useRef, useState } from "react";

type Options = {
    // During Initialization (doesn't make sense.. but still)
    defaultValue?: boolean,
    // During Initialization (doesn't make sense.. but still)
    defaultRatio?: boolean,
    // Exit it appears once on the viewport
    once?: boolean,
    // Viewport for comparison
    root?: Element,
    // Adds area to the viewport
    rootMargin?: string,
    // Fraction of Element needs to be visible [0,1]
    threshold?: number | number[]
}
export const useInViewport = <T extends HTMLElement = HTMLDivElement>(
    elementRef: React.RefObject<T|null> | null,
    options?:Options
) =>{
    const ref = elementRef??useRef<T>(null);
    const [isInViewport, setIsInViewport] = useState<boolean>(
        options?.defaultValue||false
    );
    const [intersectionRatio, setIntersectionRatio]= useState(options?.defaultRatio??0)

    useEffect(()=>{
        if (!ref.current) return;

        const observer = new IntersectionObserver(([entry])=>{
            setIntersectionRatio(entry.intersectionRatio)
            if(entry.isIntersecting){
                setIsInViewport(true);
                if(options?.once) observer.disconnect();
            }else if(!options?.once)
                setIsInViewport(false);
        },{
            root: options?.root||null,
            rootMargin: options?.rootMargin,
            threshold: options?.threshold
        });

        observer.observe(ref.current);
        return ()=>{
            observer.disconnect();
        }
    },[
        options?.defaultValue, options?.once,
        options?.root,options?.rootMargin,
        options?.threshold
    ]);

    // if (elementRef && elementRef.current!==null)
    //     return [isInViewport] as const;
    return {
        ref,
        isInViewport,
        intersectionRatio
    }
    //return [ref, isInViewport] as const;
}

type RefConfig = {
    ref: React.RefObject<Element>;
    defaultValue?: boolean,
    threshold?: number;
    root?: Element | null;
    rootMargin?: string;
};

type EntryState = {
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
};
// export const useMultipleInViewport = <T extends HTMLElement>(
//     refs: React.RefObject<T>[],
//     options?: Omit<Options, "defaultValue"|"once"> & {
//         initials ?: boolean[]
//     }
// )=>{
//     const [states, setStates] = useState<boolean[]>(()=>{
//         refs.forEach((element, index)=>{
//             //const i = 
//             return options?.initials?.at(index) ?? false
//         })
//     })

//     useEffect(()=>{
//         //if (!ref.current) return;

//         const observer = new IntersectionObserver(([entry])=>{
//             if(entry.isIntersecting){
//                 setIsInViewport(true);
//                 if(options?.once) observer.disconnect();
//             }else if(!options?.once)
//                 setIsInViewport(false);
//         },{
//             root: options?.root||null,
//             rootMargin: options?.rootMargin,
//             threshold: options?.threshold
//         });

//         observer.observe(ref.current);
//         return ()=>{
//             observer.disconnect();
//         }
//     }, [refs])
// }
function useMultiIntersectionObserver(configs: RefConfig[]) {
    const [states, setStates] = useState<boolean[]>(
        configs.map((c) => c.defaultValue?? false)
    );

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        configs.forEach((config, index) => {
        const {ref, threshold, root, rootMargin} = config

        if (!config.ref.current) return;

        const observer = new IntersectionObserver(([entry]) => {
            setStates((prev) => {
                const updated = [...prev];
                updated[index] = entry.isIntersecting;
                return updated;
            });
        },
            { threshold, root, rootMargin }
        );

        observer.observe(ref.current);
        observers.push(observer);
        });

        return () => {
            observers.forEach((observer) => observer.disconnect());
        };
    }, [configs]);

    return states;
}