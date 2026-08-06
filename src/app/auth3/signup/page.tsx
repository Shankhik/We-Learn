"use client";

import globalStyle from "../global.module.css";
import moduleStyle from "./page.module.css";

import { Heading } from "@/components/htmlElements/Texts";
import ProgressBar from "../components/Progress";
import StageIcon from "../components/StageIcon";
import { useColorContext } from "@/context/colorScheme";
import MainBox from "../components/MainBox";
import Button from "@/components/buttons/NewButton";
import ModuleClassname from "@/lib/cssUtil";
import { Activity, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActionButton, BackButton, CheckBox, MessageBox, TextInput } from "../components/Elements";
import { useNotification } from "@/context/notification";
import { checkUsername, checkEmail, checkPassword } from "@/lib/purify/check";

// SVG icons
import { BackIcon } from "@/components/icons/Icons";
import { MainContentContainer } from "../components/Containers";
import { SignupCredential } from "@/app/api/authenticate/utils";
import useTimer, { useCountdown } from "@/lib/hooks/useTimer";
import { SessionTimer } from "../components/Timers";
import { timingsInMinutes } from "@/lib/time";
import SuccessCard from "../components/SuccessCard";
import { colorScheme } from "@/lib/color/appColors";

type StageStatus = {
    one: boolean,
    two: boolean,
    three: boolean,
    four: boolean
}

type Message = React.ComponentProps<typeof MainContentContainer>['message']

const useGreenAccent = ()=>{
    return useMemo(()=>({
        light: colorScheme.accent.green.light,
        dark:  colorScheme.accent.green.dark
    }),[]);
};

type SessionTimerSectionProps = {
    isVisible: boolean,
    // startedOnce: boolean,
    hasExpired: boolean,
    // minutes: number,
    // seconds: number
    timeLeft: number
}

const SessionTimerSection = ({
    timeLeft, isVisible, hasExpired
}: SessionTimerSectionProps)=>{
    const { effectiveTheme } = useColorContext();

    // Timer: 'Red'
    const blinkRed = useMemo(()=>timeLeft<=60 && timeLeft%2===0,[timeLeft]);

    const style:React.CSSProperties = useMemo(()=>({
        justifyContent:"center", alignItems:"center",
        padding: "0", minHeight:"auto",
        transition:"height 0.5s ease; margin 0.3s ease",
        overflow: "hidden", userSelect:"none",
        // Visibility
        height: isVisible ? "80px":"0",
    }),[isVisible]);

    const timerStyle:React.CSSProperties = useMemo(()=>({
        fontSize:"1.7rem",
        color: !blinkRed ? ""
            :effectiveTheme==='light'
                ?"rgb(230, 82, 82)"
                :"rgb(241, 93, 93)"
    }),[effectiveTheme, blinkRed]);

    return <>
    <MainBox style={style}>
        <h5>{hasExpired?"Session has expired":"Complete Signup within:"}</h5>
        <SessionTimer countdown={timeLeft} style={timerStyle}/>
    </MainBox>
    </>
}

