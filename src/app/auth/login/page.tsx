"use client";

import Button from "@/components/buttons/NewButton";
import StagesContainer from "../components/StagesContainer";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import StagesIcons from "../components/StagesIcons";
import { Clamp, Fade, Card, InputField, Note as NoteMessage, Stages } from "../components/Elements";
import useMainContexts from "@/lib/hooks/useMainContexts";
import useDebouncing from "@/lib/hooks/useDebouncing";
import { checkUsername } from "@/lib/purify/check";
import { colorScheme } from "@/lib/color/appColors";
import { useCountdown } from "@/lib/hooks/useTimer";
import { useRouter } from "next/navigation";
import UserProfilePicture from "@/components/misc/UserProfilePicture";
import { UserIcon } from "@/components/icons/Icons";
import Link from "next/link";

type CSS = React.CSSProperties;
type ButtonProps = React.ComponentProps<typeof Button>

type NoteMessage = React.ComponentProps<typeof NoteMessage>['message']

type PageUtilContextType = {
    nextButton: {
        click: ()=> void,
        setIsDisabled?: React.Dispatch<React.SetStateAction<boolean>>
        setOnClick?: React.Dispatch<React.SetStateAction<()=>Promise<void>|void>>
    },
    // References
    refUsername?: React.RefObject<HTMLInputElement|null>,
    refPassword?: React.RefObject<HTMLInputElement|null>,
    refNextButton?: React.RefObject<HTMLButtonElement|null>,
    
    // Current Stage + Setter
    currentStage: 1|2|3,
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

export default function LoginPage (){
    const { effectiveTheme, returnOnTheme } = useMainContexts();

    /* - - - - - - - - - - - Current Stage + Utils - - - - - - - - - - - */
    const stages = useMemo(()=>({
        Username: <StagesIcons type={"user"}/>,
        Password: <StagesIcons type={'password'}/>,
        Success: <StagesIcons type={"ok"}/>,
    }),[]);

    const [currentStage, setCurrentStage] = useState<1|2|3>(1);
    const updateCurrentStage = useCallback((mode: "next"|"prev")=>{
        setCurrentStage(prev=>{
            if (typeof mode==='number'){
                return mode as any;
            }
            switch (mode){
                case "next":
                    return Math.min(3, prev+1);
                case "prev":
                    return Math.max(1, prev-1);
                default: return prev;
            }
        })
    },[]);

    /* - - - - - - - - - - - - - References - - - - - - - - - - - - - */
    const refUsername = useRef<HTMLInputElement>(null);
    const refPassword = useRef<HTMLInputElement>(null);
    const refNextButton = useRef<HTMLButtonElement>(null);

    /* - - - - - - - - - - Next Button Relates - - - - - - - - - - */
    // OnClick Function
    const [nextOnClick, setNextOnClick] = useState(()=> (()=>{alert("clicked")}))
    
    // Is Disabled?
    const [isDisabled, setIsDisabled] = useState(true);

    // Button Props
    const nextButtonProps: ButtonProps = useMemo(()=>({
        href: currentStage===3? "/":undefined,
        disabled: isDisabled,
        ref: refNextButton,
        showLoading: true,
        children:
            currentStage === 1? <>Next</> :
            currentStage === 2? <>Login</>:
            <>Go to Home Page</>,
        onClick:nextOnClick
    }),[nextOnClick, currentStage, isDisabled]);

    /* - - - - - - - - - - - - - - - - - Styles - - - - - - - - - - - - - - - - - */
     
    type ButtonStyleProps = Pick<ButtonProps,'style'|'hoverStyle'|'disabledStyle'>
    
    // Back Button Style
    const stylesBackButton: ButtonStyleProps = useMemo(()=>({
        style: {
            opacity: currentStage===3? 0: 1,
            padding: "0", width:"60px", fontSize:"0.85rem",
            height:"30px", borderRadius:"10px", marginRight:"7px",
        },
        disabledStyle: {
            opacity: currentStage ===3? 0: 0.5, filter: "brightness(80%)"
        }
    }),[currentStage]);
    
    // Switch to Signup Style
    const styleSwitch: CSS = useMemo(()=>({
        display: currentStage!==1?"none":"inline-block",
        margin: "auto 0 auto auto",
        fontSize: "0.9rem", fontWeight: 600,
        color: returnOnTheme("rgba(92, 111, 221, 0.8)","rgba(169, 173, 204, 0.8)")
    }),[currentStage, effectiveTheme]);
    
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
            opacity: 0.5
        }
    }),[effectiveTheme, currentStage]);
    
    return <>
    <Stages activeStage={currentStage} stages={stages}/>
    <PageUtilContext.Provider
        value={{
            // Next Button Related
            nextButton: {
                setIsDisabled,
                click: ()=> refNextButton.current?.click(),
                setOnClick: setNextOnClick
            },
            // References
            refPassword, refUsername, refNextButton,
            // Current Stage  Setter
            currentStage, updateCurrentStage
        }}
    >
    <Clamp>
        <div style={{display:"flex"}}>
            <Button  {...stylesBackButton}
            disabled={currentStage!==2}
            onClick={(e)=> updateCurrentStage("prev")}
            >Back</Button>
            <Link href={"signup"} style={styleSwitch}>
            Signup Instead?</Link>
        </div>
        <Fade page={currentStage}>
            <StageUsername/>
            <StagePassword/>
            <StageComplete/>
        </Fade>
        <div>
            {/* Next Button */}
            <Button {...stylesNextButton} {...nextButtonProps}/>
        </div>
    </Clamp>   
    </PageUtilContext.Provider>
    </>
}

