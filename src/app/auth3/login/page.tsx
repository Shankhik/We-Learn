"use client";

import moduleStyle from "./page.module.css";

import { useState, useMemo, useCallback, useEffect, useRef, Activity } from "react";

import MainBox from "../components/MainBox";
import ProgressBar from "../components/Progress";
import { ActionButton, TextInput, CheckBox , BackButton } from "../components/Elements";
import { MainContentContainer } from "../components/Containers";

import ModuleClassname from "@/lib/cssUtil";
import { useColorContext } from "@/context/colorScheme";

import Link from "next/link";

import { checkUsername, checkPassword } from "@/lib/purify/check";
import { useNotification } from "@/context/notification";
import { useAuthContext } from "@/context/authContext";
import { useCountdown } from "@/lib/hooks/useTimer";
import { useRouter } from "next/navigation";

type ProgressBarProps = React.ComponentProps<typeof ProgressBar>

type Stage = ProgressBarProps['stages'][number];

type StageStatus = {
    [key in "one"|"two"] :boolean
}

type Message = React.ComponentProps<typeof MainContentContainer>['message'];

export default function LoginPage (){
    
    const { effectiveTheme } = useColorContext();
    
    const refUsername = useRef<HTMLInputElement>(null);
    const refPassword = useRef<HTMLInputElement>(null);

    const [cachedUsername, setCachedUsername] = useState<string|null>(null);
    const updateUsername = useCallback((username: string|null = null)=>{
        setCachedUsername(prev =>{
            if (prev===null && username===null) return prev;
            return username;
        })
    },[setCachedUsername]);

    const stages: Stage[] = useMemo(()=>([
        {name: "Username & Password", iconType: "USER"},
        {name: "Success", iconType: "OK"},
    ]),[]);

    const [currentStage, setCurrentStage] = useState<1|2>(1);
    const [stagesStatus, setStagesStatus] = useState<StageStatus>({
        one: false, two: false
    });

    // Updates Stage's status
    const updateStageStatus = (stage: keyof StageStatus, value: boolean)=>{
        setStagesStatus(prev=>{
            const newData = {...prev}
            newData[stage] = value
            return newData
        })
    }

    const styles = useMemo(()=>({
        progressBar: {
            width:"50%", maxWidth:"350px", minWidth:"180px"
        } satisfies React.CSSProperties,
        mainBox: {
            marginTop:"20px",
            flexGrow:1, position: "relative", overflow: "hidden",
            ...(currentStage===2?{
                backgroundImage: effectiveTheme==="light"
            ?"linear-gradient(45deg, rgba(227, 205, 255, 0.81), transparent), linear-gradient(0deg, rgb(159, 220, 255), rgba(175, 196, 255, 0))"
            :"linear-gradient(45deg, rgba(168, 169, 255, 0.84), transparent), linear-gradient(0deg, rgb(234, 255, 245), rgb(255, 243, 243))"
            }:undefined)
        } satisfies React.CSSProperties,
    }),[effectiveTheme,currentStage]);
    
    return <>
    <ProgressBar
    styles={{progressBar:styles.progressBar}}
    stages={stages} currentStage={currentStage}/>

    <MainBox style={styles.mainBox}>
        {/* Username & Password Stage */}
        <Activity mode={currentStage===1?"visible":"hidden"}>
            <StageOne refUsername={refUsername} refPassword={refPassword}
            clearStage={()=> updateStageStatus("one", true)}
            setCurrentStage={setCurrentStage} setCachedUsername={updateUsername}/>
        </Activity>

        {/* Confirmation Stage  */}
        <Activity mode={currentStage===2?"visible":"hidden"}>
            <StageTwo cachedUsername={cachedUsername}
            isComplete={stagesStatus.one}/>
        </Activity>
    </MainBox>
    </>
}