export default function SignupPage (){

    const css = useMemo(()=>new ModuleClassname(moduleStyle),[moduleStyle])
    const { effectiveTheme } = useColorContext();

    /* - - - - - - - - - - - - Signup Session - - - - - - - - - - - - */
    const [sessionDetails, setSessionDetails] = useState({
        startedOnce: false,
        hasExpired: false
    });
    
    const timer = useCountdown(timingsInMinutes.signupSessionJwt*60);

    const startTimer = (countdown?:number)=>{
        // Can be started only once
        if ( sessionDetails.startedOnce || sessionDetails.hasExpired ) return;
        timer.start(countdown);
    }

    // handles session details
    useEffect(()=>{
        if (timer.timerState === "expired"){
            if (sessionDetails.startedOnce){
                setSessionDetails(prev=>{
                    const newData = {...prev};
                    newData.hasExpired = true;
                    return newData;
                });
            }
        }else if (timer.timerState === "running"){
            // sets StartedOnce -> true
            setSessionDetails(prev=>{
                if (prev.startedOnce)
                    return prev;
                const newData = {...prev};
                newData.startedOnce = true;
                return newData;
            });
        }
    },[timer.timerState]);
    
    /* - - - - - - - - - - - - - - - Stages - - - - - - - - - - - - - - - */
    
    type StagesType = React.ComponentProps<typeof ProgressBar>['stages']
    
    const stages:StagesType = useMemo(()=>[
        {name: 'Username & Password', iconType: "USER"},
        {name: 'Email', iconType: "EMAIL"},
        {name: 'User Agreement', iconType: "DOC"},
        {name: 'Done', iconType: "OK"},
    ],[]);
    
    const [currentStage, setCurrentStage] = useState(1);
    const [stagesStatus, setStagesStatus] = useState<StageStatus>(()=> {
        return { one: false, two: false, three: false, four: false }
    });

    // Updates Stage's status
    const updateStageStatus = (stage: keyof StageStatus, value: boolean)=>{
        setStagesStatus(prev=>{
            const newData = {...prev}
            newData[stage] = value
            return newData
        })
    }

    // Functions for Stages OnClick [in Progress Bar]
    const stagesOnClicks = useMemo(()=>{
        return [
            async()=>{
                if (stagesStatus.three) return;
                setCurrentStage(1);
            },
            async()=>{
                if (
                    stagesStatus.three ||
                    !stagesStatus.one
                ) return;

                setCurrentStage(2);
            },
            async()=>{
                if (
                    stagesStatus.three ||
                    !stagesStatus.one ||
                    !stagesStatus.two
                ) return;
                setCurrentStage(3);
            },
            async()=>{
                if (!stagesStatus.three) return;
                setCurrentStage(4)
            },
        ]
    },[
        stagesStatus.one, stagesStatus.two,
        stagesStatus.three, stagesStatus.four
    ]);

    /* - - - - - - - - - - - - Cached Password - - - - - - - - - - - - */

    const [cachedPassword, setCachedPassword] = useState<string|null>(null);
    
    const updateCachedPassword = useCallback((password: string|null = null)=>{
        setCachedPassword(password??null);
    },[setCachedPassword]);
    
    // Clears existing SIGNUP_SESSION
    useEffect(()=>{
        const clearSession = async()=>{
            const res = await fetch("/api/authenticate/clear-session",{
                method:"GET"
            });
        }
        clearSession()
    },[]);
    
    // Clears
    useEffect(()=>{
        if (stagesStatus.one && stagesStatus.two && stagesStatus.three)
            timer.pause();
    },[stagesStatus.one, stagesStatus.two, stagesStatus.three]);

    const mainBoxStyle: React.CSSProperties = useMemo(()=>({
        flexGrow:1, position:"relative", overflow:"hidden", //display:"none",
        ...(currentStage===4?{
            backgroundImage: effectiveTheme==="light"
            ?"linear-gradient(45deg, rgba(227, 205, 255, 0.81), transparent), linear-gradient(0deg, rgb(159, 220, 255), rgba(175, 196, 255, 0))"
            :"linear-gradient(45deg, rgba(168, 169, 255, 0.84), transparent), linear-gradient(0deg, rgb(234, 255, 245), rgb(255, 243, 243))"
        }:undefined)
    }),[effectiveTheme, currentStage]);

    return <>
    <ProgressBar stagesOnClick={stagesOnClicks} currentStage={currentStage} stages={stages}/>
    
    <SessionTimerSection // -> show session timer
        isVisible={
            !stagesStatus.three && sessionDetails.startedOnce
        } timeLeft={timer.timeLeft}
        hasExpired={sessionDetails.hasExpired}
    />

    <MainBox style={mainBoxStyle}>
        <Activity mode={currentStage===1?"visible":"hidden"}>
            <StageOne setFns={{
                currentStage: setCurrentStage, updateStageStatus, updateCachedPassword
            }} startTimeout={startTimer}/>
        </Activity>
        <Activity mode={currentStage===2?"visible":"hidden"}>
            <StageTwo setFns={{
                currentStage: setCurrentStage, updateStageStatus
            }}/>
        </Activity>
        <Activity mode={currentStage===3?"visible":"hidden"}>
            <StageThree setFns={{
                currentStage: setCurrentStage, updateStageStatus
            }} isActive={currentStage===3} cachedPassword={cachedPassword}/>
        </Activity>
        <Activity mode={currentStage===4?"visible":"hidden"}>
            <StageFour show={currentStage===4}/>
        </Activity>
    </MainBox>
    </>
}