// const StageUsername = ()=>{
//     const {
//         currentStage, updateCurrentStage,
//         refUsername, nextButton, refNextButton
//     } = useContext(PageUtilContext);
    
//     const [isLoading, setIsLoading] = useState(false);
//     const [isEmpty, setIsEmpty] = useState(true);

//     const [note, setNote] = useState<NoteMessage>(null);

//     // Last Search Query + Result
//     const [lastSearch, setLastSearch] = useState({
//         query: "",
//         result: false
//     });

//     // Updates Last Search
//     const updateLastSearch = useCallback((query?: string, result?: boolean)=>{
//         setLastSearch(prev=>{
//             return {
//                 ...prev,
//                 ...(query !== undefined?{ query }:undefined),
//                 ...(result !== undefined?{ result }:undefined),
//             }
//         })
//     },[]);
//     // Overwrites on click function
//     useEffect(()=>{
//         if(currentStage===1 && nextButton.setOnClick){
//             nextButton.setOnClick(()=>(()=>{
//                 updateCurrentStage("next")
//             }));
//         }
//     },[currentStage]);

//     // Overwrites next button disability
//     useEffect(()=>{
//         if (currentStage !== 1 || !nextButton.setIsDisabled) return;
//         nextButton.setIsDisabled(
//             isEmpty || isLoading || !lastSearch.result 
//             || lastSearch.query !== refUsername?.current?.value    
//         )
        
//     },[currentStage, lastSearch, isEmpty, isLoading]);

//     // Debouncing Side Effect
//     const { 
//         onChange: debouncingOnChange,
//         isActive: isDebouncingActive 
//     } = useDebouncing(async()=>{
//         if(!refUsername?.current) return;
//         const value = refUsername.current.value;
        
//         // Regex Check && Empty Field Check
//         if ( isEmpty || !checkUsername(value)) {
//             setIsLoading(false);
//             if (isEmpty) {
//                 updateLastSearch(value, false);
//                 return;
//             }
//             setNote({
//                 mode: "critical",
//                 message: <>It can only contain (a-z) (A-Z) (0-9) - _ @ # $ % & *</>
//             }); 
//             return;
//         }
//         // Last Query
//         if (lastSearch.query === value){
//             // Closes Loading Animation
//             setIsLoading(false); return;
//         }

//         try {
//             // Username's Existence
//             const response = await fetch("/api/authenticate/check-login?type=username",{
//                 method:"POST", body: JSON.stringify({
//                     username: value
//                 })
//             });

//             const responseData:status = await response.json();

//             // If Username not found / Error
//             if (!responseData.status){
//                 if (response.status>=500) throw new Error(
//                     "Something went wrong! Try again after a refresh."
//                 );
//                 setNote({ mode: "warn", message: responseData.error || responseData.message })
//             }else{
//                 setNote({ message: responseData.message, mode: "ok" });
//             }
//             updateLastSearch(value, responseData.status);
//         } catch (error:any) {
//             setNote({
//                 message: error.message,
//                 mode: "critical"
//             });
//             updateLastSearch(value, false);
//         }
//         setIsLoading(false);
//     }, 2000);

//     // Cutomized On Change Event for Username Input
//     const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>)=>(
//         debouncingOnChange(e,()=>{
//             if (e.currentTarget.value === ""){
//                 setIsEmpty(prev=> prev? prev:true)
//             }else{
//                 setIsEmpty(prev=> !prev? prev:false)
//                 setIsLoading(true);
//             }
//             setNote(null);
//         })
//     ), [debouncingOnChange]);

