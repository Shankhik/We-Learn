"use client";

import Button from "@/components/buttons/NewButton";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import StagesIcons from "../components/StagesIcons";
import { Clamp, Fade, Card, InputField, Note as NoteMessage, Stages, CheckBox } from "../components/Elements";
import useMainContexts from "@/lib/hooks/useMainContexts";
import useDebouncing from "@/lib/hooks/useDebouncing";
import { checkEmail, checkOtp, checkUsername } from "@/lib/purify/check";
import { colorScheme } from "@/lib/color/appColors";
import { useCountdown } from "@/lib/hooks/useTimer";
import { apiFetch } from "@/lib/fetchReq";
import { timingsInMinutes } from "@/lib/time";

type ButtonProps = React.ComponentProps<typeof Button>

type NoteMessage = React.ComponentProps<typeof NoteMessage>['message']

type SessionTimerSectionProps = {
    timeFormat: ReturnType<typeof useCountdown>['timeFormat'],
    // lowTime: boolean,
    isVisible: boolean,
    hasExpired: boolean
}
const SessionTimerSection = ({
    timeFormat, isVisible, hasExpired
}:SessionTimerSectionProps)=>{
    const {effectiveTheme, returnOnTheme} = useMainContexts();
    return <>
    
    <div style={{
        display:"flex", alignItems: "baseline", gap:"10px", margin:"0 5px 0 auto",
        transition: "all 0.3s ease",
        color: returnOnTheme("rgb(127, 128, 153)","rgb(111, 113, 138)"),
        height: isVisible?"30px":"0px",
        opacity: isVisible? 1:0
    }}>
        <h5 style={{
            overflow: "hidden",
            minWidth: "0px", //maxWidth:"30px",
            whiteSpace: "nowrap", textOverflow:"ellipsis"
        }}>{hasExpired? "Session Expired":"Time Left"} </h5>
        <h2 style={{
            color: hasExpired
            ? colorScheme.accent.red[effectiveTheme]
            : isVisible? colorScheme.accent.blue[effectiveTheme]: ''
        }}>{String(timeFormat.minutes).padStart(2,"0")}:{String(timeFormat.seconds).padStart(2,"0")}</h2>
    </div>
    </>
}

type PageUtilContextType = {
    nextButton: {
        click: ()=> void,
        setIsDisabled?: React.Dispatch<React.SetStateAction<boolean>>
        setOnClick?: React.Dispatch<React.SetStateAction<()=>Promise<void>|void>>
    },
    // References
    refUsername?: React.RefObject<HTMLInputElement|null>,
    refPassword?: React.RefObject<HTMLInputElement|null>,
    refEmail?: React.RefObject<HTMLInputElement|null>,
    refOtp?: React.RefObject<HTMLInputElement|null>,
    refNextButton?: React.RefObject<HTMLButtonElement|null>,
    
    // Current Stage + Setter
    currentStage: 1|2|3|3.5|4|5,
    updateCurrentStage: (mode:"next"|"prev")=>void,
}
/* On Click Functions */
const PageUtilContext = createContext<PageUtilContextType>({
    nextButton: {
        click: ()=>{}
    },
    currentStage: 1,
    updateCurrentStage: (mode:"next"|"prev")=>{},
});

