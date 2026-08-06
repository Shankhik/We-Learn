'use client';

import moduleStyle from "./Component.module.css";
import { Dispatch, RefObject, SetStateAction, useEffect, useState } from "react";
import FullPagePopUp from "@/components/popup/FullPagePopup";
import ModuleClassname from "@/lib/cssUtil";
import { useColorContext } from "@/context/colorScheme";
import Button from "@/components/buttons/NewButton";
import { useRouter } from "next/navigation";
import { delayWithId } from "@/lib/time";

type Props = {
    FullPagePrompt: React.ComponentProps <typeof FullPagePopUp> & {

    },
    SettingsFields:{
        label: string,
        type: 'text'|'button'|'email',
        value?: string,
        href?: string,
        //target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target']
        showEditButton?: boolean,
        onClick?:()=> Promise<any>|any,
        buttonStyle?: React.CSSProperties,
    }
}

// Theme based <hr/>
export const Hr = ()=>{
    const {effectiveTheme} = useColorContext();
    return <hr style={{
        border:`1px solid ${effectiveTheme==='light'?
            'rgba(58, 33, 202, 0.1)':'rgba(172, 166, 255, 0.1)'
        }`
    }}/>
}

// Settings Fields
export const SettingsField = ({
    label, type, showEditButton, value, buttonStyle, href, onClick
}:Props['SettingsFields'])=>{
    const css = new ModuleClassname(moduleStyle);
    const {effectiveTheme} = useColorContext();
    const router = useRouter();

    const classnames = {
        field: css.names(`settings-field`),
        label: css.names(`field-label`),
        textInput: type!=='button'?css.names(`text-input`):'',
        buttonInput: type==='button'?css.names(`button-input`):'',
        editButon: showEditButton?css.names(`edit`):'',
    }

    const buttonClick = async()=>{
        if (href) router.push(href);
        else{
            if(onClick) await onClick();
        }
    }
    const colors = {
        light: ['rgba(255, 255, 255, 0.3)','rgba(255, 255, 255, 0.4)'],
        dark: ['rgba(55, 64, 143, 0.3)','rgba(55, 64, 143, 0.4)'],
    }
    const styles:{[key in any]:React.CSSProperties} = {
        inputField: {
            backgroundColor: colors[effectiveTheme][0]
        },
        buttonField: {
            backgroundColor: colors[effectiveTheme][1],
            ...buttonStyle
        },
    }
    return <>
    <div className={classnames.field}>
        <h3 className={classnames.label}>{label}</h3>
        <div className={css.names(`value-container`)}>
            <input hidden={type==='button'} type={type} className={classnames.textInput} disabled
                defaultValue={value} style={styles.inputField}
            />
            <Button className={classnames.buttonInput} onClick={buttonClick}
            hidden={type!=='button'} style={styles.buttonField}
            >{value}</Button>

            <button style={{
                backgroundColor:effectiveTheme==='light'?"rgba(76, 74, 224, 0.62)":'',
                color: 'rgba(255, 255, 255, 0.76)'
            }} hidden={!showEditButton || type==='button'}
                className={classnames.editButon} onClick={buttonClick}
            >Edit</button>
        </div>
    </div>
    </>
}