type StageOneProps = {
    startTimeout: (countdown?: number)=> void,
    setFns: {
        updateStageStatus: (stage: keyof StageStatus, value: boolean)=> void,
        updateCachedPassword: (password?: string|null)=> void,
        currentStage: React.Dispatch<React.SetStateAction<number>>
    }
}

/* - - - - - - - - - - - Stage 1: Username & Password- - - - - - - - - - - */
const StageOne = ({ setFns, startTimeout }:StageOneProps)=>{

    const css = useMemo(()=>new ModuleClassname(moduleStyle),[moduleStyle]);
    const { effectiveTheme } = useColorContext();
    const { pushNotification } = useNotification();

    
    const [showPassword, setShowPassword] = useState(false);

    const [message, setMessage] = useState<Message>({
        heading: "Remember",
        body: <>Don&apos;t press <strong>&apos;back&apos;</strong>, reload or leave this page during signup. All the data will be lost!</>
    });
    
    /* - - - - - - - - - - - - - References - - - - - - - - - - - - - */
    // -> Input Fields
    const refUsername = useRef<HTMLInputElement|null>(null);
    const refPassword = useRef<HTMLInputElement|null>(null);
    // -> Action Buttons
    const refShowPwd  = useRef<HTMLInputElement|null>(null);
    const refUsernameCheck = useRef<HTMLButtonElement|null>(null);
    const refPasswordCheck = useRef<HTMLButtonElement|null>(null);
    
    /* - - - - - - - - - - - - - Pages - - - - - - - - - - - - - */
    const [currentPage, setCurrentPage] = useState<1|2>(1);
    const [pageStatus, setPageStatus] = useState({
        one: false,
        two: false,
    });

    const isBackActive = pageStatus.one && currentPage===2;
    
    const updatePageStatus = useCallback((page: "username"|"password", status: boolean = true)=>{
        setPageStatus(prev=>{
            const n = {...prev}
            n[page==='username'?'one':'two'] = status;
            return n;
        });
    },[setPageStatus]);

    // Resets the Stage Status + Formdata field
    const resetStage = (page: "username"|"password")=>{
        // Resets Stage 1 status: false
        setFns.updateStageStatus("one",false);
        // Resets Cached Password: null
        if (page==='password')
            setFns.updateCachedPassword(null);
        // Resets Page status: false
        updatePageStatus(page, false);
    }

    const onFieldChange = (field: "username"|"password")=>{
        if (pageStatus[field==='password'?'two':'one'])
            resetStage(field);
    };

    /* - - - - - - - - - - - - On-Clicks - - - - - - - - - - - - */
    
    const onclickBack = useCallback(() => {
        if (isBackActive)
            setCurrentPage(1);
    }, [isBackActive, setCurrentPage]);

    const onclickCheckUsername = useCallback(async () => {
        if (!refUsername.current) return;
        const value = refUsername.current.value;//.trim();
        try {
            if (!checkUsername(value)) {
                resetStage("username");
                setMessage({
                    heading: "Invalid",
                    body: <>
                    Username can&apos;t be empty nor can it contain whitepaces.<br/>
                        It can only contain (a-z) (A-Z) (0-9) \- _ @ # $ % & *
                    </>
                });
                return;
            }
            const response = await fetch("/api/authenticate/check-signup?type=username", {
                method: "POST",
                body: JSON.stringify({
                    username: value
                })
            });
            const responseData: Status = await response.json();

            if (!responseData.status || response.status >= 500) {
                if (responseData.error)
                    throw new Error("Session may have expired! Please try again after a refresh.");
                
                resetStage("username");
                setMessage({
                    heading: "Invalid",
                    body: responseData.message || responseData.error
                });
                return;
            }

                
            startTimeout();

            updatePageStatus("username");
            
            pushNotification("Username is Available", {
                color: "green", duration: 4000
            });

        } catch (error: any) {
            resetStage('username');
            pushNotification(error.message, {
                color: "red", duration: 7000
            });
        }
    }, [resetStage, startTimeout, updatePageStatus, pushNotification]);
            
    const onclickNextUsername = useCallback(() => {
        if (!refUsername.current) return;
            
        if (!pageStatus.one) {
                setFns.updateStageStatus("one", false);
                setMessage({
                    heading: "Invalid Username",
                body: "Can't proceed to the next page. Please check the entered username",
            });
            return;
        }
        setCurrentPage(2);
    }, [pageStatus.one, setFns.updateStageStatus]);

    const onclickCheckPassword = useCallback(async () => {
        if (!refPassword.current) return;
        const value = refPassword.current.value;

        try {
            if (!checkPassword(value)) {
                resetStage("password");
                setMessage({
                    heading: "Invalid",
                    body: <>
                    Password can&apos;t be empty nor can it contain whitepaces.<br />
                        It can only contain (a-z) (A-Z) (0-9) \- _ @ # $ % & *
                    </>
                }); return;
            }
            const response: Status = await (await fetch(
                "/api/authenticate/check-signup?type=password", {
                method: "POST",
                body: JSON.stringify({
                    password: value,
                })
            })).json();

            if (!response.status) {
                // Serious Error
                if (response.error)
                    throw new Error(response.error);

                resetStage("password");
                setMessage({
                    heading: "Invalid",
                    body: response.message
                });
                return;
            }
            
            // Updates password page status -> true
            updatePageStatus("password");
            // Sets cached password
            setFns.updateCachedPassword(value);

            pushNotification("Password is Valid", {
                color: "green", duration: 3000
            });
        } catch (error: any) {
            resetStage("password");
            setMessage({
                heading: "Error",
                body: "Something went wrong! Try again after refreshing the page.",
                critical: true
            });
        }
    }, [resetStage, updatePageStatus, setFns.updateCachedPassword, pushNotification]);
            
    const onclickNextPassword = useCallback(() => {
        if (!refPassword.current) return;

        if (!pageStatus.two) {
            setFns.updateStageStatus("one", false);
            if (!pageStatus.one)
                setCurrentPage(1);
            return;
        }

        setFns.updateStageStatus("one", true);
        setFns.currentStage(2);
    }, [pageStatus.two, pageStatus.one, setFns.updateStageStatus, setFns.currentStage,]);

    /* - - - - - - - - - - - - - - Styles - - - - - - - - - - - - - - */
    const nextBtnBgColor = useGreenAccent();

    return <>
    <BackButton isActive={isBackActive} onClick={onclickBack}/>
    
    <MainContentContainer page={currentPage}
    message={message} setMessage={setMessage}>

        {/* Page 1: Username */}
        <div className={css.names(`stage-1 page`)}>
            <TextInput
                containerStyle={{marginTop:"30px"}}
                ref={refUsername} enterButtonRef={refUsernameCheck}
                placeholder="Enter Username" label="Username"
                onChange={()=>onFieldChange("username")}
            />

            <div className={moduleStyle['elements-container']}>
                
                <ActionButton ref={refUsernameCheck}
                onClick={onclickCheckUsername}>
                    Check
                </ActionButton>

                <ActionButton disabled={!pageStatus.one} onClick={onclickNextUsername}
                bgColor={nextBtnBgColor}>
                    Next
                </ActionButton>

            </div>
        </div>

        {/* Page 2: Password */}
        <div className={css.names(`stage-1 page`)}>
            <TextInput
                containerStyle={{marginTop:"30px"}}
                ref={refPassword} enterButtonRef={refPasswordCheck}
                type={showPassword?'text':"password"}
                placeholder="Enter Password" label="Password"
                onChange={()=>onFieldChange("password")}
            />
            <div className={moduleStyle['elements-container']}>
                <CheckBox checked={showPassword} ref={refShowPwd}
                onChange={(e)=> setShowPassword(e.target.checked)}/>
                <label style={{margin:"0 auto 0 0", userSelect:"none", fontSize: '0.9rem'}}
                onClick={(e)=>{
                    (((e.target as HTMLLabelElement)
                    .parentElement as HTMLDivElement)
                    .firstChild as HTMLInputElement)
                    .click()
                }}>Show Password</label>
            </div>
            
            <div className={moduleStyle['elements-container']} style={{marginTop:"auto"}}>
                <ActionButton ref={refPasswordCheck}
                onClick={onclickCheckPassword}>
                    Check
                </ActionButton>
                <ActionButton onClick={onclickNextPassword} disabled={!pageStatus.two}
                bgColor={nextBtnBgColor}>
                    Next
                </ActionButton>
            </div>
        </div>
    </MainContentContainer>
    </>
}

