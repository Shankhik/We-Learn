import { useCallback } from "react";
import {
    Link as EmailLink, LinkProps,
    Text as EmailText, TextProps,
    Heading as EmailHeading, HeadingProps,
    Hr as EmailHr, HrProps
} from "react-email";

// export {
//     LinkProps, TextProps, HeadingProps,
// }

export function Link({
    children, color, style, ...props
}: LinkProps){
    return <>
    <EmailLink {...props}
        style={{
            fontSize: "0.9rem", color: color || "inherit",
            ...style
        }}
    >{children}</EmailLink>
    </>
}

export function Text ({
    children, style, ...props
}: TextProps){
    return <EmailText
        style={{
            fontSize: "0.9rem",
            ...style
        }}
        {...props}
    >
        {children}
    </EmailText>
}

export function Heading ({
    children, style, ...props
}: HeadingProps){
    return <>
    <EmailHeading {...props}
        style={{
            fontSize: "1.7rem",
            ...style
        }}
        >{children}</EmailHeading>
    </>
}

export const Hr = ({
    style, color, ...props
}:HrProps)=>{
    return <>
    <EmailHr {...props} style={{
        margin: "15px 0",
        border: "none",
        borderTop: `1px solid ${color||"rgb(214, 217, 233)"}`,
        ...style
    }}/>
    </>
}