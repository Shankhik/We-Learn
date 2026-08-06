"use client";

import ModuleClassname from "@/lib/cssUtil";
import moduleStyle from "./Element.module.css";
import { useColorContext } from "@/context/colorScheme";
import { useMemo, useRef, useState } from "react";
import Button from "@/components/buttons/NewButton";
import { BackIcon } from "@/components/icons/Icons";
import { colorScheme } from "@/lib/color/appColors";

type ButtonProps = React.ComponentProps<typeof Button>;

type ActionButtonProps = Pick<ButtonProps,
    'onClick'|'showLoading'|'disabled'|'style'|'disabledStyle'|'children'|'href'|'ref'
> & {
    bgColor?: {
        light?: string,
        dark?: string
    },
    disabledBgColor?: {
        light?: string,
        dark?: string
    },
};

export const ActionButton = ({
    children, bgColor, disabledBgColor, style, disabledStyle, ...props
}:ActionButtonProps)=>{
    const {effectiveTheme} = useColorContext();
    // props -> onClick, showLoading & disabled
    const colors = useMemo(()=>({
        light: {
            normal: bgColor?.light || colorScheme.accent.blue.light,
            disabled: disabledBgColor?.light || "rgba(29, 30, 36, 0.38)"
        },
        dark: {
            normal: bgColor?.dark || colorScheme.accent.blue.dark,
            disabled: disabledBgColor?.dark || "rgba(83, 79, 100, 0.11)"
        }
    }),[
        effectiveTheme,
        bgColor,//?.dark, bgColor?.light,
        disabledBgColor//?.light, disabledBgColor?.dark
    ]);

    type ButtonStyle = Pick<React.ComponentProps<typeof Button>,'style'|'disabledStyle'>
    
    const buttonStyle: ButtonStyle = useMemo(()=>({
        style:{
            minWidth: "100px",
            color: "rgba(255, 255, 255, 0.8)",
            borderRadius:"10px",
            flex: "1 0 100px",
            boxShadow: "0 1px 10px -5px rgba(0, 0, 0, 0.1)",
            ...style,
            background: colors[effectiveTheme].normal,
        },
        disabledStyle:{
            ...disabledStyle,
            background: colors[effectiveTheme].disabled
        }
    }),[colors, style, disabledStyle]);

    return<>
    <Button {...props} {...buttonStyle}>{children}</Button>
    </>
}

type BackButtonProps = Omit<ButtonProps,'disabled'> & {
    isActive: boolean,
    onClick?: ()=> any|Promise<any>
}
export const BackButton = ({
    isActive, onClick, style, hoverStyle, ...props
}:BackButtonProps)=>{
    const { effectiveTheme } = useColorContext()
    const colors = useMemo(()=>({
        light: {
            active: colorScheme.accent.blue.light,
            inActive: 'rgba(107, 111, 148, 0.32)'
        },
        dark: {
            active: colorScheme.accent.blue.dark,
            inActive: 'rgba(56, 54, 77, 0.46)'
        }
    }),[]);
        
    const backStyles:Pick<ButtonProps,'style'|'hoverStyle'|'disabledStyle'>  = {
        style: {
            display:"flex", justifyContent:"center", alignItems:"center",
            background: colors[effectiveTheme].active,
            width: "20px", height:"20px", padding:"0px",
            ...style
        },
        hoverStyle: {
            boxShadow: isActive?"0 1px 3px rgba(0, 0, 0, 0.49)":"",
            ...hoverStyle
        },
        disabledStyle: {
            background: colors[effectiveTheme].inActive,
            filter: "none",
            boxShadow: "none"
        }
    }

    return <Button {...backStyles} {...props} disabled={!isActive} onClick={onClick}>{
        <BackIcon height="12" width="12" fill="rgba(255, 255, 255, 0.6)"/>
    }</Button>
}