type StageTwoProps = {
    setFns: {
        updateStageStatus: (stage: keyof StageStatus, value: boolean)=> void,
        currentStage: React.Dispatch<React.SetStateAction<number>>,
        //updateCachedPassword: (password?: string|null)=> void
    }
}
/* - - - - - - - - - - - - - - Stage 2: Email - - - - - - - - - - - - - - */
const StageTwo = ({setFns}: StageTwoProps) => {

    const css = useMemo(()=> new ModuleClassname(moduleStyle),[moduleStyle]);
    const { effectiveTheme } = useColorContext();
    const { pushNotification } = useNotification();

    const [isPassed, setIsPassed] = useState<boolean>(false);

    const [message, setMessage] = useState<Message>({
        heading: "Remember",
        body: <>
        Once email is verified, you can&apos;t change it.
        </>
    });

    const [cachedEmail, setCachedEmail] = useState<string|null>(null);
    
    /* - - - - - - - - - - - - - - - References - - - - - - - - - - - - - - - */
    
    // -> Input Fields
    const refEmail = useRef<HTMLInputElement|null>(null);
    const refOTP = useRef<HTMLInputElement|null>(null);
    
    // -> Action Button
    const refEmailSend = useRef<HTMLButtonElement>(null);
    const refOTPSend = useRef<HTMLButtonElement>(null);
    
    /* - - - - - - - - - - - - - - - Pages - - - - - - - - - - - - - - - */
    
    const [currentPage, setCurrentPage] = useState<1|2>(1);
    
    const [pageStatus, setPageStatus] = useState({
        one: false,
        two: false,
    });

    const isBackActive = useMemo(()=>{
        return pageStatus.one && currentPage===2
    },[pageStatus.one, currentPage]);

    const updatePageStatus = useCallback((page: "email"|"otp",status: boolean = true)=>{
        setPageStatus(prev=>{
            const n = {...prev}
            n[page==='email'?'one':'two'] = status;
            return n;
        });
    },[setPageStatus]);

    const resetStage = (page:"email"|"otp")=>{
        // Resets Stage 2 status: false
        setFns.updateStageStatus('two', false);
        // Resets Page status: false
        updatePageStatus(page, false);
        // Resets Cached Email: null
        if (page==='email')
            setCachedEmail(null);
    };
    
    const onFieldChange = (field:"email"|"otp") => {
        if (pageStatus[field==='otp'?'two':'one'])
            resetStage(field);
    }

    const onclickVerifyOtp = async ()=>{
        if (!refOTP.current) return;
        const value = refOTP.current.value;
        try {
            // if somehow previous page isn't cleared
            if (!pageStatus.one){
                resetStage('otp');
                setMessage({
                    heading: "Invalid",
                    body: "Can't proceed to the next page. Please check the entered email.",
                });
                setCurrentPage(1);
                return;
            }

            const response = await fetch("/api/authenticate/check-signup?type=email",{
                method: "POST",
                body: JSON.stringify({
                    otp: value,
                    //email: refEmail.current?.value
                })
            });

            const responseData: Status = await response.json();

            if (response.status>=500 || !responseData.status){
                
                // Actual Error
                if (responseData.error) throw new Error(
                    "Session may have expired! Please try again after a refresh."
                );

                resetStage('otp');
                setMessage({
                    heading: "Incorrect",
                    body: "OTP didn't match. Try again!"
                });
                return;
            }

            pushNotification("Email verified!",{
                color:"green", duration: 3000
            });

            updatePageStatus('otp');

            setFns.updateStageStatus('two', true);

            setIsPassed(true);

            setFns.currentStage(3);

        } catch (error:any) {
            resetStage('otp');
            setMessage({
                heading: "Error",
                body: error.message,
                critical: true
            });
        }
    }

    const onclickSubmitEmail = async ()=>{
        if (!refEmail.current) return;
        const value = refEmail.current.value;

        try {
            if (!checkEmail(value)){
                resetStage('email');
                setMessage({
                    heading: "Invalid",
                    body: <>
                        This is not a valid email address.
                    </>
                });
                return;
            }

            const response = await fetch("/api/authenticate/check-signup?type=email",{
                method: "POST",
                body: JSON.stringify({
                    email: value
                })
            });

            const responseData: Status = await response.json();

            // Has Error
            if ( response.status >= 500 || !responseData.status ){
                // Actual Error
                if (responseData.error) throw new Error(
                    "Session may have expired! Please try again after a refresh."
                )

                resetStage('email');
                setMessage({
                    heading: "Invalid",
                    body: responseData.message || responseData.error
                });
                return;
            }

            updatePageStatus('email');

            setCachedEmail(value??null);
            // Goes to the OTP page
            setCurrentPage(2);

        } catch (error:any) {
            resetStage('email');
            setMessage({
                heading: "Error",
                body: error.message,
                critical: true
            });
        }
    }
    
    const verifyOtpBtnBgColor = useGreenAccent();

    return isPassed?<>
    <MainContentContainer message={message} setMessage={setMessage} page={1}>
        <div className={css.names(`stage-1 page center`)}>
            <h2>Email Verified</h2>
            <h4 style={{marginBottom:"10px"}}
            className={css.names(`code ${effectiveTheme}`)}>
                {cachedEmail}
            </h4>
            <p style={{maxWidth:"80%"}}>
                Your email address is successfully verified.<br/>
                You can now proceed to the next stage.
            </p>
        </div>
    </MainContentContainer>
    </>:<>
    <BackButton isActive={isBackActive} onClick={()=>setCurrentPage(1)}/>
    <MainContentContainer message={message} setMessage={setMessage} page={currentPage}>
        {/* Page 1: Email Input */}
        <div className={css.names(`stage-1 page`)}>
            <TextInput containerStyle={{ marginTop:"40px" }}
                type="email"
                ref={refEmail} enterButtonRef={refEmailSend}
                placeholder="Enter Email" label="Email"
                onChange={()=>onFieldChange('email')}
            />
            
            <div className={moduleStyle['elements-container']}>
                <ActionButton ref={refEmailSend}
                onClick={onclickSubmitEmail}>
                    Send OTP
                </ActionButton>
            </div>
        </div>

        {/* Page 2: OTP Verification */}
        <div className={css.names(`stage-1 page`)}>
            <TextInput containerStyle={{ marginTop:"40px" }}
                ref={refOTP} enterButtonRef={refOTPSend}
                style={{ textAlign:"center", letterSpacing:"5px"}}
                placeholder="OTP" label="OTP"
                onChange={()=>onFieldChange("otp")}
            />
            
            <div className={moduleStyle['elements-container']}>
                <ActionButton ref={refOTPSend}
                bgColor={verifyOtpBtnBgColor}
                onClick={onclickVerifyOtp}>
                    Verify
                </ActionButton>
            </div>
        </div>
    </MainContentContainer>
    </>
};