// Full Screen Prompt
export const FullPagePrompt = ({
    children, show, toggleShow, zIndex, ...props
}:{
    show: boolean, zIndex?: number,
    toggleShow: Dispatch<SetStateAction<boolean>>,
    children?: React.ReactNode,
    title?: string,
    backgroundColor?: string,
    boxStyle?: React.CSSProperties
})=>{
    return <>
    <FullPagePopUp
        hideFromDom
        boxClassname={moduleStyle['prompt-box']}
        zIndex={zIndex}
        boxStyle={{
            backgroundColor: props.backgroundColor,
            boxShadow:"0 0 20px -4px rgba(0, 0, 0, 0.5)",
            ...props.boxStyle,
        }}
        show={show} toggleShow={toggleShow}
    >
        {children}
    </FullPagePopUp>
    </>
}
// Full Screen prompt Paragraph
export const PromptHeading = ({
    children, style
}:{
    children: React.ReactNode,
    style?: React.CSSProperties
})=>{
    return <>
    <h2 className={moduleStyle['prompt-heading']}
        style={style}
    >
        {children}
    </h2>
    </>
}
// Full Screen prompt Paragraph
export const PromptParagraph = ({
    children, style
}:{
    children: React.ReactNode,
    style?: React.CSSProperties
})=>{
    return <>
    <p className={moduleStyle['prompt-paragraph']}
        style={style}
    >
        {children}
    </p>
    </>
}


/* For Update page/field */
export const TextField = ({type, defaultValue, label, ref, onChange}:{
    label:string,
    defaultValue?: string,
    type: 'text'|'email',
    onChange?: (...props: any[])=> Promise<any>|any, 
    ref?: RefObject<HTMLInputElement|null>
})=>{
    const {effectiveTheme} = useColorContext();

    const inputStyle: React.CSSProperties = {
        backgroundColor: effectiveTheme==='light'?"rgba(255, 255, 255, 0.4)":"rgba(41, 38, 68, 0.4)"
    }
    return <>
    <label className={moduleStyle['label']}
    >{label}</label>
    <input
        ref={ref}
        className={moduleStyle['input']}
        type={type} style={inputStyle}
        onChange={onChange}
        defaultValue={defaultValue}
    />
    </>
}

export const UpdateBlock = (props:{
    children?: React.ReactNode
})=>{
    return <>
    <div className={moduleStyle['block']}>
        {props.children}
    </div>
    </>
}

export const Timer = ({
    includeWrapper, timeInMs, onTimeOut, style
}:{
    includeWrapper?: boolean,
    timeInMs?: number,
    style?: React.CSSProperties,
    onTimeOut?: {
        callback: (...props: any[])=> Promise<any>|any,
        execDelay?: number
    }
})=>{

    // In Seconds
    const [timeLeft, setTimeLeft] = useState<number>(Math.floor((timeInMs||0)/1000))

    // Update Timeleft when prop changes [IMP]
    useEffect(()=> setTimeLeft(Math.floor((timeInMs||0)/1000)), [timeInMs])
    
    const timeToShow = {
        minutes: Math.max(Math.floor(timeLeft/60),0),
        seconds: Math.max(timeLeft%60,0),
    }
    useEffect(()=>{
        const cleanup = async ()=>{
            if (onTimeOut?.callback){
                // Delay before execution
                const delayId = await delayWithId(onTimeOut?.execDelay||0);
                // Callback
                await onTimeOut.callback();
                // Cleans up timeout
                if (delayId)
                    return ()=> clearTimeout(delayId);
            }
        }
        // Cleans up when initial and final time aren't same
        if(
            timeLeft<0 && // Timer ends
            timeInMs!==timeLeft // It did some countdown [imp if timeInMs was 0]
        ) cleanup();
    },[onTimeOut, timeInMs, timeLeft])
    
    // For Countdown -> Restarts the counter everytime prop time changes
    useEffect(()=>{
        if(timeInMs===0) return;
        const interval = setInterval(()=> {
            setTimeLeft(prev => {
                if (prev<0) return -1;
                return prev-1
            })
        },1000);
        return ()=> clearInterval(interval);
        
    },[timeInMs]) // important

    const timer = <>
        <div style={{
            display:"flex", justifyContent:'center',
            ...style
        }}>
        <h1>{String(timeToShow.minutes).padStart(2,"0")}:</h1>
        <h1>{String(timeToShow.seconds).padStart(2,"0")}</h1>
    </div>
    </>

    return includeWrapper ? <>
    <UpdateBlock>
        {timer}
    </UpdateBlock>
    </>: timer
}
