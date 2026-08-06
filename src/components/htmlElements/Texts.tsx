'use client';

import globalStyle from "./global.module.css"
import { useColorContext } from "@/context/colorScheme";
import { colorScheme } from "@/lib/color/appColors";
import ModuleClassname from "@/lib/cssUtil";

export const Hr = ({replaceClassname, themeColor, style, ...props}:
    React.ComponentProps<'hr'> & {
    replaceClassname?: boolean,
    themeColor?:{
        light?: string, dark?: string
    }
})=>{
    const {effectiveTheme} = useColorContext();
    const css = new ModuleClassname(globalStyle);
    const classnames = {
        append: `${css.names(`hr ${effectiveTheme}`)} ${props.className}`,
        replace: props.className,
    };
    return <>
    <hr
        {...props}
        style={{
            ...style,
            ...(themeColor?{
                backgroundColor: themeColor[effectiveTheme]||''
            }:{})
        }}
        className={replaceClassname?
            classnames.replace:classnames.append
        }
    />
    </>
}
export const H1 = ({children, replaceClassname, ...props}:
    React.ComponentProps<'h1'> & {
    children?: React.ReactNode,
    replaceClassname?: boolean
})=>{
    const {effectiveTheme} = useColorContext();
    const css = new ModuleClassname(globalStyle);
    const classnames = {
        append: `${css.names(`h1 ${effectiveTheme}`)} ${props.className}`,
        replace: props.className,
    };
    return <>
    <h1 
        {...props}
        className={replaceClassname?
            classnames.replace:classnames.append
        }
    >
        {children}
    </h1>
    </>
}

export const Heading = ({children, removeTheme, ...props}:
    React.ComponentProps<'h2'> & {
    children?: React.ReactNode,
    removeTheme?: boolean
}) =>{
    const {effectiveTheme}= useColorContext();
    const css = new ModuleClassname(globalStyle);
    // const className = `${css.names(`heading ${removeTheme?'':effectiveTheme}`)} ${props.className}`;
    return <>
    <h2
        {...props}
        // className={className}
        style={{
            color: colorScheme.accent.blue[effectiveTheme],
            ...props.style
        }}
    >{children}</h2>
    </>
}