type TextInputProps = Omit<
    React.ComponentProps<"input">,
    'onChange'|'ref'|'onKeyDown'
    > & {
    label?: string,
    containerStyle?: React.CSSProperties,
    enterButtonRef?: React.RefObject<HTMLButtonElement|null>
    ref?: React.RefObject<HTMLInputElement|null>,
    onChange?: ()=> any | Promise<any>
}
export const TextInput = ({
    label, ref, onChange:onChangeExt,
    containerStyle, style, enterButtonRef, ...props
}: TextInputProps )=>{
    const css = new ModuleClassname(moduleStyle);
    const {effectiveTheme} = useColorContext();

    const [isActive, setIsActive] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    
    const refMain = ref || useRef<HTMLInputElement>(null);
    
    const onChange = async (e: React.ChangeEvent<HTMLInputElement>)=>{
        if (e.target.value !=="") setIsEmpty(false);
        else setIsEmpty(true);

        if (onChangeExt) await onChangeExt();
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>)=>{
        if (e.key === "Enter"){
            enterButtonRef?.current?.click();
            refMain.current?.blur()
        }
    }
    const styleInput:React.CSSProperties = useMemo(()=>({
        color: effectiveTheme === "light"
            ? "rgb(60, 66, 90)"
            : "rgb(223, 229, 255)"
        ,
        border: `2px solid ${isActive||(!isEmpty)
            ? colorScheme.accent.blue[effectiveTheme]
            : "transparent"
        }`,
        ...style
    }),[effectiveTheme, isActive, isEmpty]);

    const styleTitle: React.CSSProperties = useMemo(()=>({
        color: colorScheme.accent.blue[effectiveTheme],
        opacity: !isEmpty? 1:0
    }),[effectiveTheme, isActive, isEmpty]);

    return <>
    <div style={containerStyle} className={css.names(`container ${effectiveTheme}`)}>
        <input
            className={css.names(`text-input ${effectiveTheme} ${isActive||(!isEmpty)?"on":""}`)}
            ref={refMain} type="text" {...props}
            onKeyDown={onKeyDown}
            style={styleInput}
            onFocus={()=> setIsActive(true)} onBlur={()=>setIsActive(false)}
            onChange={onChange}
        />
        <h3 style={styleTitle}
            className={moduleStyle['input-title']}
            // className={!isEmpty ? moduleStyle["on"]:""}
        >{label}</h3>
    </div>
    </>
}

type MessageBoxProps = {
    style?: React.CSSProperties,
    message: {
        critical?: boolean,
        heading: string|React.ReactNode,
        body: string|React.ReactNode,  
        confirm?: string|React.ReactNode 
    }|null,
    confirmOnClick: (...args: any[])=> Promise<any>|any
}
export const MessageBox = ({
    style, message, confirmOnClick
}:MessageBoxProps)=>{
    const css = useMemo(()=> new ModuleClassname(moduleStyle),[moduleStyle])
    const { effectiveTheme }= useColorContext()
    
    const buttonBgColor = useMemo(()=>(
        colorScheme.accent[message?.critical?"red":"blue"][effectiveTheme]
    ),[effectiveTheme, message?.critical])
    return <>
    <div className={css.names(`message-box ${effectiveTheme} ${message?.critical?"critical":""}`)}
    style={style} onClick={(e)=> e.stopPropagation()}>
        <h1>{message?.heading}</h1>
        <p>{message?.body}</p>
        <Button style={{
            marginTop:"auto",
            backgroundColor: buttonBgColor,

            boxShadow:"none",
            color: "rgb(255, 255, 255)"
        }} onClick={confirmOnClick}>{message?.confirm||"OK"}</Button>
    </div>
    </>
}

type CheckBoxProps = React.ComponentProps<"input"> & { }
export const CheckBox = ({
    className, style, ...props
}:CheckBoxProps)=>{
    const css = useMemo(()=> new ModuleClassname(moduleStyle),[moduleStyle])
    const { effectiveTheme } = useColorContext()
    return <>
    <input {...props} className={css.names(`check-box ${effectiveTheme}`)} type={"checkbox"}
    style={{
        ...style
    }}/>
    </>
}