export default function SignupPage (){
    const { effectiveTheme, returnOnTheme } = useMainContexts();
    
    /* - - - - - - - - - - - Current Stage + Utils - - - - - - - - - - - */
    
    const stages = useMemo(()=>({
        Username: <StagesIcons type="user"/>,
        Password: <StagesIcons type="password"/>,
        Email: <StagesIcons type="email"/>,
        "Terms & Conditions": <StagesIcons type="document"/>,
        Success: <StagesIcons type="ok"/>,
    }),[]);

    const [currentStage, setCurrentStage] = useState<PageUtilContextType['currentStage']>(1);
    
    const updateCurrentStage = useCallback((mode: "next"|"prev"|number)=>{
        setCurrentStage(prev=>{
            if (typeof mode==='number'){
                return mode as any;
            }
            switch (mode){
                case "next":
                    if (Math.floor(prev)===3) return prev+0.5;
                    return Math.min(5, prev+1);
                case "prev":
                    if (Math.ceil(prev)===4) return prev-0.5;
                    return Math.max(1, prev-1);
                default: return prev;
            }
        })
    },[]);

    /* - - - - - - - - - - - - - Timer + Utils - - - - - - - - - - - - - */
    const timer = useCountdown(timingsInMinutes.signupSessionJwt*60);

    const [timerDetails, setTimerDetails] = useState({
        started: false,
        expired: false
    });
    const startSession = useCallback((countdownTime?: number)=>{
        // Can be started only once
        if (timerDetails.started || timerDetails.expired) return;
        timer.start(countdownTime);
    },[timerDetails.expired, timerDetails.started, timer.start]);

    useEffect(()=>{
        if (currentStage===5){
            timer.pause();
            return;
        }
        if (timer.timerState === "expired"){
            if (timerDetails.started){
                setTimerDetails(prev=>({
                    ...prev,
                    expired: true
                }));
            }
        }else if (timer.timerState === "running"){
            // sets "started" -> true
            setTimerDetails(prev=>{
                if (prev.started)
                    return prev;
                return {
                    ...prev,
                    started: true
                }
            });
        }
    },[timer.timerState, currentStage]);

    //useEffect(()=>{console.log(timer.timeLeft)},[timer.timeLeft]);
    
    // Clears Existing Session using Cookie
    useEffect(()=>{
        const clearSession = async()=>{
            const res = await apiFetch("/api/authenticate/clear-session");
        }
        clearSession();
    },[]);
    

    /* - - - - - - - - - - - - - References - - - - - - - - - - - - - */
    const refUsername = useRef<HTMLInputElement>(null);
    const refPassword = useRef<HTMLInputElement>(null);
    const refEmail = useRef<HTMLInputElement>(null);
    const refOtp = useRef<HTMLInputElement>(null);
    const refNextButton = useRef<HTMLButtonElement>(null);

    /* - - - - - - - - - - Next Button Relates - - - - - - - - - - */
    // OnClick Function
    const [nextOnClick, setNextOnClick] = useState(()=> (()=>{alert("clicked")}))
    
    // Is Disabled?
    const [isDisabled, setIsDisabled] = useState(true);

    // Button Props
    const nextButtonProps: ButtonProps = useMemo(()=>({
        // href: currentStage===3? "/":undefined,
        disabled: isDisabled,
        ref: refNextButton,
        showLoading: true,
        children:
            currentStage < 3? <>Next</> :
            currentStage === 3? <>Send Email</>:
            currentStage === 3.5? <>Verify</>:
            currentStage === 4? <>Signup</> :
            <>Go to Home Page</>,
        onClick:nextOnClick
    }),[nextOnClick, currentStage, isDisabled]);

    /* - - - - - - - - - - - - - - - - - Styles - - - - - - - - - - - - - - - - - */
     
    type ButtonStyleProps = Pick<ButtonProps,'style'|'hoverStyle'|'disabledStyle'>
    
    const fadePageNumber = useMemo(()=>{
        return currentStage<=3? currentStage: Math.floor(currentStage+1)
    },[currentStage]);

    // Back Button Style
    const stylesBackButton: ButtonStyleProps = useMemo(()=>({
        style: {
            opacity: currentStage=== 5? 0: 1,
            padding: "0", width:"60px", fontSize:"0.85rem",
            height:"30px", borderRadius:"10px", marginRight:"7px",
        },
        disabledStyle: {
            opacity: currentStage === 5? 0: 0.5, filter: "brightness(80%)"
        }
    }),[currentStage]);

    // Next Button Style
    const stylesNextButton: ButtonStyleProps = useMemo(()=>({
        style: {
            minWidth:"50%",
            borderRadius:"10px",
            color: "rgba(255, 255, 255, 0.8)",
            backgroundColor: colorScheme.accent.blue[effectiveTheme]
        },
        disabledStyle: {
            filter:"saturate(70%)",
            opacity: currentStage === 5? 0: 0.5,
            pointerEvents: "none"
        }
    }),[effectiveTheme, currentStage]);
    
    return <>
    <Stages activeStage={Math.floor(currentStage)} stages={stages}/>
    <Clamp>
        <SessionTimerSection timeFormat={timer.timeFormat}
            isVisible={timerDetails.started && currentStage!==5}
            hasExpired={timerDetails.expired}
        />
    <PageUtilContext.Provider
        value={{
            // Next Button Related
            nextButton: {
                setIsDisabled,
                click: ()=> refNextButton.current?.click(),
                setOnClick: setNextOnClick
            },
            // References
            refPassword, refUsername, refEmail, refOtp, refNextButton,
            // Current Stage  Setter
            currentStage, updateCurrentStage
        }}
    >
        <div>
            <Button {...stylesBackButton}
            disabled={currentStage===5 || currentStage===1}
            onClick={(e)=> updateCurrentStage("prev")}
            >Back</Button>
        </div>
        <Fade page={fadePageNumber}
            style={{
                height: currentStage===5
                ? "400px": currentStage === 4
                ? "200px": undefined,
                translate: currentStage===5? "0 -20px":undefined
            }}
        >
            <StageUsername stageNumber={1} startSession={startSession}/>
            <StagePassword stageNumber={2}/>
            <StageEmail stageNumber={3}/>
            <StageOtp stageNumber={3.5}/>
            <StageTermsNConditions stageNumber={4}/>
            <StageComplete stageNumber={5}/>
            
        </Fade>
        <div>
            {/* Next Button */}
            <Button {...stylesNextButton} {...nextButtonProps}/>
        </div>
    </PageUtilContext.Provider>    
    </Clamp>
    </>
}
type StagesProps <T extends unknown = unknown> = T & {
    stageNumber: PageUtilContextType['currentStage']
}
const StageUsername = ({stageNumber, startSession}:StagesProps<{
    startSession: (countdown?: number)=> void
}>)=>{
    const { nextButton,
        currentStage, updateCurrentStage,
        refUsername, refNextButton
    } = useContext(PageUtilContext);
    
    const [syntaxCheck, setSyntaxCheck] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);

    const [note, setNote] = useState<NoteMessage>(null);

    // Last Search Query + Result
    const [lastSearch, setLastSearch] = useState({
        query: "",
        result: false
    });

    // Updates Last Search
    const updateLastSearch = useCallback((query?: string, result?: boolean)=>{
        setLastSearch(prev=>{
            return {
                ...prev,
                ...(query !== undefined?{ query }:undefined),
                ...(result !== undefined?{ result }:undefined),
            }
        })
    },[]);
    // Overwrites on click function
    useEffect(()=>{
        if(currentStage === stageNumber && nextButton.setOnClick){
            nextButton.setOnClick(()=>(()=>{
                updateCurrentStage("next")
            }));
        }
    },[currentStage]);

    // Overwrites next button disability
    useEffect(()=>{
        if (currentStage === stageNumber && nextButton.setIsDisabled){
            nextButton.setIsDisabled((prev)=>{
                if (!refUsername?.current) return true;
                
                if (
                    // If Search Result Fails
                    ! lastSearch.result
                    // If current value doesn't match the last query 
                    || lastSearch.query !== refUsername.current.value
                    // If Result is loading
                    || isLoading
                    // If Field is Empty
                    || isEmpty
                ) return true;
                return false;
            })
        }
    },[currentStage, lastSearch, isEmpty, isLoading]);

    // Timeout Side Effect
    const { onChange: debouncingOnChange } = useDebouncing(async()=>{
        if (!refUsername?.current) return;
        if (isEmpty){
            updateLastSearch("",false);
            return;
        };
        if (!syntaxCheck){
            return;
        }
        const value = refUsername?.current.value;
        
        if (lastSearch.query === value) return;
        
        setIsLoading(prev=> prev? prev: true);
        try {
            const response = await fetch("/api/authenticate/check-signup?type=username",{
                method: "POST", body: JSON.stringify({
                    username: refUsername.current.value
                })
            });

            const responseData: Status = await response.json();

            if (!responseData.status){
                if (response.status>=500)
                    throw new Error("Session may have expired! Try refreshing.");
                setNote({
                    mode: "warn",
                    message: responseData.error||responseData.message
                });
            }else{
                startSession();
                setNote({ mode: "ok", message: responseData.message });
            }
            updateLastSearch(value, responseData.status);
        } catch (error:any) {
            setNote({
                mode: "critical",
                message: error.message
            });
            updateLastSearch(value, false);
        }
        setIsLoading(prev=> !prev? prev: false);
    }, 2000, 1000);

    // Cutomized On Change Event for Username Input
    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>)=>(
        debouncingOnChange(undefined,()=>{
            if (e.currentTarget.value === ""){
                setSyntaxCheck(prev=> !prev? prev: false);
                setNote(null);
                setIsEmpty(prev=> prev? prev:true);
                return;
            }
            if (!checkUsername(e.currentTarget.value)){
                setSyntaxCheck(prev => !prev? prev: false);
                setNote({
                    mode: "critical",
                    message: <>It can only contain (a-z) (A-Z) (0-9) - _ @ # $ % & *</>
                });
            }
            else{
                setNote(null);
                setSyntaxCheck(prev=> prev? prev: true);
                
                setIsEmpty(prev=> !prev? prev: false);
            }
        })
    ), [debouncingOnChange]);
    
    return <>
    <Card inert={currentStage!==stageNumber}
    style={{padding: "max(50px, 7%) 0 20px",}}>
        <InputField showLoading={isLoading}
            submitButtonRef={refNextButton}
            ref={refUsername}
            onChange={onChange}
        >Username</InputField>
        <NoteMessage message={note}/>
    </Card>
    </>
}