type StageOneProps = {
    refUsername: React.RefObject<HTMLInputElement|null>,
    refPassword: React.RefObject<HTMLInputElement|null>,
    setCachedUsername: (username?: string|null)=> void,
    clearStage: ()=>void,
    setCurrentStage: React.Dispatch<React.SetStateAction<1|2>>
}
const StageOne = ({
    refUsername, refPassword, setCurrentStage, setCachedUsername, clearStage
}:StageOneProps)=>{
    
    const css = useMemo(()=>new ModuleClassname(moduleStyle),[moduleStyle]);
    const {effectiveTheme} = useColorContext();
    const {updateAuth} = useAuthContext();
    const {pushNotification} = useNotification();

    const [showPassword, setShowPassword] = useState(false);    
    
    const [message, setMessage] = useState<Message>(null);

    const refUsernameNext = useRef<HTMLButtonElement>(null);
    const refPasswordNext = useRef<HTMLButtonElement>(null);

    /* - - - - - - - - - - - - - - - - - Pages - - - - - - - - - - - - - - - - - */
    const [currentPage, setCurrentPage] = useState<1|2>(1);
    const [pageStatus, setPageStatus] = useState({
        username: false, password: false
    });

    const updatePageStatus = useCallback(
    <T extends keyof typeof pageStatus>
    (page: T, value: typeof pageStatus[T])=>{
        setPageStatus(prev=>{
            return {
                ...prev,
                [page]: value
            }
        });
    },[]);

    
    /* - - - - - - - - - - - - On-Change event handler - - - - - - - - - - - - */
    const onchangeField = useCallback(
    <T extends  keyof typeof pageStatus> 
    (page: T)=>{
        updatePageStatus(page, false);
    },[updatePageStatus]);

    /* - - - - - - - - - - - - On-Click event handlers - - - - - - - - - - - - */
    
    const onclickUsernameNext = useCallback(async()=>{
        if (!refUsername.current) return;

        const value = refUsername.current.value
        if(!checkUsername(value)){
            setMessage({
                heading: "Invalid",
                body: <>
                    Username can&apos;t be empty nor can it contain whitepaces.<br/>
                    It can only contain (a-z) (A-Z) (0-9) \- _ @ # $ % & *
                </>
            });
            return;
        }

        try {
            const response = await fetch("/api/authenticate/check-login?type=username",{
                method: "POST",
                body: JSON.stringify({
                    username: value
                })
            });

            const responseData = await response.json() as Status;

            if (!responseData.status){
                if (response.status>=500){
                    throw new Error(responseData.error || responseData.message);
                }
                setCachedUsername();
                setMessage({
                    heading: "Not Found",
                    body: responseData.message || responseData.error
                }); return;
            }

            setCachedUsername(value);
            updatePageStatus("username", true);
            setCurrentPage(2);

        } catch (error:any) {
            setCachedUsername();
            updatePageStatus("username", false);
            pushNotification(error.message,{
                color:"red", duration: 7000
            });
        }
    },[updatePageStatus]);

    const onclickPasswordNext = useCallback(async()=>{
        if (!refUsername.current || !refPassword.current) return;
        
        if(!pageStatus.username) {
            setCurrentPage(1);
            setMessage({
                heading: "Skipped",
                body:"Please clear username check first!"
            }); return;
        }
        const values = {
            username: refUsername.current.value,
            password: refPassword.current.value,
        }

        try {
            const response = await fetch("/api/authenticate/login",{
                method: "POST",
                body: JSON.stringify({
                    username: values.username,
                    password: values.password
                })
            });

            const responseData = await response.json() as Status;

            if (!responseData.status){
                if (response.status>=500){
                    throw new Error(responseData.error||responseData.message);
                }
                setMessage({
                    heading: "Incorrect",
                    body: responseData.message || responseData.error
                }); return;
            }

            // Updates Auth Context
            updateAuth();
            
            updatePageStatus("password", true);
            // Clears the Stage -> Success
            clearStage();
            // Goes to Login Confirmation Stage
            setCurrentStage(2);
        } catch (error:any) {
            updatePageStatus("password",false);
            pushNotification(error.message,{
                color: "red", duration: 7000
            })
        }
    },[pageStatus, updatePageStatus]);

    /* - - - - - - - - - - - - - - - - Styles - - - - - - - - - - - - - - - - */
    const nextBtnBgColor = useMemo(()=>({
        light: 'rgb(51, 148, 116)',
        dark: 'rgb(46, 143, 110)',
    }),[effectiveTheme]);

    const getSignupInstead = useCallback(()=>(<>
        <p style={{
            color: effectiveTheme==="light"
            ? "rgba(0, 0, 0, 0.7)"
            : "rgba(255, 255, 255, 0.5)",
            width: "90%", textAlign:"center",
            fontSize: "0.95rem"
        }}>
            Don&apos;t have an account?{" "}
            <Link href={"/auth/signup"} style={{
                color: effectiveTheme==='light'
                ? "rgb(67, 83, 223)"
                : "rgb(80, 101, 221)",
                fontWeight: 600, 
            }}>Signup</Link> instead.
        </p>
    </>),[effectiveTheme]);

    return <>
    <BackButton isActive={currentPage===2} onClick={()=>setCurrentPage(1)}/>
    
    <MainContentContainer page={currentPage}
    message={message} setMessage={setMessage}>
        
        {/* Page: Username */}
        <div className={css.names(`stage-1 page`)}>
            {/* Input Field */}
            <TextInput containerStyle={{marginTop:"30px"}}
                ref={refUsername}
                enterButtonRef={refUsernameNext}
                placeholder="Enter Username" label="Username"
                onChange={()=>onchangeField("username")}
            />
            
            {getSignupInstead()}
            {/* Buttons Section */}
            <div className={moduleStyle['elements-container']}>
                <ActionButton ref={refUsernameNext}
                onClick={onclickUsernameNext}>
                    Next
                </ActionButton>
            </div>
        </div>

        {/* Page: Password */}
        <div className={css.names(`stage-1 page`)}>
            {/* Input Field */}
            <TextInput containerStyle={{marginTop:"30px"}}
                ref={refPassword} type={showPassword?"text":"password"}
                enterButtonRef={refPasswordNext}
                placeholder="Enter Password" label="Password"
                onChange={()=>onchangeField("password")}
            />
            {/* Checkbox */}
            <div className={moduleStyle['elements-container']} style={{fontSize:"0.9rem"}}>
                <CheckBox checked={showPassword}
                onChange={(e)=> setShowPassword(e.target.checked)}/>
                <label>Show Password</label>
                <Link style={{marginLeft:"auto"}} href="/auth2/forgot-password">Forgot Password?</Link>
            </div>
            {/* Buttons Section */}
            <div className={moduleStyle['elements-container']}
            style={{marginTop:"5px"}}>
                <ActionButton bgColor={nextBtnBgColor}
                showLoading ref={refPasswordNext}
                onClick={onclickPasswordNext}>
                Submit</ActionButton>
            </div>
        </div>
    </MainContentContainer>
    </>
}