type StageThreeProps = {
    isActive: boolean;
    cachedPassword: string|null;
    setFns: {
        updateStageStatus: (stage: keyof StageStatus, value: boolean)=> void,
        currentStage: React.Dispatch<React.SetStateAction<number>>,
        //stopTimer: ()=>void
    }
}

/* - - - - - - - - - - - Stage 3: Terms of Service - - - - - - - - - - - */
const StageThree = ({
    isActive, cachedPassword, setFns
}: StageThreeProps)=>{
    
    const css = useMemo(()=> new ModuleClassname(moduleStyle),[moduleStyle]);
    const { effectiveTheme } = useColorContext();

    const [message, setMessage] = useState<Message>(null);
    const { pushNotification } = useNotification();

    const [currentPage, setCurrentPage] = useState<1|2>(1);

    type SessionData = Partial<SignupCredential['hset']>|null;
    const [sessionData, setSessionData] = useState<SessionData>(null);

    // Terms of Servie and Privacy Policy
    const [isAcknowledged, setIsAcknowledged] = useState(false);

    // Fetches Session Data
    useEffect(()=>{
        const fetchSessionData = async()=>{
            let isCritical = false;
            let heading = "Error";
            try {
                const response = await fetch("/api/authenticate/fetch",{
                    method: "GET",
                });
                const responseData = (await response.json() as Status)
                    .data as Partial<SignupCredential['hset']>|null;
                
                // If fetched data isn't found
                if (!response.status || !responseData){
                    isCritical = true;
                    throw new Error("Session may have expired! Please try again after a refresh.");
                }
                
                for (const key in responseData){
                    if (responseData[key as keyof typeof responseData] === 0){
                        heading = "Incomplete";
                        throw new Error("Signup is not complete. Please complete the signup process.");
                    }
                }
                setSessionData(responseData);
                
            } catch (error:any) {
                setSessionData(null);
                setMessage({
                    heading: heading,
                    body: error.message,
                    critical: isCritical
                });
            }
        }

        if (isActive) fetchSessionData();
        else {
            setCurrentPage(1);
            setSessionData(null);
            setMessage(null);
        };

    },[isActive]);

    const onclickCreateAccount = async ()=>{
        if (!isAcknowledged) return;
        try {
            const response = await fetch("/api/authenticate/signup",{
                method: "POST",
                body: JSON.stringify({
                    password: cachedPassword
                })
            });
            const responseData: Status = await response.json();

            if (!responseData.status){
                throw new Error(responseData.error||responseData.message)
            }

            setFns.updateStageStatus("three", true);
            setFns.currentStage(4);

        } catch (error:any) {
            pushNotification(error.message,{
                color:"red", duration: 7000
            })
        }
    }

    const createAccountBtnBgColor = useMemo(()=>({
        light: 'rgb(51, 148, 116)',
        dark: 'rgb(46, 143, 110)',
    }),[effectiveTheme]);
    
    // Styles of elements
    const pageStyles = useMemo(()=>({
        elementsContainer: {
            flexDirection:"column", flexGrow:"1", gap:"6px"
        } satisfies React.CSSProperties,
        unavailable:{
            paragraph: {
                maxWidth:"clamp(100px, 90%, 300px)",
                textAlign:"center", fontSize:"1rem"
            } satisfies React.CSSProperties,
            hr: {
                width:"100%", border:"none", height:"1px",
                background:effectiveTheme==="light"
                    ? "rgba(0, 68, 255, 0.3)"
                    : "rgba(0, 255, 200, 0.3)",
                margin:"15px 0"
            } satisfies React.CSSProperties
        },
        overview: {
            proceedBtn: {
                marginTop:"auto", flex:"0 0 fit-content"
            } satisfies React.CSSProperties,
            table: {
                tableLayout:"auto", width:"100%"
            } satisfies React.CSSProperties,
        },
        policies: {
            createBtn: {
                marginTop:"auto", flex:"0 0 fit-content"
            } satisfies React.CSSProperties,
            checkboxSection: {
                display:"flex", alignItems:"center", gap:"10px",
                marginBottom:"3px"
            } satisfies React.CSSProperties
        }
    }),[effectiveTheme]);

    return <>
    <BackButton isActive={currentPage===2 && !!sessionData}
    onClick={()=>setCurrentPage(1)}/>
    <MainContentContainer
        page={sessionData===null?1:currentPage}
        message={message} setMessage={setMessage}
    >{
        sessionData===null?<>
        {/* Not Available Page */}
        <div className={css.names(`stage-1 page center`)}>
            <p style={pageStyles.unavailable.paragraph}>
                Signup steps are incomplete. Complete them first.
            </p>
            <hr style={pageStyles.unavailable.hr}/>
            <p style={pageStyles.unavailable.paragraph}>
                Session may have expired. Please try again after a refresh.
            </p>
        </div>
    </>:<>
        {/* Credential Overview Page */}
        <div className={css.names(`stage-1 page`)}>
        <div className={css.names(`elements-container`)}
            style={pageStyles.elementsContainer}
        >
            <h2 style={{textAlign:"center"}}>Credentials</h2>
            <table style={pageStyles.overview.table}>
            <tbody className={moduleStyle['list-body']}>
                <tr>
                    <th>Username</th>
                    <td>{sessionData.username}</td>
                </tr>
                <tr>
                    <th>Email</th>
                    <td>{sessionData.email}</td>
                </tr>
                <tr>
                    <th>Password</th>
                    <td>{cachedPassword ?? "—"}</td>
                </tr>
            </tbody>
            </table>
            <ActionButton onClick={()=> setCurrentPage(2)}
            style={pageStyles.overview.proceedBtn}>
                Proceed
            </ActionButton>
        </div>
        </div>

        {/* Policies Page */}
        <div className={css.names(`stage-1 page`)}>
        <div className={css.names(`elements-container`)}
            style={pageStyles.elementsContainer}
        >
            <h2 style={{margin:"0 auto"}}>Agreement</h2>
            <p>By creating an account, you agree to our Terms of Service and acknowledge our Privacy Policy.</p>
            <div style={pageStyles.policies.checkboxSection}>
                <CheckBox checked={isAcknowledged}
                onChange={(e)=>setIsAcknowledged(e.target.checked)}/>
                <label>I have read and agree.</label>
            </div>
            
            <ActionButton disabled={!isAcknowledged}
            onClick={onclickCreateAccount}
            bgColor={createAccountBtnBgColor}
            style={pageStyles.policies.createBtn}>
                Create Account
            </ActionButton>
        </div>
        </div>
    </>}
    </MainContentContainer>
    </>
}

