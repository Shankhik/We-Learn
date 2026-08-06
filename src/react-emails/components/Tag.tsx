import { ComponentProps } from "react";
import { EmailProps } from "./Types";

const Tag = ({
    children, style, ...props
}:ComponentProps<'span'>)=>{
    if (!children) return null;
    return <>
    <span {...props} style={{
        ...style
    }}>{children}</span>
    </>
}

export default Tag;