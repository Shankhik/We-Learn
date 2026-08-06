"use client";

import moduleStyle from "./ProfilePopup.module.css";
import ModuleClassname from "@/lib/cssUtil";
import { useColorContext } from "@/context/colorScheme";
import { Activity, useCallback, useMemo, useRef, useState } from "react";
import NextImage from "next/image";
import HideIf from "@/components/HideIf";
import { useAuthContext } from "@/context/authContext";
import { ThemeIcon, UserIcon, SettingsIcon, HomeFloatingIcons, LogoutIcon, InfoIcon } from "@/components/icons/Icons";
import Button from "@/components/buttons/NewButton";
import { delCookie } from "@/lib/cookies";
import { usePathname, useRouter } from "next/navigation";
import { useNotification } from "@/context/notification";
import { delayWithId } from "@/lib/time";
import { useAppActions } from "@/lib/hooks/appActions";
import { useScreenDimension } from "@/context/screenWidth";
import UserProfilePicture from "../misc/UserProfilePicture";

type ButtonProps = React.ComponentProps<typeof Button>;

export default function ProfilePopup({show, setShow, childrenOptions, zIndex, children}:{
    show: boolean,
    setShow: React.Dispatch<React.SetStateAction<boolean>>,
    children?: React.ReactNode,
    zIndex?: number,
    childrenOptions?: {
        style?: React.CSSProperties,
        className?: string,
    }
}){
    const pathname = usePathname();

    const css = new ModuleClassname(moduleStyle);
    const { verified, username, displayName, profilePicture, email, admin } = useAuthContext();
    const { effectiveTheme, theme } = useColorContext();
    const { cycleTheme, logout, goto } = useAppActions();
    const { pushNotification } = useNotification();
    const { width: windowWidth } = useScreenDimension({width: 900})

    const refPage = useRef<HTMLDivElement>(null);
    const refMain = useRef<HTMLDivElement>(null);

    const componentDisplayName = useMemo(()=>{
        if (!displayName) return "Guest"
        return displayName && displayName.length>14?
        displayName.slice(0,14)+"...": displayName;
    },[displayName]);

    const themeText = useMemo(()=> theme.charAt(0).toUpperCase()+theme.slice(1), [theme])
    
    const onClose = useCallback(async ()=>{
        if(!refPage.current?.classList || !refMain.current?.classList) return;
        //const main = refPage.current.firstChild! as HTMLDivElement
        
        //const t = refMain.current.classList
        refMain.current?.classList.add(moduleStyle['scale-out']);
        refPage.current?.classList.add(moduleStyle['remove']);
        
        await delayWithId(200);
        refMain.current?.classList.remove(moduleStyle['scale-out']);
        refPage.current?.classList.remove(moduleStyle['remove']);
        
        setShow(false);
    },[show]);

    type ButtonStyleProps = Pick<ButtonProps,'style'|'hoverStyle'>
    const styles = useMemo(()=>({
        adminPanel: {
            style: {
                background: "rgba(58, 180, 113, 0.2)"
            },
            hoverStyle: {
                background:"rgba(59, 161, 113, 0.5)"
            }
        } satisfies ButtonStyleProps,
        logout: {
            style: {
                background: "rgba(255, 0, 0, 0.2)"
            },
            hoverStyle: {
                background:"rgba(255, 0, 0, 0.5)"
            }
        } satisfies ButtonStyleProps,
        settings: {
            style: {
                background: "rgba(74, 77, 207, 0.2)"
            },
            hoverStyle: {
                background:"rgba(67, 59, 179, 0.5)"
            }
        } satisfies ButtonStyleProps,
        theme: {
            style: {
                background: "rgba(74, 169, 207, 0.2)"
            },
            hoverStyle: {
                background:"rgba(59, 135, 179, 0.5)"
            }
        } satisfies ButtonStyleProps
    }),[]);

    const localLogout = useCallback(async ()=>{
        await logout({goto: "/"},()=>{
            pushNotification(`${displayName} logged out!`,{
                color: "yellow", duration: 2000
            });
            setShow(false);
        })
    },[displayName]);

    const getButtonStyle = useCallback((
        minWidth?: `${number}%`|`${number}px`,
        maxWindowWidth?: number
    ):React.CSSProperties=>({
        flexGrow: 1, justifyContent: "center",
        minWidth: (windowWidth!)<(maxWindowWidth||420)?(minWidth??undefined):undefined
    }),[windowWidth]);

    return <>
    <Activity mode={show?"visible":"hidden"}>
        <div onClick={onClose}
            ref={refPage} style={{zIndex: zIndex||50}}
            className={css.names(`profile-options ${show?"visible":""} ${effectiveTheme}`)}
        >
            <div className={css.names(`main`)} ref={refMain} onClick={(e)=> e.stopPropagation()}>
                <HorizontalSection style={{
                    display: verified && admin? "flex":"none", justifyContent:"flex-end",
                    marginBottom: "20px",
                }}>
                    {/* Admin Panel */}
                    <ProfileButton {...styles.adminPanel} title="Admin Panel"
                    onClick={async()=>{onClose(); goto("/admin-panel")}}
                    hidden={!verified}>
                        <SettingsIcon width="22px" height="22px"/>
                        Admin Panel
                    </ProfileButton>
                </HorizontalSection>
                {/* Profile Details Box */}
                <div className={moduleStyle['block']}>
                    <HideIf hideIf={ !!profilePicture && !!profilePicture.publicId }>
                        <UserIcon className={css.names(`profile-image`)}/>
                    </HideIf>
                    <HideIf hideIf={ !profilePicture || !profilePicture.publicId }>
                        <UserProfilePicture alt={displayName||username||"Unknown"}
                            loading="eager"
                            username={username}
                            profilePicture={profilePicture}
                            width={700} height={700}
                            className={css.names(`profile-image`)}
                        />
                    </HideIf>
                    <div className={css.names(`user-details stop-overflow`)}>
                        <h1 className={css.names(`display-name stop-overflow`)}
                        style={{
                            //opacity: componentDisplayName==="Unverified User"? 0:""
                        }}>
                            {componentDisplayName}
                        </h1>
                        <HideIf hideIf={!email}>
                            <h5 className={css.names(`email stop-overflow`)}>{email}</h5>
                        </HideIf>
                    </div>
                </div>
                <div className={childrenOptions?.className||css.names(`children`)}
                    style={childrenOptions?.style}
                >{
                    children ?? <>
                    <HorizontalSection style={{justifyContent:"flex-end"}}>
                        {/* Settings Button */}
                        <ProfileButton {...styles.settings} title="Settings"
                        onClick={()=> goto("/settings")} hidden={!verified}>
                            <SettingsIcon width="22px" height="22px"/>
                            {(windowWidth!)<450? "": "Settings"}
                        </ProfileButton>

                        {/* Theme Button */}
                        <ProfileButton {...styles.theme}
                        title={`Theme: ${themeText}`} onClick={cycleTheme}>
                            <ThemeIcon mode={theme} width="22px" height="22px"/>
                            {!verified? themeText: ""}
                        </ProfileButton>
                        
                        {/* Logout button */}
                        <ProfileButton hidden={!verified} showLoading
                        {...styles.logout}
                        title="Logout" onClick={localLogout}>
                            <LogoutIcon width="22px" height="22px"/>
                            Logout
                        </ProfileButton>

                    </HorizontalSection>

                    <HorizontalSection style={{
                        flexWrap:"wrap",
                        marginTop: "15px"
                    }}>
                        {/* Dashboard Button */}
                        <ProfileButton href="/home/dashboard" hidden={!verified || pathname.startsWith("/home/")}
                        style={getButtonStyle()}>
                            <HomeFloatingIcons mode={"dashboard"} width="22px" height="22px"/>
                            Dashboard
                        </ProfileButton>

                        {/* About Button */}
                        <ProfileButton href="/about" hidden={!verified}
                        style={getButtonStyle()}>
                            <InfoIcon iconStyle={2} width="22px" height="22px"/>
                            About
                        </ProfileButton>

                        {/* Login Button */}
                        <ProfileButton href={verified?"/auth":"/auth/login"}
                        style={getButtonStyle()}>
                            {verified? "Re-Authenticate": "Login"}
                        </ProfileButton>

                        {/* Signup Button */}
                        <ProfileButton href="/auth/signup" hidden={verified}
                        style={getButtonStyle()}>
                            Signup
                        </ProfileButton>

                    </HorizontalSection>
                    </>
                }
                </div>
            </div>
        </div>
    </Activity>
    </>
}

