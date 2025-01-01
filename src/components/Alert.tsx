'use client'

import { relative } from 'path'
import './Alert.css'
import { CSSProperties, Dispatch, FC, ReactNode, SetStateAction, useEffect, useRef } from "react"

type AlertProp={
    close: Dispatch<SetStateAction<boolean>>,
    show: boolean,
    children: ReactNode,
    content?:ReactNode,
    style?: CSSProperties
}
const Alert = ({show,close,children,style,content}:AlertProp):JSX.Element=>{
    const element = {
        alertPage: useRef<HTMLDivElement|null>(null),
        alertBox: useRef<HTMLDivElement|null>(null)
    }

    // used for adding reference to children
    const AlertBox = ({children}:{children:ReactNode})=>{
        return (
            <div ref={element.alertBox} className='alert-box-wrapper'>
                {children}
            </div>
        )
    }

    useEffect(()=>{
        const handleOutsideClick = (e:globalThis.MouseEvent)=>{
            if (show && !element.alertBox.current?.contains(e.target as Node)){
                close(false);
            }
        }
        document.addEventListener('click',handleOutsideClick);
        return ()=>{
            document.removeEventListener('click',handleOutsideClick);
        }
    },[show])

    return(
        <div className={`alert-popup ${show?'enabled':'disabled'}`} style={style||{}} ref={element.alertPage}>
            <AlertBox>
                {children||content}
            </AlertBox>
        </div>
    )
}

export default Alert