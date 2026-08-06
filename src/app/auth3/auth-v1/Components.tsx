'use client';

import Button2 from "@/components/buttons/Button"
import ModuleClassname from "@/lib/cssUtil"
import moduleStyle from "./global.module.css";
import { useColorContext } from "@/context/colorScheme";
import { Dispatch, InputHTMLAttributes, RefObject, SetStateAction, useEffect,isValidElement, useRef, useState, useMemo} from "react";
import ShowPassword from "@/components/misc/ShowHidePwd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNotification } from "@/context/notification";
import { useAuthContext } from "@/context/authContext";
import Navbar from "@/components/navbar/Navbar2";
import ProfilePopup from "@/components/popup/ProfilePopup";

// For /auth layout
export const AuthLayout = ({children}:{
    children: React.ReactNode
})=>{
    const css = new ModuleClassname(moduleStyle);
    const {effectiveTheme} = useColorContext();
    const { verified } = useAuthContext();
    const pathname = usePathname();
    const segment = pathname.split("/").at(2);
    
    const [showProfile, setShowProfile] = useState(false);

    const { pushNotification } = useNotification();

    useEffect(()=>{
        if (verified)
        pushNotification("Re-Authentication will sign you out",{
            duration: 4500
        });
    },[]);
    return <>
    <ProfilePopup show={showProfile} setShow={setShowProfile}/>
    <div className={css.names(`auth-page ${effectiveTheme}`)}>
        <Navbar onProfileClick={()=> setShowProfile(true)}/>
        <div className={moduleStyle['main-box']}>
            {/* Top title + switch */}
            <div style={{display:"flex", position:"relative"}}>
                <h1 className={css.names(`title`)}>{
                    segment=== "login"? "Login"
                    : segment=== "signup"? "Signup"
                    : "Don't Try anything Funny"
                }</h1>
                <Link href={
                    segment === "login"? "signup"
                    : segment === "signup"? "login"
                    : "/"
                } style={{position: "absolute", top:"55%", left:"15px"}}
                title={ segment === "login"? "Signup instead"
                    : segment === "signup"? "Login instead"
                    : "Where the frick are we?"}
                ><SwitchSvg width={20} height={20}/></Link>
            </div>
            {children}
        </div>
    </div>
    </>
}

const SwitchSvg = ({width, height}:{
    width?: string|number,
    height?: string|number,
})=>{
    const {effectiveTheme} = useColorContext()
    return <svg
        width={width || 50} height={height||50} viewBox="0 0 50 50"
    >
    <path
      d="M17.57 44.123 6.605 33.47m36.737-7.488c.433 4.024-1.512 6.553-5.578 7.392-10.353.017-20.706-.01-31.058.046M32.429 5.877 43.396 16.53M6.66 24.018c-.433-4.024 1.512-6.553 5.578-7.392 10.353-.017 20.706.01 31.058-.046"
      style={{
        fill: "none",
        stroke: effectiveTheme === "light"?
            "#544e75": "#8999f5",
        strokeWidth: 5,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeDasharray: "none",
        strokeOpacity: 1,
      }}
    />
  </svg>
}
export const SubmitButton = ({children, onSubmit}:{
    children: React.ReactNode,
    onSubmit: (e?:any)=> Promise<void>|void
})=> {
    const css = new ModuleClassname(moduleStyle);
    const {effectiveTheme} = useColorContext()
    return <>
    <Button2 className={css.names(`submit ${effectiveTheme}`)}
        showLoading onClick={onSubmit} workingStyle={{
            backgroundColor: "rgba(81, 66, 121, 0.62)",
            filter: "none", boxShadow: "none"
        }} 
    >{children}</Button2>
    </>
}

type PropFormField = {
    type: InputHTMLAttributes<HTMLInputElement>['type'],
    showPassword?: boolean,
    label: string,
    purifyRegex?: RegExp, invertRedexCheck?: boolean,
    hint?: string|React.ReactNode,
    hintColor?: string,
    togglePassword?: Dispatch<SetStateAction<boolean>>,
    ref?: RefObject<HTMLInputElement|null>
}
export const FormField = ({
    label, type,ref,
    hint, hintColor, purifyRegex, invertRedexCheck,
    showPassword, togglePassword,
}:PropFormField)=>{
    const nonGlobalPurifyRegex = useMemo(()=>{
        if(!purifyRegex) return undefined;
        return new RegExp(purifyRegex.source, purifyRegex.flags.replace("g",""))
    }, [purifyRegex]);

    const css = new ModuleClassname(moduleStyle);
    
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isEmpty, setIsEmpty] = useState<boolean>(true);
    const [isInvalid, setIsInvalid] = useState(false);
    
    const onFocus = (e: React.FocusEvent)=>{
        // const target = e.target as HTMLInputElement
        // const parent = target.parentElement as HTMLDivElement;
        // const label = parent.children[0] as HTMLLabelElement

        // label.classList.add(moduleStyle['on'])
        
        setIsActive(true);
    }
    const onBlur = (e: React.FocusEvent)=>{
        // const target = e.target as HTMLInputElement
        // const parent = target.parentElement as HTMLDivElement;
        // const label = parent.children[0] as HTMLLabelElement

        // if(!target.value){
        //     label.classList.remove(moduleStyle['on'])
        // }

        setIsActive(false);
    }
    const onChange = (e: React.ChangeEvent)=>{
        const target = e.target as HTMLInputElement;
        // const parent = target.parentElement as HTMLDivElement;
        // const label = parent.children[0] as HTMLLabelElement;

        // if(target.value){
        //     label.classList.add(moduleStyle['on'])
        // }
        if (nonGlobalPurifyRegex){
            if (!invertRedexCheck && nonGlobalPurifyRegex.test(target.value))
                setIsInvalid(true);
            else setIsInvalid(false);
        }
        
        if(target.value)
            setIsEmpty(false);
        else setIsEmpty(true);
    }
    const hideShowPwd = ()=>{
        return type==='password' && togglePassword && showPassword!==undefined?
        <ShowPassword width={"23px"} irisColor={"rgba(97, 86, 248, 1)"} style={{
            bottom:'50%', right:"3px", translate:"0 50%"
        }} toggle={togglePassword} show={showPassword}/> :null
    } 
    
    return <>
    <div className={css.names(`field`)}>
        
        <label className={css.names(`label ${isActive || !isEmpty ? "on":"off"}`)}>{label}</label>
        <input className={css.names(`input`)}
            type={showPassword?'text':type} ref={ref}
            onFocus={onFocus} onBlur={onBlur} onChange={onChange}  
        />
        {hideShowPwd()}
    </div>
    <div style={{display: !hint?"none":"", background: hintColor}} className={css.names(`hint ${isInvalid?"on":""}`)}>
        {typeof hint === "string"?
            <span className={moduleStyle['main']}>{hint}</span> : isValidElement(hint)?
            hint: null
        }
    </div>
    </>
}