const StagePassword = ({stageNumber}:StagesProps)=>{
    const { nextButton,
        currentStage, updateCurrentStage,
        refPassword, refNextButton
    } = useContext(PageUtilContext);
    
    const [syntaxCheck, setSyntaxCheck] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);

    const [note, setNote] = useState<NoteMessage>(null);

    // Overwrites on click function
    useEffect(()=>{
        if(currentStage===stageNumber && nextButton.setOnClick){
            nextButton.setOnClick(()=>(async()=>{
                const value = refPassword?.current?.value || "";
                
                try {
                    const res = await apiFetch("/api/authenticate/check-signup?type=password",{
                        password: value
                    });
                    //const res5 = await apiFetch("/api/authenticate/check-signup?type=password", "Hellow API");
                    if (!res.data.status){
                        if (res.status>=500){
                            throw new Error("Something went wrong! Try Refreshing.")
                        }

                        setNote({
                            mode:"warn",
                            message: res.data.message||res.data.error
                        });
                    }
                    updateCurrentStage("next")

                } catch (error:any) {
                    setNote({
                        mode:"critical",
                        message: error.message
                    });
                }
            }));
        }
    },[currentStage]);

    // Overwrites next button disability
    useEffect(()=>{
        if (currentStage === stageNumber && nextButton.setIsDisabled){
            nextButton.setIsDisabled((prev)=>{
                if (
                    !refPassword?.current
                    || isEmpty
                    || !syntaxCheck
                
                ) return true;
                return false;
            });
        }
    },[currentStage, isEmpty, syntaxCheck]);

    // Cutomized On Change Event for Username Input
    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
        
        if (e.currentTarget.value === ""){
            setIsEmpty(prev=> prev? prev: true); return;
        }
        setIsEmpty(prev=> !prev? prev: false);

        // If Syntax Check Fails
        if (!checkUsername(e.currentTarget.value)){
            setSyntaxCheck(prev=> !prev? prev: false);
            setNote({
                mode: "critical",
                message: <>It can only contain (a-z) (A-Z) (0-9) - _ @ # $ % & *</>
            });
        } else{
            setSyntaxCheck(prev=> prev? prev: true);
            setNote(null);
        }
    }, []);

    return <>
    <Card inert={currentStage !== stageNumber}
    style={{padding: "max(50px, 7%) 0 20px"}}>
        <InputField usePassword
        ref={refPassword} onChange={onChange}
        submitButtonRef={refNextButton}
        >Password</InputField>
        <NoteMessage message={note}/>
    </Card>
    </>
}
const StageEmail = ({stageNumber}:StagesProps)=>{
    const {
        currentStage, updateCurrentStage,
        nextButton,
        refEmail, refOtp, refNextButton
    } = useContext(PageUtilContext);

    const [isLoading, setIsLoading] = useState()
    const [syntaxCheck, setSyntaxCheck] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const [note, setNote] = useState<NoteMessage>(null);

    const { onChange: debouncingOnChange, isActive: isDebouncingActive } = useDebouncing(()=>{
        if (isEmpty) {
            // Resets Syntax error Note
            setSyntaxCheck(false);
            // setSyntaxCheck(prev => !prev? prev: false);
            return;
        };

        if (!checkEmail(refEmail?.current?.value)){
            setSyntaxCheck(false);
            // setSyntaxCheck(prev => !prev? prev: false);
            return;
        }
        setSyntaxCheck(true);
        // setSyntaxCheck(prev => prev? prev: true);
    }, 100, 1200);

    // Field Note Handling
    useEffect(()=>{
        if (isEmpty){
            setNote(prev=> prev===null? prev: null);
            return;
        }
        if (!syntaxCheck && !isDebouncingActive){
            setNote({
                mode:"critical",
                message: "Invalid email address"
            }); return;
        }
        setNote(prev=> prev===null? prev: null);
        
    },[isEmpty, syntaxCheck, isDebouncingActive]);

    // Overwrite Next Button OnClick
    useEffect(()=>{
        if (currentStage!==stageNumber || !nextButton.setOnClick) return;
        nextButton.setOnClick(()=> async ()=>{
            if ( !syntaxCheck || isEmpty || !refEmail?.current) return;
            try {
                const response = await apiFetch("/api/authenticate/check-signup?type=email",{
                    email: refEmail.current.value
                });
                if (!response.data.status){
                    if(response.status>=500){
                        throw new Error("Something went wrong! Try refreshing.");
                    }
                    setNote({
                        mode: "warn", message: response.data.error || response.data.message
                    }); return;
                }
                updateCurrentStage("next");
            } catch (error:any) {
                setNote({
                    mode: "critical", message: error.message
                });
            }
        })
        
    },[currentStage, nextButton.setOnClick, syntaxCheck,, isEmpty]);

    // Overwrite Next Button Disability
    useEffect(()=>{
        if(currentStage !== stageNumber || !nextButton.setIsDisabled)
            return;
        nextButton.setIsDisabled(
            !syntaxCheck || isEmpty || isDebouncingActive
        );
        
    },[ nextButton.setIsDisabled, currentStage,
        syntaxCheck, isEmpty, isDebouncingActive
    ]);

    const onChangeEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>)=>(
        debouncingOnChange(e,()=>{
            setNote(prev=> prev===null? prev: null);
            if(e.currentTarget.value===""){
                setIsEmpty(prev=> prev? prev: true);
                return;
            }
            setIsEmpty(prev=> !prev? prev: false);
            // Syntax Check is handled by Debouning Side Effect
        })
    ),[debouncingOnChange]);

    return <>
    <Card inert={currentStage!== stageNumber}
    style={{padding: "max(50px, 7%) 0 20px"}}>
        <InputField type={"email"}
        ref={refEmail} onChange={onChangeEmail}
        submitButtonRef={refNextButton}
        >Email</InputField>
        <NoteMessage message={note}/>
    </Card>
    </>
}
const StageOtp = ({stageNumber}:StagesProps)=>{
    const {
        currentStage, updateCurrentStage,
        nextButton,
        refEmail, refOtp, refNextButton
    } = useContext(PageUtilContext);

    const [syntaxCheck, setSyntaxCheck] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const [note, setNote] = useState<NoteMessage>(null);

    const {onChange: debouncingOnChange, isActive: isDebouncingActive} = useDebouncing(()=>{
        if (isEmpty){
            setSyntaxCheck(prev=> !prev? prev: false);
            return;
        }
        if (!checkOtp(refOtp?.current?.value, 6)){
            setSyntaxCheck(prev=> !prev? prev: false);
            return;
        }
        setSyntaxCheck(prev=> prev? prev: true);
    },20, 1200);

    // Handles Input Field's Note
    useEffect(()=>{
        if (isEmpty){
            setNote(prev=> prev===null? prev:null);
            return;
        }
        if (!syntaxCheck && !isDebouncingActive){
            setNote({
                mode:"critical",message:"OTP must be a 6-digit number"
            }); return;
        }
        setNote(prev=> prev===null? prev:null);
    },[syntaxCheck, isEmpty, isDebouncingActive]);

    // Overwrite Next Button OnClick
    useEffect(()=>{
        if ( currentStage!==stageNumber || !nextButton.setOnClick) return;
        nextButton.setOnClick(()=> async ()=>{
            if (!refEmail?.current || !refOtp?.current) return;
            const value = refOtp.current.value.trim();
            try {
                const response = await apiFetch("/api/authenticate/check-signup?type=email",{
                    otp: value
                });

                if (!response.data.status){
                    if(response.status >= 500)
                        throw new Error("Something went wrong! Try refreshing");
                    setNote({
                        mode: "critical",
                        message: "Incorrect OTP"
                    }); return;
                }
                updateCurrentStage("next");
            } catch (error:any) {
                setNote({
                    mode: "critical",
                    message: error.message
                });
            }
        });
    },[currentStage, nextButton.setOnClick]);

    // Overwrite Next Button Disability
    useEffect(()=>{
        if (currentStage !== stageNumber || !nextButton.setIsDisabled ) return;
        nextButton.setIsDisabled( isEmpty || !syntaxCheck || isDebouncingActive);
    },[currentStage, nextButton.setIsDisabled, syntaxCheck, isEmpty, isDebouncingActive]);

    // On OTP change
    const onChangeOtp = (e: React.ChangeEvent<HTMLInputElement>)=>(
        debouncingOnChange(e,()=>{
            if (e.currentTarget.value === ""){
                setIsEmpty(prev=> prev? prev: true);
                // setSyntaxCheck(prev=> !prev? prev: false);
                return;
            }
            setIsEmpty(prev=> !prev? prev: false);
            
            // Syntax Check is Handled by Debouncing Side Effect
        })
    )
    
    return <>
    <Card inert={currentStage!==stageNumber}
    style={{padding:"max(50px, 7%) 0 20px"}}>
        <InputField style={{textAlign:"center", letterSpacing:"5pt", fontSize:"1.4rem"}}
        ref={refOtp} onChange={onChangeOtp}
        submitButtonRef={refNextButton}
        >OTP</InputField>
        <NoteMessage message={note}/>
    </Card>
    </>
}
const StageTermsNConditions = ({stageNumber}:StagesProps)=>{
    
    const { effectiveTheme, updateAuth } = useMainContexts()
    
    const {
        currentStage, updateCurrentStage,
        nextButton, refPassword
    }= useContext(PageUtilContext)

    const [note, setNote] = useState<NoteMessage>(null);
    const [isChecked, setIsChecked] = useState(false);
    
    // Overwrites OnClick
    useEffect(()=>{
        if (currentStage!==stageNumber || !nextButton.setOnClick) return;
        nextButton.setOnClick(()=> async()=>{
            if (!refPassword?.current) return;

            try {
                const response = await apiFetch("/api/authenticate/signup",{
                    password: refPassword.current.value
                });

                if (!response.data.status){
                    if(response.status>=500)
                        throw new Error("Something went wrong! Try refreshing");

                    setNote({
                        mode: "warn",
                        message: response.data.error || response.data.message
                    });
                }
                updateAuth()
                updateCurrentStage("next");
            } catch (error:any) {
                setNote({
                    mode: "critical",
                    message: error.message
                });
            }
        });
    },[currentStage, nextButton.setOnClick]);

    // Overwrites Disability
    useEffect(()=>{
        if (currentStage === stageNumber && nextButton.setIsDisabled){
            nextButton.setIsDisabled(
                !isChecked
            );
        }
    },[currentStage, nextButton.setIsDisabled, isChecked]);

    return <>
    <Card inert={currentStage!==stageNumber}
    style={{padding: "max(10px, 5%) 0 20px", gap:"9px"}}>
        <h2 style={{
            flexShrink: 0,
            textAlign:"center", overflow:"hidden",
            whiteSpace: "nowrap", textOverflow: "ellipsis"
        }}>Acknowledgment</h2>
        
        <p>By creating an account, you agree to our Terms of Service and acknowledge our Privacy Policy.</p>
        
        <CheckBox
        accentColor={colorScheme.accent.green[effectiveTheme]}
        checked={isChecked}
        onClick={(e)=>{
            setIsChecked(prev=> !prev);
            setNote(prev=> prev===null? prev: null)
        }}
        >I have read and agree.</CheckBox>
        <NoteMessage message={note} style={{margin: "0"}}/>
    </Card>
    </>
}
const StageComplete = ({stageNumber}: StagesProps)=>{
    const {
        effectiveTheme,
    } = useMainContexts();

    const { currentStage, nextButton, refUsername } = useContext(PageUtilContext);
    
    useEffect(()=>{
        if (currentStage!==stageNumber || !nextButton.setIsDisabled) return;
        nextButton.setIsDisabled(true);
    },[currentStage]);

    const gotoButtonStyle: Pick<ButtonProps, 'style'|'hoverStyle'|'hrefMode'> = useMemo(()=>({
        hrefMode: "replace",
        style: {
            userSelect: "none",
            color: colorScheme.getAlpha(
                colorScheme.accent.blue[effectiveTheme], 1
            ),
            border: "1px solid transparent",
            fontSize:"0.85rem",
            padding: "2px 5px", height:"fit-content",
            borderRadius:"6px",
            backgroundColor: colorScheme.getAlpha(
                colorScheme.accent.blue[effectiveTheme], 0.1
            ),
        },
        hoverStyle: {
            border: `1px solid ${colorScheme.accent.blue[effectiveTheme]}`,
        }
    }),[effectiveTheme]);

    return <>
    <Card inert={currentStage !== stageNumber} style={{
        padding: "max(30px,7%) 0", gap:"10px",
        fontSize:"0.95rem"
    }}>
        <h2 style={{textAlign:"center", fontSize:"1.6rem"}}>
            🎉 Welcome to We Learn!
        </h2>
    
        <p>
            Hey {refUsername?.current?.value}! We're excited to have you join our learning community.
            Your account has been created successfully, and you're all set to begin your learning journey. 
        </p>
        <p>Happy learning, and welcome aboard!</p>
        <p>Team <strong>We Learn</strong></p>
        <p style={{fontSize:"0.85rem", textOverflow:"clip", whiteSpace:"nowrap"}}>
            Quick Links:
        </p>
        <div style={{
            display:"flex", gap:"7px", flexWrap: "wrap"
        }}>
            <Button {...gotoButtonStyle} href="/">Homepage</Button>
            <Button {...gotoButtonStyle} href="/home/dashboard">Dashboard</Button>
            <Button {...gotoButtonStyle} href="/settings">Settings</Button>
        </div>
        
    </Card>
    </>
}