type StageTwoProps = {
    cachedUsername: string|null,
    isComplete: boolean
}
const StageTwo = ({
    cachedUsername, isComplete, ...props
}:StageTwoProps)=>{
    const css = useMemo(()=>new ModuleClassname(moduleStyle),[moduleStyle]);
    const {effectiveTheme} = useColorContext();
    const { 
        start: startCountdown, timerState, 
        reset: resetCountdown, timeFormat, timeLeft 
    } = useCountdown(5);
    
    const router = useRouter();

    useEffect(()=>{
        if (isComplete)
            startCountdown();
        return ()=>{
            resetCountdown();
        }
    },[isComplete]);

    useEffect(()=>{
        if(timerState === 'expired')
            router.replace("/home/dashboard");
    },[timerState]);

    //useEffect(()=>console.log(timeLeft),[timeLeft])

    const styles = useMemo(()=>({
        page: {
            flexGrow:1, color:"rgba(0, 0, 0, 0.8)",
            textShadow: "0 1px 3px rgba(0, 0, 0, 0.15)",
            textAlign:"center"
        } satisfies React.CSSProperties,
        heading: {
            color: effectiveTheme==="light"
                ? "rgb(71, 93, 218)"
                : "rgb(83, 78, 160)",
        } satisfies React.CSSProperties,
    }),[effectiveTheme]);

    return <>
    <div className={css.names(`stage-1  page center`)}
        style={styles.page}
    >{
        isComplete? <>
            <h2 style={styles.heading}>Welcome back {cachedUsername}!</h2>
            <p>
                We are redirecting you to <strong>Dashboard</strong><br/>
                in {timeFormat.seconds} seconds.
            </p>
        </>:<>
            <h2 style={styles.heading}>Incomplete!</h2>
            <p>
                Wrong order of actions. You shouldn't be here.<br/>
                or<br/>
                Something went <strong>wrong</strong>!
            </p>
        </>
    }
        
    </div>
    </>
}