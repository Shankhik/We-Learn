"use client";

import { ApiError } from "../serverUtils/apiError";
import { RefObject, useRef } from "react";

export default function useSearch(controller?: RefObject<AbortController|null>){
    const controllerRef = useRef(controller?.current??null);

    const search = async <T extends unknown>(endpoint: string): Promise<{
        response?: Response,
        data?: T,
        error?: ApiError
    }>=>{

        // Cancels prev requests
        if (controllerRef.current)
            controllerRef.current.abort();

        const controller = new AbortController();
        controllerRef.current = controller;
        
        try {
            const response = await fetch(endpoint,{
                method:"GET",
                signal: controller.signal,
            });

            const data = await response.json();
            //console.log("Searched:",data.data)
            if (data.error) throw new ApiError(data.error);
            return {
                response,
                data: data as T
            };
        } catch (error:any) {
            // Skips abort error
            if (error.name==="AbortError"){
                return {
                    response: undefined,
                    data: undefined
                };
            }
            return {
                error: error as ApiError
            }
        }
    }
    return search
}