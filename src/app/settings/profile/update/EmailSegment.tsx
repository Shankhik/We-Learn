'use client';

import moduleStyle from "./EmailSegment.module.css"
import { useAuthContext } from "@/context/authContext";
import { delayWithId, timingsInMinutes } from "@/lib/time";
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { TextField, Timer } from "../../Components";
import { appfetch } from "@/lib/fetchReq";
import { ReqDataType } from "@/lib/apiReqDataType";
import Button from "@/components/buttons/NewButton";
import { useRouter } from "next/navigation";
import HideIf from "@/components/HideIf";
import { getCookie, setCookie } from "@/lib/cookies";

import { useColorContext } from "@/context/colorScheme";

const EmailSegment = ()=>{
    const [phase, setPhase] = useState<number>(1);
    
    const [timeLeft, setTimeLeft] = useState<number>(0);

    const nextPhase = ()=> setPhase(prev=> {
        if (prev+1>3) return prev;
        return prev+1;
    })

    useEffect(()=>{
        if(phase>2) return;
        const time = getOtpCookie();

        if (time.timeLeft>0){
            setTimeLeft(time.timeLeft);
            setPhase(prev=> prev===1? 2:prev);
        };
    },[phase])

    const render = ()=>{
        switch (phase){
        case 1: return <>
            <EmailPrompt
            nextPhase={nextPhase}
            />
        </>

        case 2: return <>
            <EmailOptVerification
            timeLeft={timeLeft}
            nextPhase={nextPhase}
            //expTime={expTime}
            />
        </>

        case 3: return <>
            <EmailField/>
        </>

        default: return null;
        }
    }
    return <>
    {/* <EmailField/> */}
    {render()}
    </>;
}
export default EmailSegment;

// Phase: 1
const EmailPrompt = ({nextPhase}:{
    nextPhase: ()=> void
})=>{
    const {email, username} = useAuthContext();

    const onClick = async ()=>{
        const res = await appfetch<Status,ReqDataType['otp']>("/api/otp?mode=issue",{
            username: username||'',
            purpose: "update-email",
            email: email!
        })

        if (!res || !res.status) {
            alert("Coundn't send the email!");
            return;
        }

        nextPhase();
    }
    return <>
        <p>We need to verify your email first. 
        An OTP will be sent to your email:</p>
        
        <h3 style={{
            margin:"10px 0",
            width:'100%', textAlign:'center',
            overflow:"hidden", textOverflow:"ellipsis"
        }}>{email}</h3>

        <p>Press &apos;Get OTP&apos; to continue.</p>
        
        <Button style={{
            margin:"13px 0"
        }} onClick={onClick} showLoading
        >Get OTP</Button>

    </> 
}

// Phase: 2
const EmailOptVerification = ({timeLeft, nextPhase}:{
    timeLeft: number,
    nextPhase: ()=> void,
    //expTime: number,
})=>{
    const {email, username} = useAuthContext();
    const [ otp, setOtp ] = useState<string[]>(new Array<string>(6).fill(""))
    const { replace } = useRouter();
    
    // If timer has expired [needed to toggle OTP fields]
    
    // -> Will be changing later on.
    const [timerExpired, setTimerExpired] = useState<boolean>(timeLeft<=0)
    // -> Changes State Value when prop changes
    useEffect(()=> setTimerExpired(timeLeft<=0) ,[timeLeft])
    
    // When Timer Ends
    const onTimerExpire = async()=>{
        setTimerExpired(true);
        const tmId = await delayWithId(2000);
        if (tmId) clearTimeout(tmId);
        replace("../");
    }

    // Onclick: OTP verification
    const onClick = async ()=>{
        const reqOtp = otp.join("").trim(); 
        const res = await appfetch<Status,ReqDataType['otp']>("/api/otp?mode=verify",{
            username: username||'',
            purpose: "update-email",
            email: email!,
            otp: reqOtp
        });

        if (!res || !res.status) {
            alert(res?.error || res?.message || "OTP verification failed");
            return;
        }

        nextPhase();
    }
    const resendStyle: React.CSSProperties = {
        padding:'0px', color: "rgba(82, 80, 199, 1)",
        height: "fit-content",border:'none',
        backgroundColor:"transparent", fontSize:'inherit'
    }

    return <>
        <p>Enter the OTP sent to
            <span style={{fontWeight:700}}> &apos;{email}&apos; </span>
        </p>
        <h3>Do NOT reload!</h3>
        <h4 style={{margin:'15px 0 0 0'}}>Time Left:</h4>
        
        <Timer onTimeOut={{callback: onTimerExpire}}
            timeInMs={timeLeft}
        />

        {/* Hides OTP fields if the timer has expired */}
        
        <HideIf hideIf={timerExpired}>
            <OTPField digits={otp} setDigits={setOtp}/>
            <p>Didn&apos;t get an email? <button style={resendStyle}>Resend</button></p>
        
            <Button
                style={{margin:"15px 0"}}
                onClick={onClick}
            >Submit</Button>
        </HideIf>
    </> 
}

