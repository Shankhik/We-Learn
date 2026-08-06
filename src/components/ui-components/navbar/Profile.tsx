"use client";

import ModuleClassname from "@/lib/cssUtil";
import moduleStyle from "./Profile.module.css";
import { useColorContext } from "@/context/colorScheme";
import { useAuthContext } from "@/context/authContext";
import { UserIcon } from "@/components/icons/Icons";
import { useMemo } from "react";
import HideIf from "@/components/HideIf";
import { colorScheme } from "@/lib/color/appColors";
import UserProfilePicture from "@/components/misc/UserProfilePicture";

type Props = {
    onClick?: ()=> Promise<any>|any,
    style?: React.CSSProperties,
    disabled?: boolean
}
export default function Profile ({
    onClick, style, disabled
}:Props) {
    const css = new ModuleClassname(moduleStyle);
    const { effectiveTheme } = useColorContext();
    const { username, displayName, profilePicture } = useAuthContext();
    
    const localClick = async ()=>{
        if(disabled) return;
        if(onClick) await onClick();
    }

    const profileStyle: React.CSSProperties = useMemo(()=>({
        backgroundColor: colorScheme.getAlpha(
            username
                ? colorScheme.accent.blue[effectiveTheme]
                : colorScheme.others.greyBlue[effectiveTheme] as any,
            0.4
        ),
        border: `4px solid ${
            username
                ? colorScheme.accent.blue[effectiveTheme]
                : colorScheme.others.greyBlue[effectiveTheme]
        }`,
        ...style
    }),[effectiveTheme, style, username]);
    return <>
    <div
        title={displayName||username||"Unknown"} tabIndex={0}
        role="button" style={profileStyle}
        className={css.names(`profile ${effectiveTheme}`)}
        onClick={localClick}
        onKeyDown={async (e)=> {
            if(e.key === "Enter" || e.key === "Space"){
                await localClick();
            }
        }}
    >
        <UserIcon hidden={username && profilePicture? true:false}/>
        <HideIf hideIf={!profilePicture}>
            <UserProfilePicture width={100} height={100}
                className={css.names(`profile-pic`)}
                username={username} profilePicture={profilePicture}
                alt={username||"Unknown"}
            />
        </HideIf>
    </div>
    </>
}