type StageFourProps = {
    show: boolean,
}
const StageFour = ({show}: StageFourProps)=>{
    const css = useMemo(()=>new ModuleClassname(moduleStyle),[moduleStyle])
    const { effectiveTheme } = useColorContext();
    
    const refCanvas = useRef<HTMLCanvasElement>(null);

    const styles = useMemo(()=>({
        page: {
            flexGrow:1, display:"flex",
            flexDirection:"column",
            color:"rgba(0, 0, 0, 0.8)",
            alignItems:"center", justifyContent:"center",
            // position:'relative',
            // background:"rgba(0, 0, 0, 0.25)"
        } satisfies React.CSSProperties,
        heading:{
            textAlign:"center",
            textShadow:"0 1px 3px rgba(0, 0, 0, 0.15)",
            color: effectiveTheme==="light"
                ? "rgb(71, 93, 218)"
                : "rgb(83, 78, 160)"
        } satisfies React.CSSProperties,
        canvas: {
            
            pointerEvents:"none",
            position:"absolute",
            height:"98%", width:"100%",
            top:0, left:0, right:0,
            maskImage: "linear-gradient(black 80%, transparent 96%)",
            // background:"rgba(0, 0, 0, 0.6)"
        } satisfies React.CSSProperties,
        button: {
            flex:"0 0 auto",
            marginTop:"6px"
        } satisfies React.CSSProperties,
        buttonColors: {
            light: undefined,
            dark: "rgb(72, 81, 204)"
        }
    }),[effectiveTheme]);

    return <>
    <SuccessCard show={show} canvasRef={refCanvas}>
        <div className={css.names(`page`)} style={styles.page}>
            <canvas ref={refCanvas} style={styles.canvas}/>
            <h2 style={styles.heading}>Welcome to We Learn!</h2>
            <p style={{
                textAlign:"center",
                textShadow:"0 1px 3px rgba(0, 0, 0, 0.15)"
            }}>
                Your account has been created successfully. 
                You are ready for your learning journey.
            </p>
            <ActionButton href="/home/dashboard"
                bgColor={styles.buttonColors}
                style={styles.button}
            >Dashboard ⇨</ActionButton>
        </div>
    </SuccessCard>
    
    </>
}