type ProfileButtonType = React.ComponentProps<typeof Button>

const ProfileButton = ({
    children, style, hoverStyle, ...props
}:ProfileButtonType)=>{
    const styles: {[key in "style" | "hoverStyle"]?: React.CSSProperties} = {
        style: {
            minHeight: "42px", minWidth:"42px",
            display: "flex", alignItems:"center", gap: "6px",
            flexShrink: 0,
            fontSize:"0.95rem",
            color: "rgba(255, 255, 255, 0.7)",
            backgroundColor : "rgba(100, 100, 100, 0.15)",
            border: "2px solid rgba(255, 255, 255, 0.3)"
        },
        hoverStyle: {
            backgroundColor: "rgba(209, 209, 209, 0.15)",
        }
    }
    return <>
    <Button {...props}
    style={{
        ...styles.style,
        ...style
    }} hoverStyle={{
        ...styles.hoverStyle,
        ...hoverStyle
    }}
    >{children}</Button>
    </>
}

type HorizontalSectionProps = {
    children?: React.ReactNode,
    //flexWrap?: 1|0|boolean,
    style?: React.CSSProperties
}
const HorizontalSection = ({
    children, style
}:HorizontalSectionProps)=>{
    return <>
    <div style={{
        display: "flex", gap:"10px",
        flexGrow:1, position:"relative",
        ...style,
    }}>{children}
    </div>
    </>
}
export const OptionButton = ({children, bgColor, hidden, ...props}: Pick<
    React.ComponentProps<typeof Button>,
    'children'|'href'|'onClick'|'title'|'style'
>& {
    bgColor?: string,
    hidden?: boolean
})=>{
    return !hidden && <Button 
        {...props}
        style={{
            borderRadius:'15px',
            display:'flex', justifyContent:'center',
            alignItems:'center', gap:'6px',
            flexGrow:'1', maxWidth:"50%",
            // calculated (dont just put anything)
            minHeight:'42px',
            color:"rgba(255, 255, 255, 0.7)",
            ...props.style,
            background: bgColor
        }}
    >
        {children}
    </Button>
}