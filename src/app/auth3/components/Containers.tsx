"use client";

import moduleStyle from "./Containers.module.css"
import ModuleClassname from "@/lib/cssUtil"

import { MessageBox } from "./Elements"
import { useMemo } from "react"

type MessageBoxProps = React.ComponentProps<typeof MessageBox>

type Props = React.ComponentProps<'div'> & {
    children?: React.ReactNode,
    page?: number,
    message: MessageBoxProps['message'],
    setMessage: React.Dispatch<React.SetStateAction<MessageBoxProps['message']>>,
    confirmOnClick?: ()=>any|Promise<any>
}
export function MainContentContainer ({
    children, page, message, setMessage, confirmOnClick, ...props
}:Props){
    page = page??1;
    const css = new ModuleClassname(moduleStyle)
    // const errorMessage = useMemo(()=>message,[message])
    return <>
    <div {...props} className={css.names(`main-content-container`)}>
        <div className={css.names(`pages-container`)} style={{translate:`-${(page-1)*100}% 0`}}>
            {children}
        </div>
    </div>
    <div className={css.names(`page-note ${message?"show":""}`)} onClick={()=>setMessage(null)}>
        <MessageBox message={message} confirmOnClick={async()=>{
            if (confirmOnClick)
                await confirmOnClick();
            else
                setMessage(null);
        }}/>
    </div>
    </>
}