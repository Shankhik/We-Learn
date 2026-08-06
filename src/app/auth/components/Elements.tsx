"use client";

import useClassname from "@/lib/hooks/useClassname";
import moduleStyle from "./Elements.module.css";
import { useColorContext } from "@/context/colorScheme";
import { useCallback, useMemo, useState } from "react";

import { colorScheme } from "@/lib/color/appColors";
import Button from "@/components/buttons/NewButton";
import LoadingAnimation from "@/components/loading/LoadingAnimation";
import StagesContainer from "./StagesContainer";

type CSS = React.CSSProperties;
type LoadingAnimationProps = React.ComponentProps<typeof LoadingAnimation>;
type ButtonProps = React.ComponentProps<typeof Button>;
type InputProps<T extends unknown = unknown> = React.ComponentProps<'input'> & T
type DivProps<T extends unknown = unknown> = React.ComponentProps<'div'> & T

/* - - - - - - - - - - - - - Reactive Elements - - - - - - - - - - - - - */
type StagesProps = {
    stages: {
        [key: string]: React.ReactNode
    }
    activeStage: number,
    style?: CSS
}
export const Stages = ({
    activeStage, stages, style
}: StagesProps)=>{
    
    const stagesCached = useMemo(()=>stages,[stages]);

    return <StagesContainer
        style={{
            margin:"0 0 15px 0",
            ...style
        }}
        stages={stagesCached}
        activeStage={activeStage}
    />
}

type InputFieldProps = Omit<InputProps<{
    containerProps?: DivProps,
    hideLine?: boolean,
    usePassword?: boolean,
    showLoading?: boolean,
    submitButtonRef?: React.RefObject<HTMLButtonElement|null>
}>,'onFocus'|'onBlur'>
export const InputField = ({
    children, containerProps, type, onChange,
    hideLine, usePassword, showLoading, submitButtonRef,...props
}:InputFieldProps)=>{
    const css = useClassname(moduleStyle);
    const { effectiveTheme, returnOnTheme } = useColorContext();

    const [showPwd, setShowPwd] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    
    const localOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
        setIsEmpty(e.target.value === "");
        if (onChange) onChange(e);
    },[onChange]);

    const show = useMemo(()=> isFocused || !isEmpty,[isFocused, isEmpty]);

    const checkTheme = useCallback(<T extends unknown = string>(arg1: T, arg2: T)=>{
        return effectiveTheme==='light'? arg1: arg2
    },[effectiveTheme]);
    
    const styles = useMemo(()=>({
        label: {
            color: show
                ? colorScheme.accent.blue[effectiveTheme]
                : checkTheme("rgb(127, 128, 153)","rgb(111, 113, 138)")
        } satisfies CSS,
        line: {
            position:"absolute", left: 0, bottom: 0,
            opacity: hideLine? 0:1,
            backgroundColor: colorScheme.accent.blue[effectiveTheme]
        } satisfies CSS,
        borderLine: {
            backgroundColor: checkTheme("rgb(158, 159, 187)","rgb(111, 113, 138)")
        } satisfies CSS,
        show

    }),[effectiveTheme, show, hideLine]);

    const propsLoadingAnimation: LoadingAnimationProps = useMemo(()=>({
        width:"20px", height:"20px",
        circleColors: {
            first: returnOnTheme("rgb(255, 73, 73)","rgb(226, 93, 93)"),
            second: returnOnTheme("rgb(81, 148, 111)","rgb(73, 199, 147)"),
            third: returnOnTheme("rgb(76, 111, 228)","rgb(73, 102, 199)")
        },
        style: {
            left:"100%", top:"50%", marginLeft:"20px",
            translate: "0 -50%",
            position:"absolute",
            opacity: showLoading?1:0,
            transition:"opacity 0.2s ease"
        }
    }),[effectiveTheme, showLoading]);

    return <>
    <div className={css.names(`field-container ${effectiveTheme} ${show?"on":""}`)}
    {...containerProps}>

        <label className={css.names(`label ${effectiveTheme} ${
            show?"on":""
        }`)} style={styles.label}>
            {children}
            <LoadingAnimation {...propsLoadingAnimation}/>
        </label>
        
        <div style={{display:"flex"}}>
            <input
                // Default Attribute
                className={css.names(`field ${effectiveTheme}`)}
                enterKeyHint={'done'}
                type={usePassword && !showPwd?'password': (type||'text')}
                onKeyDown={(e)=>{
                    if (submitButtonRef?.current){
                        if (e.key === "Enter")
                            submitButtonRef.current.click();
                    }
                }}
                // Add | Overwrite-Default attribute
                {...props}
                // Fixed Attributes
                onFocus={()=>setIsFocused(true)}
                onBlur={()=>setIsFocused(false)}
                onChange={localOnChange}
                
            />{ usePassword?
                <TooglePassword onClick={()=>setShowPwd(prev=>!prev)}
                    show={showPwd}
                    svgProps={{width:"70%",height:"100%"}}
                />:null
                // <ShowPassword irisColor="rgb(0,0,0)" width={"20px"}show={usePassword.show} toggle={usePassword.setShow}/>
                // : null
            }
            
        </div>
        
        <div style={styles.borderLine}className={css.names(`line on`)}/>
        <div style={styles.line}
        className={css.names(`line ${show?"on":""}`)}/>
    </div>
    </>
}

