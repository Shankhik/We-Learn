"use client";

import { createContext, Dispatch, SetStateAction, use, useCallback, useEffect, useMemo, useRef, useState } from "react"

type Token = {
    type: 'channel'|'tag',
    token: string
}

type PageContext = {
    search: {
        query: string,

        tokens: Token[],
        setTokens: Dispatch<SetStateAction<Token[]>>,
        pushToken: (token: Token)=> void,
        popToken: (index: number)=> void
        show: boolean,
        setShow: React.Dispatch<React.SetStateAction<boolean>>
    }
}
export const PageContext = createContext<PageContext>({
    search: {
        query: "",
        tokens: undefined as any,
        setTokens: undefined as any,
        pushToken: undefined as any,
        popToken: undefined as any,
        show: false,
        setShow: function (value: SetStateAction<boolean>): void {
            throw new Error("Function not implemented.");
        }
    }
})

export default function PageContextProvider ({children, searchParamsPromise}:{
    children?: React.ReactNode,
    searchParamsPromise: AsyncPageProps<'channel'|'tag'|'query'>['searchParams']
}) {

    const searchParams = use(searchParamsPromise);
    const initialized = useRef({
        tokens: false
    });

    const [showSearch, setShowSearch] = useState(
        searchParams.query ||
        searchParams.channel ||
        searchParams.tag ? true: false
    );
    const query = useMemo(()=>{
        if (typeof searchParams.query === "object")
            return searchParams.query.at(0) ?? '';
        return searchParams.query ?? ''
    },[searchParams.query]);

    const [tokens, setTokens] = useState<Token[]>(generateTokens(searchParams));
    useEffect(()=>{
        if(!initialized.current.tokens)
            initialized.current.tokens = true;
        else    
            setTokens(generateTokens(searchParams));
    },[searchParams]);

    const pushToken = useCallback((value: (typeof tokens)[number])=>{
        if (value.token.length===1) return;
        setTokens(prev=>[
            ...prev,
            {type: value.type, token: value.token.slice(1)}
        ]);
    },[]);

    const popToken = useCallback((index: number)=>{
        setTokens(prev=>{
            prev.splice(index, 1);
            return [...prev]
        });
    },[]);
    return <PageContext.Provider value={{
        search: {
            show: showSearch, setShow: setShowSearch,
            tokens, setTokens, pushToken, popToken,
            query
        }
    }}>{children}</PageContext.Provider>
}

const generateTokens = (searchParams: Awaited<AsyncPageProps<'channel'|'tag'|'query'>['searchParams']>)=>{
    const tokens: Array<Token> = [];
    if (searchParams.channel){
        if (typeof searchParams.channel === "string") tokens.push({
            type: "channel",
            token: searchParams.channel
        });
        else {
            searchParams.channel.map(value=>{
                tokens.push({
                    type: "channel",
                    token: value
                });
            })
        }
    }
    if (searchParams.tag){
        if (typeof searchParams.tag === "string") tokens.push({
            type: "tag",
            token: searchParams.tag
        });
        else {
            searchParams.tag.map(value=>{
                tokens.push({
                    type: "tag",
                    token: value
                });
            })
        }
    }

    return tokens;
}