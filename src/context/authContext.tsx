'use client';

import { useContext, createContext, useState, ReactNode, useEffect, useRef, use, useMemo,} from "react";
import verifyUser from "./server-actions/verify";

// auth Context all data
type Credential = NonNullable<Awaited<ReturnType<typeof verifyUser>>>

export type AuthContextType = {
    verified: boolean;
    updateAuth: (options?:{
        force: boolean,
        justLoggedOut?: boolean
    })=>void;
} & Partial<Credential>;

type AuthContextType_Original ={
    verified: boolean;
    // authMounted: boolean;
    username?: string;
    email?: string;
    displayName?: string;
    profilePicture?: number|null;
    admin?: boolean;
    updateAuth: (options?:{
        force: boolean,
        justLoggedOut?: boolean
    })=>void;
}

export const authContext = createContext<AuthContextType>({
    verified: false,
    updateAuth: ()=>{}
});

type ProviderProps = {
    children?: React.ReactNode,
    userCredentialsPromise?: ReturnType<typeof verifyUser>
}
export const AuthProvider=({children, userCredentialsPromise} :ProviderProps)=>{
    const userCredential = userCredentialsPromise
    ? use(userCredentialsPromise)
    : null;

    // console.log(userCredential)

    // console.log("Is admin?", userCredential?.admin)
    const [trigger, setTrigger] = useState<boolean>(false);
    const isFirstRender = useRef(true);
    const fetchCurrent = useRef<boolean>(false);
    const justLoggedOut = useRef<boolean>(false);
    
    const updateAuth :AuthContextType['updateAuth']= (options?:{
        force: boolean, justLoggedOut?: boolean,
    }):void => {
        if (options?.justLoggedOut) justLoggedOut.current = true;
        if (options?.force) fetchCurrent.current = true;
        setTrigger(prev => !prev);
    }
    
    const failedData = useMemo(()=>({
        verified: false,
        // username: undefined,
        // email: undefined,
        // admin: undefined,
        // displayName: undefined,
        // profilePicture: undefined,
        updateAuth
    } satisfies AuthContextType),[updateAuth]);

    const [authValue, setAuthValue] = useState<AuthContextType>({
        // Initializing from promise awaited data
        verified: userCredential?.username!==undefined && userCredential.username!=="",
        // username: userCredential?.username,
        // admin: userCredential?.admin,
        // email: userCredential?.email,
        // displayName: userCredential?.displayName,
        // profilePicture: userCredential?.profilePicture,
        ...userCredential,
        // Context Specific
        updateAuth: updateAuth,
    });

    useEffect(()=>{
        const fetchData = async ()=>{
            // Skips onMount call as its now initialized using SSR
            if (isFirstRender.current){
                isFirstRender.current = false;
                return;
            }

            // For Just Logged Out
            // -> So that it doesn't make a API call again
            if (justLoggedOut.current){
                justLoggedOut.current = false;
                fetchCurrent.current = false;
                setAuthValue(failedData);
                return;
            }

            // AUTH_TOKEN cookie will be collected from req headers cookie
            const userCred = await verifyUser (undefined, fetchCurrent.current);
            
            /* - - - - - - - - Old Version - - - - - - - - 
            const userCred = await verifyUser (undefined,{
                fetchCurrent: fetchCurrent.current
            });
            - - - - - - - - - - - - - - - - - - - - - - - */
            
            // resets
            fetchCurrent.current = false;

            // If no user-credentials found
            if (!userCred) {
                setAuthValue(failedData);
                return;
            }

            setAuthValue({
                verified: true,
                updateAuth: updateAuth,
                ...userCred
            })
        }
        fetchData();
    },[trigger])
    
    return(
        <authContext.Provider value={authValue}>
            {children}
        </authContext.Provider>
    )
}
export const useAuthContext = ()=> useContext (authContext)