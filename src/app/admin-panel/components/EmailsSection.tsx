"use client";

import moduleStyle from "./EmailsSection.module.css"

import { DropDown, DropDownProps } from "@/components/drop-down/DropDown";
import { useColorContext } from "@/context/colorScheme";
// import { emailRenderMap } from "@/react-emails/emailRenderMap";
import { colorScheme } from "@/lib/color/appColors";

import { 
    ComponentProps, Dispatch, SetStateAction, ComponentType,
    useCallback, useMemo, useState,
    useLayoutEffect,
    CSSProperties, 
} from "react";

import Button from "@/components/buttons/NewButton";
import { renderEmailHtml } from "@/lib/email/renderEmailHtml"
import { useNotification } from "@/context/notification";
import { apiFetch } from "@/lib/fetchReq";
// import useEmailRenderMap from "@/react-emails/useEmailRenderMap";

// Emails
import Welcome from "@/react-emails/emails/Welcome";
import OtpVerification from "@/react-emails/emails/OtpVerification";

const useEmail = ()=>{
    type EmailEntry <T extends ComponentType<any>> = {
        name: string,
        Component: T,
        // getComponent: ()=> T,
        props: ComponentProps<T>
    }

    const map = useMemo(()=>[
        {
            name: "Welcome",
            Component: Welcome,
            // getComponent: ()=> Welcome,
            props: {
                username: "Admin",
                inPreview: true
            }
        } satisfies EmailEntry<typeof Welcome>,
        {
            name: "OtpVerification",
            Component: OtpVerification,
            // getComponent: ()=> OtpVerification,
            props: {
                inPreview: true,
                purpose: "Signup",
                otp: "535678",
                username: "Admin",
            }
        } satisfies EmailEntry<typeof OtpVerification>
    ],[Welcome, OtpVerification]);

    return map
}
export const EmailSection = ()=>{
    const {effectiveTheme, returnOnTheme} = useColorContext();
    const {pushNotification} = useNotification();
    /* - - - - - - - - - - - - - - Email Related - - - - - - - - - - - - - - */
    
    const emailMap = useEmail();
    // const emailMap = useEmailRenderMap();
    
    // Preview Mode
    const [inLandscape, setInLandscap] = useState(true);

    // Active Email number
    const [activeEmail, setActiveEmail] = useState<number|null>(null);
    
    const [emailHtml, setEmailHtml] = useState<string|undefined>(undefined);
    
    // Email html side-effect
    useLayoutEffect(()=>{
        const render = async ()=>{
            if (activeEmail === null) {
                setEmailHtml(undefined)
            }else{
                const data = {
                    Component: emailMap.at(activeEmail)?.Component,
                    props: emailMap.at(activeEmail)?.props
                }
                if (!data.Component) setEmailHtml(undefined);
                else setEmailHtml(
                    await renderEmailHtml(data.Component, data.props)
                );
            }
        }
        render();
    },[activeEmail, emailMap]);

    // Heading Section
    const HeadingChildren = useCallback(()=> <>
        <h3 style={{display: "flex"}}>Email
            <span style={{
                alignSelf:"center", marginLeft: "30px",
                padding: "0 7px", borderRadius: "7px", fontSize:"0.8rem",
                display: process.env.NODE_ENV === "development"? "none":"",
                backgroundColor: returnOnTheme(
                    "rgba(32, 33, 100, 0.1)",
                    "rgba(203, 200, 247, 0.1)"
                )
            }}>disabled | only in DEV</span>
        </h3>
    </>,[process.env.NODE_ENV, effectiveTheme]);
    
    const onClickTestEmail = async ()=>{
        try {
            if (activeEmail === null || !emailHtml) return;
            const response = await apiFetch("/api/admins-only/send-email",{
                recipient: "s.shankhik.555@gmail.com",
                subject: `${emailMap.at(activeEmail)?.name} | DEV-TEST`,
                html: emailHtml
            });
            
            if (!response.data.status){
                console.log(response.data);
                throw new Error(response.data.error||response.data.message);
            }
        } catch (error:any) {
            pushNotification(error.message, {
                color: "red", duration: 5000
            })
        }
    }
    // Drop Down Section Styles
    const stylesDropDown: Pick<DropDownProps, 'activeStyles'|'styles'> = useMemo(()=>({
        activeStyles:{
            heading: {
                backgroundColor: returnOnTheme(
                    "rgba(85, 94, 180, 0.1)",
                    "rgba(114, 119, 190, 0.1)"
                )
            }
        },
        styles: {
            heading: { padding: "10px", borderRadius: "10px" },
            whole: { borderRadius: "10px" },
            collapsingContainer: {
                borderRadius: "10px" 
            },
            childrenContainer: { padding: "10px 0" }
        }
    }),[]);

    const styleEmailContainer: CSSProperties = useMemo(()=>({
        overflow: "hidden",
        transition: "all 0.5s ease",
        height: activeEmail===null ? "0px": "",
        display:"flex", flexDirection:"column",
        // backgroundColor: returnOnTheme("rgba(0, 0, 0, 0.1)", "rgba(255, 255, 255, 0.1)")
    }),[activeEmail]);

    const styleViewportSize: CSSProperties = useMemo(()=>({
        // overflow: "hidden",
        padding: "0px 10px", height:"30px",
        borderRadius: "10px", fontSize: "0.8rem",
        transition: "all 0.5s ease",
        // display:"flex", flexDirection:"column",
        // backgroundColor: returnOnTheme("rgba(0, 0, 0, 0.1)", "rgba(255, 255, 255, 0.1)")
    }),[activeEmail]);

    return <>
    <DropDown useObserver
        disabled={process.env.NODE_ENV!=="development"}
        headingChild={<HeadingChildren/>}
        {...stylesDropDown}
        toggleSvgProps={{
            style:{
                marginRight:"10px"
            }
        }}
    >
        {/* Emails List */}
        <EmailList emailMap={emailMap} active={activeEmail} setActive={setActiveEmail}/>

        {/* Email Preview Section */}
        <div className={moduleStyle['preview-container']}
        style={styleEmailContainer}>
            <div style={{ display: "flex",paddingTop:"10px",
                justifyContent:"flex-end", gap: "5px"
            }}>
                <Button style={{...styleViewportSize}}
                onClick={onClickTestEmail} showLoading
                >Send Test Email</Button>
                <Button style={styleViewportSize}
                onClick={()=>setInLandscap(false)}>
                    Mobile
                </Button>
                <Button style={styleViewportSize}
                onClick={()=>setInLandscap(true)}>
                    Desktop
                </Button>
            </div>

            <EmailIFrame html={emailHtml} style={{
                width: inLandscape? "100%":"90%",
                maxWidth: !inLandscape? "400px":"",
            }}/>
        </div>
    </DropDown>
    </>
}

