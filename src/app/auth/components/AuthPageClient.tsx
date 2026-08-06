"use client";

import { useColorContext } from "@/context/colorScheme";
import moduleStyle from "./AuthPageClient.module.css";
import useClassname from "@/lib/hooks/useClassname";
import { useAuthContext } from "@/context/authContext";

import UserProfilePicture from "@/components/misc/UserProfilePicture";
import { LogoutIcon, SettingsIcon, UserIcon } from "@/components/icons/Icons"
import { Activity, useCallback, useMemo } from "react";

import { colorScheme } from "@/lib/color/appColors";
import Button from "@/components/buttons/NewButton";
import { useAppActions } from "@/lib/hooks/appActions";
import Link from "next/link";

type CSS = React.CSSProperties;

export default function AuthPageClient (){
    
    const css = useClassname(moduleStyle);
    const { effectiveTheme } = useColorContext();
    const { verified, username, email, displayName, profilePicture } = useAuthContext();

    const isVisible = !!(verified && username);
    // console.log(isVisible);
    

    const styles = useMemo(()=>({
        
        
    }),[effectiveTheme]);

    return <>
        <UserProfileBlock/>
        <AddAccountBlock/>
    </>
}

type UserProfileProps = {
    isVisible?: boolean
}
const UserProfileBlock = ({
    isVisible
}:UserProfileProps)=>{
    const css = useClassname(moduleStyle);
    const {effectiveTheme} = useColorContext()
    const { verified, displayName, username, email, profilePicture } = useAuthContext()

    const actions = useAppActions();

    const styles = useMemo(()=>({
        profilePicture: {
            border: `5px solid ${colorScheme.accent.blue[effectiveTheme]}`,
            backgroundColor: colorScheme.getAlpha(
                colorScheme.accent.blue[effectiveTheme] as any,
                0.2
            ),
        } satisfies CSS,
        username: {
            fontStyle: "italic"
        } satisfies CSS,
        email: {
            marginTop:"5px",
            padding:"1px 8px", borderRadius:"6px",
            backgroundColor: colorScheme.accent.green[effectiveTheme],
            color: "rgb(211, 255, 244)",
            width: "fit-content"
        } satisfies CSS,
        buttons :{
            settings: {
                padding: "3px", height: "25px",
                color:"rgba(255, 255, 255, 0.8)",
                backgroundColor: colorScheme.accent.blue[effectiveTheme]
            } satisfies CSS,
            logout: {
                display:"flex", alignItems:"center", gap:"7px",
                padding: "0 11px 0 7px",
                height:"25px",
                color:"rgba(255, 255, 255, 0.8)",
                backgroundColor: colorScheme.accent.red[effectiveTheme]
            } satisfies CSS
        },
    }),[effectiveTheme]);

    if (!verified) return null;

    return <>
    <div className={css.names(`clamp padding main-box`)}
    style={{ marginBottom:"20px", backgroundColor: colorScheme.card[effectiveTheme]}}>
    <div className={css.names(`profile-block`)}>
        <div className={css.names(`profile-picture`)} style={styles.profilePicture}>
            <UserIcon width="100" height="100"
                hidden={!!(username && profilePicture)} 
                className={css.names(`image-size`)}
            />
            <UserProfilePicture
                className={css.names(`image-size`)}
                username={username} displayName={displayName}
                profilePicture={profilePicture}
            />
        </div>

        <div style={{
            flexGrow:1, display:"flex", flexDirection:"column",
            overflow:"hidden",
            minWidth:0 // -> Important for text overflow
        }}>
            
            {/* User Details */}
            <div className={css.names(`details`)}>
                <h2>{displayName}</h2>
                <h5>Username: <span style={styles.username}>{username}</span></h5>
                <h5>Email: {email}</h5>
            </div>

            {/* Account Actions */}
            <div className={css.names(`logout`)} style={{
                justifyContent:"flex-end"
            }}>
                <Button overwriteClassname style={styles.buttons.settings}
                onClick={()=> actions.goto("/settings")}>
                    <SettingsIcon width="19px" height="19px"/>
                </Button>
                <Button overwriteClassname style={styles.buttons.logout}
                onClick={()=> actions.logout()}>
                    <LogoutIcon width="19px" height="100%"/>{" "}
                    Logout
                </Button>
            </div>
        </div>
    </div>
    </div>
    </>
}

const AddAccountBlock = ()=>{
    const css = useClassname(moduleStyle);
    const {verified} = useAuthContext();
    const {effectiveTheme} = useColorContext();

    const SignupHref = useCallback(()=> <Link href={"/auth/signup"}
    style={{ fontWeight: 700,
        color: colorScheme.accent.green[effectiveTheme],
    }}
    >Signup</Link>,[effectiveTheme]);
    
    /* - - - - - - - - - - - - - JSX Components - - - - - - - - - - - - - */
    
    const LocalUserIcon = useCallback(()=><UserIcon
        width="60" height="60" 
        style={{ alignSelf:"center",
            borderRadius:"50%",
            border: `4px solid ${colorScheme.others.greyBlue[effectiveTheme]}`
        }} fill={effectiveTheme==="dark"? undefined:
            colorScheme.getAlpha(colorScheme.others.greyBlue.light,0.7)
        }
    />,[effectiveTheme]);

    const LoginButton = useCallback(({children}:{children?: React.ReactNode})=><>
        <Button style={{
            alignSelf:"center", width:"clamp(100px, 90%, 300px)",
            color:"rgb(225, 223, 255)",
            backgroundColor: colorScheme.accent.blue[effectiveTheme]
        }} href="/auth/login">{children}</Button>
    </>,[effectiveTheme]);

    const Heading = useCallback(({children}:{children: React.ReactNode})=><>
        <h3 style={{textAlign:"center"}}>{children}</h3>
    </>,[]);

    return <>
    <div className={css.names(`clamp padding main-box`)}
    style={{
        backgroundColor: colorScheme.card[effectiveTheme],
        display:"flex", flexDirection:"column", gap:"10px",
        padding: "30px 10px 30px"
    }}>{ !verified? <>
        <LocalUserIcon/>
        <Heading>No Account Found!</Heading>
        <LoginButton>Add Account</LoginButton>
        <p style={{
            width:"clamp(100px, 80%, 500px)", alignSelf:"center", textAlign:"center"
        }}>Don't have an account? {SignupHref()} instead.</p>
        </>:<>
        <Heading>Want to Re-Authenticate?</Heading>
        <p style={{opacity: 0.8, alignSelf:"center", fontSize: "0.9rem",
            textAlign:"center", width:"clamp(100px, 80%, 500px)",
            fontStyle:"italic"
        }}>Note: Re-authentication will log you out of your current account.</p>
        <LoginButton>Re-authenticate</LoginButton>
        </>
    }</div>
    </>
}