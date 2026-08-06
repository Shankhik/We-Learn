"use client";

import { useColorContext } from "@/context/colorScheme";
import moduleStyle from "./PageElements.module.css";
import { Heading as UIHeading } from "@/components/htmlElements/Texts"
import Link from "next/link";

type WithChildren<T extends unknown = {}> = T & {
    children?: React.ReactNode
}
export const Heading = ({children, style, ...props}: WithChildren<React.ComponentProps<typeof UIHeading>>)=>{
    return <UIHeading style={{
        marginBottom:"10px",...style
    }} {...props}>
        {children}
    </UIHeading>
}
export const Anchor = ({children, href, style, title, inApp}:WithChildren<{
    href: string,
    title?:string,
    style?: React.CSSProperties,
    inApp?: boolean
}>)=>{
    const {effectiveTheme} = useColorContext();
    return inApp?
    <Link className={`${moduleStyle['anchor']} ${moduleStyle[effectiveTheme]}`}
    style={style} title={title} href={href}>
        {children}
    </Link>:
    <a className={`${moduleStyle['anchor']} ${moduleStyle[effectiveTheme]}`}
    style={style} title={title} href={href} target="_blank">
        {children}
    </a>
}
export const Paragraph = ({
    children, isLast, fontSize
}: WithChildren<{
    fontSize?: string,
    isLast?: boolean
}>)=>{
    return <p style={{
        marginBottom: `${isLast?20:10}px`,
        fontSize: fontSize
    }}>
        {children}
    </p>
}