const EmailList = ({active, setActive, emailMap}:{
    emailMap: ReturnType<typeof useEmail>
    // emailMap: ReturnType<typeof useEmailRenderMap>
    active: number|null,
    setActive: Dispatch<SetStateAction<number|null>>
})=>{
    const {effectiveTheme, returnOnTheme} = useColorContext()

    const emailsList = useMemo(()=> emailMap.map((email,i) =>{
        return (
        <span className={moduleStyle['email-name']}
            style={{
                boxShadow: `1px 2px 3px inset ${active===i
                    ? returnOnTheme("rgba(40, 40, 66, 0.1)","rgba(135, 147, 255, 0.1)")
                    : "transparent"
                }`,
                backgroundColor: active ===i
                ? returnOnTheme("rgba(85, 94, 180, 0.05)","rgba(114, 119, 190, 0.05)")
                : "transparent",
                color: active === i
                ? colorScheme.accent.blue[effectiveTheme]
                : "inherit",
                border: `1px solid ${active===i
                    ? returnOnTheme("rgba(40, 40, 66, 0)","rgba(72, 72, 116, 0.2)")
                    : returnOnTheme("rgba(40, 40, 66, 0.1)","rgba(72, 72, 116, 0.2)")
                }`,
            }} key={i}
            onClick={()=>{
                setActive(prev=>{
                    // Is already active
                    if (prev === i) return null;
                    return i;
                })
                
            }}
        >{email.name}</span>)
    }),[emailMap, active]);
    return <>
    <div className={moduleStyle['list']}>
        {emailsList}
    </div>
    </>
}

type EmailIFrameProps = {
    html: string|undefined,
    style?: CSSProperties
}
const EmailIFrame = ({
    html, style
}: EmailIFrameProps)=>{
    
    const {returnOnTheme} = useColorContext();
    return <>
        <iframe className={moduleStyle['hide-scrollbar']}
        srcDoc={html}
        style={{
            marginTop:"7px",
            transition: "all 0.3s ease",
            alignSelf:"center",
            // Important
            minHeight: "0px", minWidth: "160px",
            flexGrow:1, flexShrink:1, overflow: "auto",
            
            backgroundColor: returnOnTheme(
                "rgba(85, 94, 180, 0.1)",
                "rgba(114, 119, 190, 0.1)"
            ),
            border: "none", borderRadius:"10px",
            ...style,
        }}
    />
    </>
}

// type EmailPreviewProps<T extends ComponentType<any>> = {
//     style?: CSSProperties,
//     component: T|undefined,
//     componentProps?: ComponentProps<T>,
// }

// const EmailPreview = <T extends ComponentType<any>>({
//     component: Component, componentProps, style,
// }: EmailPreviewProps<T>)=>{
//     const {returnOnTheme} = useColorContext();
//     const [emailHtml, setEmailHtml] = useState<string|undefined>(undefined);

//     useLayoutEffect(()=>{
//         const renderEmail = async()=>{
//             let html: string|undefined;
//             try {
//                 if (!Component) throw Error("Not Found");
//                 html = await renderEmailHtml(Component, componentProps);
//             } catch (error) {
//                 html = undefined;
//             }
//             setEmailHtml(prev => prev === html? prev: html);
//         }

//         renderEmail();
//     },[Component, componentProps]);
    
//     return <>
//         <iframe className={moduleStyle['hide-scrollbar']}
//         srcDoc={emailHtml}
//         style={{
//             marginTop:"7px",
//             transition: "all 0.3s ease",
//             alignSelf:"center",
//             // Important
//             minHeight: "0px", minWidth: "160px",
//             flexGrow:1, flexShrink:1, overflow: "auto",
            
//             backgroundColor: returnOnTheme(
//                 "rgba(85, 94, 180, 0.1)",
//                 "rgba(114, 119, 190, 0.1)"
//             ),
//             border: "none", borderRadius:"10px",
//             ...style,
//         }}
//     />
//     </>
// }


// const injectStyle = (html: string|undefined)=>{
//     if (!html) return html;
//     return html.replace(
// "</head>",
// `
// <style>
//     html,
//     body {
//     scrollbar-width: none;
//     -ms-overflow-style: none;
//     }

//     html::-webkit-scrollbar,
//     body::-webkit-scrollbar {
//     display: none;
//     }
// </style>
// </head>
// `);}