type TooglePasswordProps = Omit<ButtonProps, 'style'|'hoverStyle'|'disabledStyle'> & {
    show?: boolean,
    svgProps?: {
        width?:string|number, height?: string|number,
        irisFill?: string, fill?: {
            light?: string,
            dark?: string
        }, style?: CSS
    }
    buttonStyles?: Pick<ButtonProps,'style'|'hoverStyle'|'disabledStyle'>,
}
const TooglePassword = ({
    show, buttonStyles, svgProps,
    ...buttonProps
}:TooglePasswordProps)=>{
    const {effectiveTheme} = useColorContext();
    const svgFill = useMemo(()=>(
        svgProps?.fill?.[effectiveTheme] || colorScheme.form.grey[effectiveTheme]
    ),[svgProps?.fill]);
    return <>
    <Button style={{
        width:"25px", height:"25px",
        margin: "auto 0",
        padding: "0", backgroundColor: "transparent",
        ...buttonStyles?.style
    }} hoverStyle={{
        backgroundColor: colorScheme.getAlpha(svgFill, 0.2),
        ...buttonStyles?.hoverStyle
    }} disabledStyle={buttonStyles?.disabledStyle}{...buttonProps}>
    <svg
        width={svgProps?.width||"100%"}
        height={svgProps?.height||"100%"}
        viewBox="0 0 60 60"
        style={svgProps?.style}>        
        <g id="eye-svg-g" fill={svgFill}>
        <g id="iris">
            <path
                fill={svgProps?.irisFill || svgFill}
                fillOpacity="1"
                d="m 39.135712,26.723295 a 9.7232952,9.7232952 0 0 1 -9.708697,9.723284 9.7232952,9.7232952 0 0 1 -9.73785,-9.694087 9.7232952,9.7232952 0 0 1 9.679457,-9.752393 9.7232952,9.7232952 0 0 1 9.766914,9.664803"
            />
            <path
                fill='#ffffff'
                fillOpacity='0.4'
                d="m 34.991776,26.723295 a 5.5793595,5.5793595 0 0 1 -5.570983,5.579353 5.5793595,5.5793595 0 0 1 -5.587711,-5.562599 5.5793595,5.5793595 0 0 1 5.554204,-5.596057 5.5793595,5.5793595 0 0 1 5.604389,5.545797"
            />
        </g>
        <g id="open-lid" display={show?'none':'inline'}>
            <path
                d="M 54.007812,23.300781 C 49.242911,19.304019 41.456569,15 30,15 18.116534,15 10.182148,19.628788 5.4726562,23.744141 a 24.636532,11.373937 0 0 0 -0.2675781,1.68164 24.636532,11.373937 0 0 0 1.6367188,3.962891 C 11.655428,24.971232 19.18769,20.507812 30,20.507812 c 10.677745,0 18.151975,4.3539 22.972656,8.716797 1.670491,1.511858 3.028004,3.023845 4.082031,4.357422 C 59.025831,31.516872 60,30 60,30 60,30 58.138951,26.765947 54.007812,23.300781 Z M 6.8417969,29.388672 A 24.636532,11.373937 0 0 1 5.2050781,25.425781 24.636532,11.373937 0 0 1 5.4726562,23.744141 C 1.7054196,27.03611 0,30 0,30 c 0,0 0.97416914,1.516872 2.9453125,3.582031 1.0156945,-1.285077 2.3091045,-2.73663 3.8964844,-4.193359 z"
            />
            <g id="lashes" >
                <rect
                    width="5.5793595"
                    height="9.0219431"
                    x="-0.52897871"
                    y="13.111699"
                    rx="3"
                    transform="rotate(-29.244803)"
                />
                <rect
                    id="rect11"
                    width="5.5793595"
                    height="9.0219431"
                    x="26.698616"
                    y="5.1045208"
                    rx="3"
                />
                <rect
                    id="rect12"
                    width="5.5793595"
                    height="9.0219431"
                    x="-52.881344"
                    y="-16.200796"
                    rx="3"
                    transform="matrix(-0.87254032,-0.4885421,-0.4885421,0.87254032,0,0)"
                />
            </g>
            <path
                d="M 4.2809649,34.33166 7.051001,31.477683 c 0,0 7.340669,7.060227 22.41211,7.134941 15.071441,0.07471 23.839099,-7.386762 23.839099,-7.386762 l 3.273679,3.273679 c 0,0 -8.580178,8.226167 -26.944897,8.226167 -18.364719,0 -25.3500271,-8.394048 -25.3500271,-8.394048 z"
            />
        </g>
        <g id="close-lid" display={show?'inline':'none'}>
            <path
                d="M 54.007812,23.300781 C 49.242911,19.304019 41.456569,15 30,15 18.116534,15 10.182148,19.628788 5.4726562,23.744141 a 24.636532,11.373937 0 0 0 -0.2675781,1.68164 24.636532,11.373937 0 0 0 1.6367188,3.962891 C 11.655428,24.971232 19.18769,20.507812 30,20.507812 c 10.677745,0 18.151975,4.3539 22.972656,8.716797 1.670491,1.511858 3.028004,3.023845 4.082031,4.357422 C 59.025831,31.516872 60,30 60,30 60,30 58.138951,26.765947 54.007812,23.300781 Z M 6.8417969,29.388672 A 24.636532,11.373937 0 0 1 5.2050781,25.425781 24.636532,11.373937 0 0 1 5.4726562,23.744141 C 1.7054196,27.03611 0,30 0,30 0,30 0.97416914,31.516872 2.9453125,33.582031 3.961007,32.296954 5.254417,30.845401 6.8417969,29.388672 Z M 52.972656,29.224609 C 48.151975,24.861712 40.677745,20.507812 30,20.507812 c -10.81231,0 -18.344572,4.46342 -23.1582031,8.88086 a 24.636532,11.373937 0 0 0 23.0351561,7.376953 24.636532,11.373937 0 0 0 23.095703,-7.541016 z"
            />
            <g transform="matrix(1,0,0,-1,0,52.859897)">
                <rect
                    width="5.5793595"
                    height="9.0219431"
                    x="-0.52897871"
                    y="13.111699"
                    rx="3"
                    transform="rotate(-29.244803)" />
                <rect
                    width="5.5793595"
                    height="9.0219431"
                    x="26.698616"
                    y="5.1045208"
                    rx="3" />
                <rect
                    width="5.5793595"
                    height="9.0219431"
                    x="-52.881344"
                    y="-16.200796"
                    rx="3"
                    transform="matrix(-0.87254032,-0.4885421,-0.4885421,0.87254032,0,0)" />
            </g>
        </g>
        </g>
    </svg>
    </Button>
    </>
}

