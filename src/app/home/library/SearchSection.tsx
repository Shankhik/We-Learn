'use client';

import moduleStyle from "./SearchSection.module.css";

import useClassname from "@/lib/hooks/useClassname";
import { CSSProperties, use, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/buttons/NewButton";
import { useScreenDimension } from "@/context/screenWidth";
import { useColorContext } from "@/context/colorScheme";
import { colorScheme } from "@/lib/color/appColors";
import { BackIcon } from "@/components/icons/Icons";
import { PageContext } from "./PageContext";

type Token = {
    type: 'channel'|'tag',
    token: string
}
type SearchSectionProps = AsyncPageProps<'channel'|'tag'|'query'>['searchParams']

type Suggestion = {
    query: string
}

type SearchResult = {
    courses: {/*
        -> show all courses with profiles and tags
    */}[],
    profiles: { /*
        -> shows all similar named profiles [if no profile is tagged]
        -> shows only tagged profiles if found
    */}[],
    tags: {/*
        -> shows all similar named profiles [if no profile is tagged]
    */}[]
}

export default function SearchSection ({
    params
}: { params ?: SearchSectionProps}) {

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const css = useClassname(moduleStyle);
    const { returnOnTheme } = useColorContext();


    const router = useRouter();
    
    // Library Contexts
    const { search } = useContext(PageContext);

    // const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

    const [results, setResults] = useState<SearchResult|null>({
        courses:[], profiles:[], tags:[]
    });

    const refInput = useRef<HTMLInputElement>(null);
    const refSearch = useRef<HTMLButtonElement>(null);

    

    const [isEmpty, setIsEmpty] = useState(true);

    const tokenRegex = useMemo(()=> ({
        withSpace: /(?:^|\s)([@#][A-Za-z0-9_-]*)\s+$/,
        withSpace2: /([@#][A-Za-z0-9_-]*)\s+$/,
        withoutSpace: /(?:^|\s)([@#][A-Za-z0-9_-]*)$/,
        withoutSpace2: /([@#][A-Za-z0-9_-]*)$/,
        "@": /^@/, "#": /^#/
    }),[]);

    const onClickSearch = ()=>{
        if (!search.show) { search.setShow(true); return; }
        if (!refInput.current) return;
        
        const params = new URLSearchParams(searchParams);
        
        const newTokens: Token[] = [];

        const value = refInput.current.value
        .replace(/(^|\s)([@#][a-zA-Z0-9_-]*)+/g, (_, space, token: string) => {
            newTokens.push({
                type: token.startsWith("@") ? "channel" : "tag",
                token: token.slice(1),
            });
            return space;
        }).replace(/\s+/g, " ").trim();
        params.delete("channel");
        params.delete("tag");
        params.delete("query");
        
        if (refInput.current.value)
            params.append("query", refInput.current.value);
        
        search.tokens.forEach(v=>{
            params.append(v.type, v.token);
        });

        newTokens.forEach(v=>{
            params.append(v.type, v.token);
        });

        search.setTokens(prev=>([
            ...prev,
            ...newTokens
        ]))

        refInput.current.value = value;
        
        if(params.size)
        router.push(`${pathname}?${params.toString()}`);
    }
    

    const onChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        // console.log(e.target.value)
        let value = e.currentTarget.value
        if (value){
            setIsEmpty(prev=> !prev? prev: false)
        }else{
            setIsEmpty(prev=> prev? prev: true)
        }
        if (!value.endsWith(" ")) return;
        const matched = value.match(tokenRegex.withSpace2);

        if (matched && matched.at(1)){
            search.pushToken({
                type: tokenRegex["#"].test(matched.at(1) as string)? "tag":"channel",
                token: matched.at(1) as string
            })
            e.currentTarget.value = value.slice(0, matched.index)
        }
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>)=>{
        if (e.key === "Enter"){
            if (!refInput.current || !refSearch.current) return;
            
            const matched = e.currentTarget.value.match(tokenRegex.withoutSpace2);
            if (matched && matched.at(1)){
                search.pushToken({
                    type: tokenRegex["#"].test(matched.at(1) as string)? "tag":"channel",
                    token: matched.at(1) as string
                })
                refInput.current.value = refInput.current.value.slice(0,matched.index)
            }else refSearch.current.click();
        }
    }
    const onClickClear = ()=>{
        if (!refInput.current) return;
        refInput.current.value = "";
        setIsEmpty(true);
        // search.setShow(false);
        search.setTokens([]);
        // setSuggestions([]);
    }

    const styleSearchButton: CSSProperties = useMemo(()=>({
        marginLeft:"auto",
        borderRadius: search.show? "10px":"20px"
    }),[search.show]);

    const styleSearchBar: CSSProperties = useMemo(()=>({
        color: "inherit",
        backgroundColor: returnOnTheme("rgba(255, 255, 255, 0.23)","rgba(110, 111, 150, 0.15)")
    }),[returnOnTheme]);

    const styles = useMemo(()=>({
        searchButton: styleSearchButton,
        searchBar: styleSearchBar
    }),[styleSearchButton, styleSearchBar]);

    return <>
    <div className={css.names(`search-bar-section ${search.show?"center":""}`)}>
        
        <div className={css.names(`filters ${search.show && search.tokens.length?"":"hide"}`)}>{
            search.tokens.map((val, index)=> (
                <Tokens key={index} type={val.type}
                onClick={()=>search.popToken(index)}
                >{val.token}</Tokens>
            ))
        }</div>

        <div style={{
            display:"flex", marginLeft:"10px", gap:"7px", maxHeight:"40px",
            flexShrink:"1", minWidth:'0px'
        }}>
            <SearchButton ref={refSearch}
            onClick={onClickSearch}
            style={styles.searchButton}/>

            <HideButton hidden={!search.show}
            onClick={()=>search.setShow(false)}/>
        </div>

        <div className={css.names(`search-bar ${!search.show?"hide":''}`)}
        style={styles.searchBar}>
            <input type="text" ref={refInput} defaultValue={search.query}
            onChange={onChange} onKeyDown={onKeyDown}/>
            <CloseButton show={search.show} onClick={onClickClear}/>
            {/* <SuggestionsContainer show={search.show} suggestions={suggestions}/> */}
        </div>
        
    </div>
    
    <div className={css.names(`content-container ${!search.show? "hide":''}`)}>Search Section</div>
    </>
}

const SuggestionsContainer = ({suggestions, show}:{
    suggestions: Suggestion[], show: boolean
})=>{
    const css = useClassname(moduleStyle);
    const {returnOnTheme} = useColorContext();
    return <>
    <div className={css.names(`suggestions`)}
    style={{
        backgroundColor: returnOnTheme(
            "rgba(255, 255, 255, 0.23)",
            "rgba(110, 111, 150, 0.15)"
        ),
        opacity: show?1:0,
        pointerEvents: !show || suggestions.length===0
            ? "none": undefined
    }}>{
        suggestions.map((s, index)=>(
            <SuggestionItem key={index} {...s}/>
        ))
    }</div>
    </>
}
const SuggestionItem = ({query}: Suggestion)=>{
    const css = useClassname(moduleStyle);
    const {effectiveTheme, returnOnTheme} = useColorContext();
    const [isHovered, setIsHovered] = useState(false);
    return <>
    <div style={{
        backgroundColor: isHovered? returnOnTheme(
        "rgba(74, 92, 255, 0.15)", "rgba(217, 217, 255, 0.15)"
        ): undefined
    }} className={css.names(`suggestion-item`)}
    onMouseEnter={()=>setIsHovered(true)}
    onMouseLeave={()=>setIsHovered(false)}
    >{query}</div>
    </>
}
const HideButton = ({
    children, style, hidden, ...props
}: React.ComponentProps<typeof Button>)=>{
    const { returnOnTheme } = useColorContext();

    // const {width, height} = useScreenDimension()
    return <>
    <Button style={{
        fontSize:"0.9rem",
        alignSelf:"center",
        width: hidden? "0px":"20px", height:"20px",
        opacity: hidden? 0:1,
        padding: "0", color: "rgb(214, 216, 255)",
        backgroundColor: "transparent",
        transition: "all 0.3s ease",
        ...style,
    }} {...props}>
        <BackIcon strokeWidth={6} width="100%" height="100%"
        fill={returnOnTheme(
            "rgba(123, 132, 172, 0.8)",
            "rgba(93, 99, 124, 0.8)",
        )}
        style={{rotate: "180deg"}}/>
    </Button>
    </>
}
const SearchButton = ({
    children, style, ...props
}: React.ComponentProps<typeof Button>)=>{
    const { effectiveTheme } = useColorContext();
    const icon = useMemo(()=>(
        <svg xmlns="http://www.w3.org/2000/svg" fill="rgba(187, 200, 255, 0.8)"
        width="50%" height="100%" viewBox="0 -960 960 960">
        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 
        75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 
        0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
    ),[])
    // const {width, height} = useScreenDimension()
    return <>
    <Button style={{
        position:"relative",
        fontSize:"0.9rem", width:"40px", height:'40px',
        padding: "0",
        color: "rgb(214, 216, 255)",
        backgroundColor: colorScheme.accent.blue[effectiveTheme],
        ...style
    }} {...props}>{icon}</Button>
    </>
}

const CloseButton = ({
    children, style, show, ...props
}: React.ComponentProps<typeof Button> & {
    show?: boolean
})=>{
    const { returnOnTheme } = useColorContext()
    const icon = useMemo(()=>(
    <svg xmlns="http://www.w3.org/2000/svg"
    height="100%" viewBox="0 -960 960 960" width="100%"
    fill={returnOnTheme("rgba(53, 47, 90, 0.37)", "rgba(214, 211, 247, 0.36)")}>
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
    </svg>),[returnOnTheme]);

    return <>
    <Button style={{
        opacity: show? 1:0, backgroundColor:"transparent",
        pointerEvents: !show?"none":undefined,
        width:"20px", height:"20px", flexShrink:0,
        padding: "0", margin:"auto 0 auto 10px",
        ...style
    }} {...props}>{icon}</Button>
    </>
}
const Tokens = ({children, type, onClick}:{
    children: React.ReactNode,
    type: "channel"|"tag", onClick?:()=>void
})=>{
    const { returnOnTheme } = useColorContext();

    const colorStyles: CSSProperties = useMemo(()=>({
        border: `2px solid ${type === "channel"
        ? returnOnTheme("rgb(149, 140, 218)", "rgb(44, 45, 82)")
        : returnOnTheme("rgb(115, 163, 165)", "rgb(37, 63, 70)")}`,
        background: `linear-gradient(10deg, ${ type === "channel"
            ? returnOnTheme(
                "rgba(108, 130, 255, 0.1), rgba(0, 68, 255, 0.2)",
                "rgba(26, 40, 87, 0.43), rgba(153, 146, 255, 0.21)"
            ): returnOnTheme (
                "rgba(164, 243, 230, 0.25), rgba(61, 177, 192, 0.46)",
                "rgba(3, 151, 151, 0.1), rgba(3, 151, 151, 0.29)"
            )
        })`
    }),[type, returnOnTheme]);
    return <>
    <div style={{
        fontSize: "0.8rem",
        height: "fit-content", padding:"2px 7px",
        borderRadius:"10px",
        display:"flex",
        ...colorStyles,
        cursor: "default"
        // border
    }}>{type==="channel"?"@":"#"}{children}
    <span style={{
        margin: "auto 0 auto 5px", cursor:"pointer",
        width:"10px", height:"10px", aspectRatio:"1/1",
        borderRadius:"50%", backgroundColor:"rgba(255, 26, 26, 0.5)"
    }} onClick={onClick}/></div>
    </>
}