//     return <>
//     <Card inert={currentStage!==1}
//     style={{padding: "max(50px, 7%) 0 20px",}}>
//         <InputField showLoading={isLoading}
//             submitButtonRef={refNextButton}
//             ref={refUsername}
//             onChange={onChange}
//         >Username</InputField>
//         <NoteMessage message={note}/>
//     </Card>
//     </>
// }

const StageUsername = ()=>{
    const {
        currentStage, updateCurrentStage,
        refUsername, nextButton, refNextButton
    } = useContext(PageUtilContext);
    
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const [syntaxCheck, setSyntaxCheck] = useState(false);

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
    
    // Debouncing Side Effect
    const { 
        onChange: debouncingOnChange,
        isActive: isDebouncingActive 
    } = useDebouncing(async()=>{
        if(!refUsername?.current) return;

        const value = refUsername.current.value;

        if (
            isEmpty || !syntaxCheck
            || lastSearch.query === value
        ) return;
        
        setIsLoading(true);

        try {
            // Username's Existence
            const response = await fetch("/api/authenticate/check-login?type=username",{
                method:"POST", body: JSON.stringify({
                    username: value
                })
            });

            const responseData:Status = await response.json();

            // If Username not found / Error
            if (!responseData.status){
                if (response.status>=500) throw new Error(
                    "Something went wrong! Try again after a refresh."
                );
                setNote({ mode: "warn", message: responseData.error || responseData.message })
            }else{
                setNote({ message: responseData.message, mode: "ok" });
            }
            updateLastSearch(value, responseData.status);
        } catch (error:any) {
            setNote({
                message: error.message,
                mode: "critical"
            });
            updateLastSearch(value, false);
        }
        setIsLoading(false);
    }, 2000, 1200);

    // Overwrites on click function
    useEffect(()=>{
        if(currentStage===1 && nextButton.setOnClick){
            nextButton.setOnClick(()=>(()=>{
                updateCurrentStage("next")
            }));
        }
    },[currentStage]);

    // Overwrites next button disability
    useEffect(()=>{
        if (currentStage !== 1 || !nextButton.setIsDisabled) return;
        nextButton.setIsDisabled(
            isEmpty || isDebouncingActive || !lastSearch.result 
            || lastSearch.query !== refUsername?.current?.value    
        )
        
    },[currentStage, lastSearch, isEmpty, isDebouncingActive]);

    

    // Auto Syntax Note Generator
    useEffect(()=>{
        if (isEmpty){
            setNote(prev=> !prev? prev: null); return;
        }
        if (!syntaxCheck && !isDebouncingActive){
            setNote({
                mode: "critical",
                message: <>It can only contain (a-z) (A-Z) (0-9) - _ @ # $ % & *</>
            }); return;
        }
        setNote(prev=> !prev? prev: null);
    },[isEmpty, isDebouncingActive, syntaxCheck]);

    // Cutomized On Change Event for Username Input
    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>)=>(
        debouncingOnChange(e,()=>{
            if (e.currentTarget.value === ""){
                setIsEmpty(prev=> prev? prev:true)
                setSyntaxCheck(prev=> !prev? prev: false);
                return;
            }

            setIsEmpty(prev=> !prev? prev:false);

            if (!checkUsername(e.currentTarget.value)){
                setSyntaxCheck(prev=> !prev? prev: false);
                return;
            }
            setSyntaxCheck(prev=> prev? prev: true)
        })
    ), [debouncingOnChange]);

    return <>
    <Card inert={currentStage!==1}
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
const StagePassword = ()=>{
    const { updateAuth } = useMainContexts();
    const {
        currentStage, updateCurrentStage,
        refPassword, refUsername, refNextButton,
        nextButton
    } = useContext(PageUtilContext);
    
    const [note, setNote] = useState<NoteMessage|null>(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [syntaxCheck, setSyntaxCheck] = useState(false);

    useEffect(()=>{
        if (currentStage!==2 || !nextButton.setOnClick) return;
        
        nextButton.setOnClick(()=>(async()=>{
            if (!refPassword?.current || !refUsername?.current) return;
            if (isEmpty || !syntaxCheck) false;

            // updateCurrentStage("next"); return;
            try {
                const response = await fetch( "/api/authenticate/login",{
                    method:"POST",
                    body: JSON.stringify({
                        username: refUsername.current.value,
                        password: refPassword.current.value
                    })
                });

                const responseData = await response.json() as Status;
                
                if (!responseData.status){
                    if(response.status >= 500) throw new Error(
                        "Something went wrong! Try again after a refresh."
                    );
                    setNote({mode:"critical", message: responseData.error || responseData.message});
                }else{
                    // Goes to the next Stage
                    updateCurrentStage("next");
                    updateAuth();
                }
            } catch (error:any) {
                setNote({mode:"critical", message: error.message})
            }
        }));
    },[currentStage]);
    
    // Overwrites Next Button Disability
    useEffect(()=>{
        if(currentStage !== 2 || !nextButton.setIsDisabled) return;
        nextButton.setIsDisabled(
            !syntaxCheck || !refUsername?.current?.value
        );
    },[currentStage,syntaxCheck]);

    // Auto Syntax Note generator 
    useEffect(()=>{
        if (isEmpty){
            setNote(prev=> !prev? prev: null);
            return;
        }
        if (!syntaxCheck){
            setNote({
                mode: "critical",
                message: <>It can only contain (a-z) (A-Z) (0-9) - _ @ # $ % & *</>
            }); return;
        }
        setNote(prev=> !prev? prev: null);
    },[syntaxCheck, isEmpty]);

    // Field on-change
    const onChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        if (e.currentTarget.value===""){
            setIsEmpty(prev=> prev? prev: true);
            setSyntaxCheck(prev=> !prev? prev: false);
            return;
        }

        setIsEmpty(prev=> !prev? prev: false);

        if (!checkUsername(e.currentTarget.value)){
            setSyntaxCheck(prev => !prev? prev: false);
            return;
        }
        setSyntaxCheck(prev=> prev? prev: true);
    }

    // useEffect(()=>{
    //     console.log("Syntax:", syntaxCheck, "Empty:", isEmpty)
    // },[syntaxCheck, isEmpty]);

    return <>
    <Card inert={currentStage!==2}
    style={{padding: "max(50px, 7%) 0 20px"}}>
        <InputField usePassword
        ref={refPassword} onChange={onChange}
        submitButtonRef={refNextButton}
        >Password</InputField>
        <NoteMessage message={note}/>
    </Card>
    </>
}
const StageComplete = ()=>{
    const { replace } = useRouter();
    const {
        verified, username, profilePicture, displayName,
        effectiveTheme, returnOnTheme
    } = useMainContexts();
    const { currentStage, nextButton } = useContext(PageUtilContext);
    
    const timer = useCountdown(5);

    useEffect(()=>{
        if (currentStage!==3 || !nextButton.setOnClick) return;

        if (timer.timerState==="paused" && verified){
            timer.start();
        }
        
        if (timer.timerState==="expired"){
            replace("/home/dashboard")
        }
    },[verified, currentStage, timer.timerState]);
    
    useEffect(()=>{
        if (currentStage!==3 || !nextButton.setIsDisabled) return;
            nextButton.setIsDisabled(false);
    },[currentStage]);

    const styleDisplayName:CSS = useMemo(()=>({
        overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
        color:"transparent", //width:"fit-content",
        backgroundImage: `linear-gradient(30deg, ${
            returnOnTheme("rgb(169, 77, 255)","rgb(72, 105, 255)")
        }, ${returnOnTheme("rgb(42, 84, 223)","rgb(70, 255, 163)")} 70%)`,
        backgroundClip: "text"
        // backgroundColor:"transparent"
    }),[effectiveTheme])
    return <>
    <Card inert={currentStage!==3} style={{padding: "7% 0"}}>
        <div style={{display:"flex"}}>

            <div style={{overflow:"hidden"}}>
                <p>Welcome Back</p>
                <h2 style={styleDisplayName}>{displayName||username}</h2>
                <p style={{marginTop:"10px"}}>Redirecting to <strong>Dashboard</strong> in {timer.timeLeft}s</p>
            </div>

            <UserIcon style={{
                display: profilePicture? "none":"",
                width: "70px",height:"fit-content", flexShrink:"0",
                backgroundColor: colorScheme.accent.blue[effectiveTheme],
                marginLeft:"auto", borderRadius:"50%"
            }} width="70px" height="70px"/>

            <UserProfilePicture style={{
                marginLeft:"auto", borderRadius:"50%",
                width:"70px", height:"fit-content"
            }} width={100} height={100}
            displayName={displayName} username={username}
            profilePicture={profilePicture}/>
        </div>
    </Card>
    </>
}