type Note = {
    mode: "warn"|"critical"|"ok",
    message: React.ReactNode | string
}
// Input Field Note
export const Note = ({message: note, style}: {
    message: Note|null,
    style?: React.CSSProperties
})=>{
    const {effectiveTheme, returnOnTheme} = useColorContext();
    const styleNote: CSS = useMemo(()=>({
        userSelect: "none",
        margin: "5px 5px 5px 5px", //translate: "-10px 0",
        fontSize:"0.87rem", height:"max-content",
        ...style,
        color: note?.mode==="critical"
        ?returnOnTheme("rgb(240, 69, 69)","rgb(236, 73, 114)"): note?.mode==="warn"
        ?returnOnTheme("rgb(212, 136, 37)","rgb(230, 168, 53)"): note?.mode==="ok"
        ?returnOnTheme("rgb(67, 158, 112)","rgb(67, 158, 112)"):"transparent",
        opacity: note?1:0, transition: "opacity 0.2s ease"
    }),[note?.mode, effectiveTheme, style]);
    return <>
    <p style={styleNote}>{note?.message}</p>
    </>
}

type CheckBoxProps = {
    children?: React.ReactNode
    accentColor?: string,
    checked: boolean,
    style?: CSS,
    checkedStyle?: CSS,
    containerStyle?:CSS,
    onClick: (e?:React.MouseEvent<HTMLDivElement>)=> void
}
export const CheckBox = ({
    children, accentColor, style, checkedStyle, containerStyle,
    checked, onClick
}:CheckBoxProps)=>{
    const css = useClassname(moduleStyle);
    const { effectiveTheme, returnOnTheme } = useColorContext()
    
    const inputStyle:CSS = useMemo(()=>({
        display: "flex", alignItems:"center", justifyContent:"center",
        fontSize: "0.5rem",
        color: "rgba(255, 255, 255, 0.7)",
        userSelect: "none",
        backgroundColor: colorScheme.form.grey[effectiveTheme],
        ...style,
        ...(checked? {
            borderRadius: "3px",
            backgroundColor: accentColor || colorScheme.accent.blue[effectiveTheme],
            ...checkedStyle
        }:undefined)
    }),[effectiveTheme, checked, style, checkedStyle]);

    return <>
    <div style={{
        display: "flex", gap:"10px", cursor:"default",
        userSelect: "none",
        ...containerStyle
    }}>
        <div className={moduleStyle['check-box']}
        onClick={onClick}
        style={inputStyle}>
            <svg width={20} height={20} viewBox="0 0 20 20"
            style={{height:"90%", width:"90%"}}>
                <path d="M4.276 12.442 7.73 15.41l8.473-9.195"
                style={{
                    fill: "none", strokeLinecap: "round", strokeLinejoin: "round",
                    transition:"all 0.5s ease",
                    
                    stroke: inputStyle.color,
                    strokeWidth: 2.5,
                    
                    strokeDasharray: 18,
                    strokeDashoffset: checked? 0: 18
                }} />
            </svg>
        </div>
        {children}
    </div>
    </>
}
/* - - - - - - - - - - - Allignment | Layout Props - - - - - - - - - - - */
export function Clamp({
    children, ...props
}:DivProps){
    return <>
    <div className={moduleStyle['clamp']} {...props}>
        {children}
    </div>
    </>
}

type FadeProps = DivProps<{
    page: number
}>
export function Fade ({
    children, page, ...props
}:FadeProps){
    return <>
    <div className={moduleStyle['fade']} {...props}

    >
    <div className={moduleStyle["fade-window"]} style={{
        translate: `0 -${(Math.floor(page)-1)*100}%`
    }}>
        {children} 
    </div>
    </div>
    </>
}

export const Card = ({
    children, ...props
}:DivProps)=>{
    return <div className={moduleStyle['card']} {...props}>
        {children}
    </div>
}