// Phase: 3 [Final]
const EmailField = ()=>{
    const {email, username, updateAuth} = useAuthContext();
    const {effectiveTheme} = useColorContext();
    const inputFieldRef = useRef<HTMLInputElement>(null);
    const {replace} = useRouter();
    const [changesMade, setChangesMade] = useState<boolean>(false)
    
    const disabledStyle: React.CSSProperties = {
        backgroundColor: effectiveTheme==='light'?
        "rgba(90, 88, 109, 1)":"rgba(42, 42, 54, 1)",
        color: "rgba(170, 170, 170, 1)"
    }

    const onClick = async ()=>{
        if(!email || !username) {
            alert ("User details invalid");
            return;
        }
        if(!inputFieldRef.current) {
            alert ("Something went wrong!");
            return;
        }
        let updateRes:Status|undefined; 
        
        // Updating in DB
        updateRes = await appfetch<Status, ReqDataType['update-user-details']>(
            "/api/update-user-details",{
            username: username,
            fields:{
                email: inputFieldRef.current.value
            }
        })

        if(!updateRes || !updateRes.status) {
            alert("Couldn't update email address");
            return;
        }

        // Updates cache
        updateAuth({force: true});
        replace("../");
    }
    return <>
        <TextField ref={inputFieldRef}
        label={"Edit your email"} type={"email"}
        onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
            setChangesMade(prev => {
                const isSame = e.target.value === email;
                if( prev == !isSame) return prev;
                return !isSame;
            })
        }}
        defaultValue={email||''}/>

        <Button onClick={onClick} showLoading style={{
            width:"fit-content", alignSelf:'center',
            margin:'14px 0', backgroundColor:'rgba(86, 85, 185, 1)',
            color:"rgba(255, 255, 255, 0.8)"
        }} disabled={!changesMade} disabledStyle={disabledStyle}
        >Update Email</Button>
    </>
}


const getOtpCookie = ()=>{
    let cookie = {
        exp: 0,
        timeLeft: 0
    }

    let exp = getCookie('OTP_EXP').cookie;
    let purpose = getCookie('OTP_PURPOSE').cookie;
    
    // Both cookies are found and Time left is an actual number
    if( purpose === 'update-email' && exp!=='' && !isNaN(Number(exp))){
        let timeLeft = Number(exp) - Date.now()
        cookie.exp = Number(exp);
        cookie.timeLeft = Math.max(0, timeLeft)
    }
    // Return time left or undefined
    return cookie
}

const OTPField = ({digits, setDigits}:{
    digits: string[],
    setDigits: Dispatch<SetStateAction<string[]>>
})=>{

    const onChange = (e: React.ChangeEvent<HTMLInputElement>, index:number)=>{
        
        // After change value
        let value = e.target.value;
        // Prev OTP digits
        let data = [...digits];

        if(value==='' || !isNaN(parseInt(value))){
            data[index] = value;
            setDigits(data);
        }else e.target.value = digits[index]
        
        // If value is not Empty after Change
        if (data[index]){
            const next = (e.target.nextElementSibling as HTMLInputElement|null);
            if(next) next.focus();
            e.target.blur()
            return;
        }
        
        const prev = (e.target.previousElementSibling as HTMLInputElement|null);
        if(data[index] && prev) prev.focus();
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>,index: number)=>{
    
        const element = e.target as HTMLInputElement;
        
        // Number press and field is Non Empty
        if (!isNaN(parseInt(e.key)) && element.value){
            e.preventDefault();

            const next = element.nextElementSibling as HTMLInputElement|null

            setDigits(prev =>{
                if(e.key === prev[index]) return prev;
                let data = [...prev];
                data[index] = e.key;
                return data
            });
            element.value = e.key;

            // If next is available
            if(next) next.focus();
            element.blur()
        
        }

        // BackSpace press and Field is Empty
        else if (e.key === "Backspace" && element.value===''){
            e.preventDefault();
            const prev = element.previousElementSibling as HTMLInputElement|null;
            prev && prev.focus()
        }
    }
    
    return <>
    <div className={moduleStyle['otp-block']}>
        {digits.map((digit,index)=> {
            return(
            <input
                placeholder="*"
                key={"field-"+index}
                maxLength={1}
                onKeyDown={(e)=> onKeyDown(e,index)}
                onChange={(e)=> onChange(e,index)}
                className={moduleStyle['otp-field']}
            />)
        })}
    </div>
    </>
}