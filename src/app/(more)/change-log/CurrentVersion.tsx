"use client";

import { useColorContext } from "@/context/colorScheme";
import globalStyle from "./globalStyle.module.css";
import ModuleClassname from "@/lib/cssUtil";
import { ParseMarkdown } from "@/lib/htmlParser";
import { useMemo } from "react";

import type { Changelog as ChangelogType } from "@/types/databaseTypes";
type Props = ChangelogType
export default function CurrentVersion({content, version, pushDate}:Props){
    const css = new ModuleClassname(globalStyle);
    const { effectiveTheme } = useColorContext();
    
    const classnames = useMemo(()=>{
        return {
            sectionHeading: css.names("section-heading text-clip shadow"),
            paragraph: css.names("section-text"),
            listItem: css.names("section-text li-margin")
        }
    },[globalStyle]);
    // document.body.innerHTML= "hello"
    const renderer: Exclude<
        React.ComponentProps<typeof ParseMarkdown>['renderer'],
        undefined
    > = {
        heading({tokens, depth}){
            // If subheading
            if(depth===2){
                return `<h2 class="${classnames.sectionHeading}">${
                    this.parser.parseInline(tokens)
                }</h2>`
            }
            // Default Parsing
            return false;
        },
        paragraph({tokens, raw, text, type}){
            //console.log(tokens)
            return `<p class="${classnames.paragraph}">${this.parser.parseInline(tokens)}</p>`
        },
        list(token){
            // const body = this.parser.parse(token.items)
            const body = token.items.map(item=>{
                return this.parser.renderer.listitem(item)
            })
            return `<ul style="list-style-type: circle; margin-bottom: 7px">${body.join("")}</ul>`;
        },
        listitem({tokens}){
            return `<li class="${classnames.listItem}">${this.parser.parseInline(tokens)}</li>`
        }
    }

    return <>
    <div style={{}} className={css.names(`top-box ${effectiveTheme}`)}>
        <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
            <h1 className={css.names(`version ${effectiveTheme} text-clip shadow`)}
            style={{}}>
                ver {version}
            </h1>
            <h4 className={globalStyle['push-date']}>{getDate(pushDate)}</h4>
        </div>
        
        <ParseMarkdown renderer={renderer} content={content}/>
    </div>
    <DemoChangelog hide css={css} effectiveTheme={effectiveTheme}/>
    
    </>
}

const DemoChangelog = ({css, effectiveTheme, hide}:{
    css: ModuleClassname,
    effectiveTheme: "light"|"dark",
    hide?: boolean
})=>{
    if (process.env.NODE_ENV!=="development" || hide) return null;
    return <>
    <div style={{whiteSpace:"preserve-breaks"}} className={css.names(`top-box ${effectiveTheme}`)}>
        <h1 className={css.names(`version ${effectiveTheme} text-clip shadow`)}
        style={{margin:"0 auto 20px auto"}}>
            Version 1.0.0
        </h1>
        <SectionHeading>Clean UI</SectionHeading>
        <SectionText>
            This version comes with a fresh look which the users will definitely like. 
            Removed the accent colors; now the UI color is mostly the same with some color variants in certain components in certain pages. 
        </SectionText>
        <SectionText>
            UI components visual consistency is heavily improved from the previous version and 
            other visual inconsistencies will be fixed on the later updates if found.
        </SectionText>

        <SectionHeading>Better Performance</SectionHeading>
        
        {/* Memory Sub Section */}
        <SectionText bottomMargin="0px">
            <strong><u>Memory Usage</u></strong> of the app has been optimized significantly by:<br/>
        </SectionText>
        <ul style={{listStyleType:"disc"}}>
            <SectionText type="list-item" bottomMargin="0px">using garbage collectable code.</SectionText>
            <SectionText type="list-item">removing memory leaks in code.</SectionText>
        </ul>

        {/* Caching Section */}
        <SectionText bottomMargin="0px">
            <strong><u>Caching</u></strong> is used for getting faster data fetching making the app fast in delivering content for user. 
            Users will definitely feel the difference.
        </SectionText>

        <SectionHeading>Improved Security</SectionHeading>
        <SectionText>
            Overall security of the app has been improved; though the users may not notice them. 
            The app's security is constantly being worked on.
        </SectionText>
    </div>
    </>
}
const getDate = (date: Date)=>{
    function getOrdinal(n:number) {
        if (n > 3 && n < 21) return 'th';
        switch (n % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    const day = date.getDate();
    const suffix = getOrdinal(day);

    const month = new Intl.DateTimeFormat('en-IN', {
        month: "short",
    }).format(date);

    return `${day}${suffix} ${month}, ${date.getFullYear()}`;
}
const ListItem = ({children}:{
    children:React.ReactNode
})=>{
    return <span style={{whiteSpace:"pre"}}>     ● {children}</span>
}
const SectionHeading = ({children}:{
    children: React.ReactNode
})=>{
    const css = new ModuleClassname(globalStyle);
    return <>
    <h2 className={css.names(`section-heading text-clip shadow`)}>{children}</h2>
    </>
}
const SectionText = ({children, type, bottomMargin}:{
    children: React.ReactNode,
    type?: 'paragraph'|"list-item",
    bottomMargin?: `${number}px`
})=>{
    const css = new ModuleClassname(globalStyle);
    return type==="list-item"?
    <li className={css.names(`section-text`)} style={{marginBottom: bottomMargin}}>
        {children}
    </li>:
    <p className={css.names(`section-text`)} style={{marginBottom: bottomMargin}}>
        {children}
    </p>
}