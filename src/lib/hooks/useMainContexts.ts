"use client";

import { useAuthContext } from "@/context/authContext";
import { useColorContext } from "@/context/colorScheme";

export default function useMainContexts (){
    const authContext = useAuthContext();
    const colorContext = useColorContext();
    return {
        ...authContext,
        ...colorContext
    }
}