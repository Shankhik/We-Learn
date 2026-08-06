import ModuleClassname from "@/lib/cssUtil";
import { Dispatch, SetStateAction } from "react";
import moduleStyle from "./Profile.module.css"
import { useColorContext } from "@/context/colorScheme";
import FullPagePopUp from "./FullPagePopup";
import Image from "next/image";
import Button2 from "../buttons/Button";
import { ThemeIcon, UserIcon } from "../icons/Icons";
import HideIf from "../HideIf";
import { delCookie } from "@/lib/cookies";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/authContext";
import UserProfilePicture from "../misc/UserProfilePicture";

type Props = {
    Profile: {
        profileVersion?:number|null,
        username?:string|null,
        displayName?:string|null,
        toggle?: Dispatch<SetStateAction<boolean>>,
        disabled?: boolean
    }
}
export const Profile = ({
    profileVersion,username,displayName,toggle, disabled
}:Props['Profile'])=>{
    const css = new ModuleClassname(moduleStyle);
    const {effectiveTheme} = useColorContext();
    const onClick = ()=> {
        if (disabled) return;
        toggle && toggle(prev => !prev)
    }
    return <>
    <div
        title={displayName||username||"Unknown"} tabIndex={0}
        className={css.names(`profile ${effectiveTheme}`)}
        onClick={onClick}
    >
        <UserIcon hidden={username && profileVersion? true:false}/>
        <HideIf hideIf={!profileVersion}>
        <UserProfilePicture
            width={100} height={100}
            username={username as any}
            profilePicture={profileVersion}
            className={css.names(`profile-pic`)}
            alt={username||"Unknown"}
        />
        </HideIf>
    </div>
    </>
}
const ProfilePopup = ({
    show, toggleShow, email,
    username, displayName, hideTheme,
    profilePictureVersion,
}:{
    show: boolean,
    toggleShow: Dispatch<SetStateAction<boolean>>,
    username?: string|null,
    displayName?: string|null,
    profilePictureVersion?: number|null,
    email?: string|null,
    hideTheme?: boolean,
}) =>{
    const css = new ModuleClassname(moduleStyle);
    const {replace} = useRouter();
    const {verified, updateAuth} = useAuthContext();
    const {effectiveTheme, setTheme, theme} = useColorContext();
    const logout = async()=>{
        if(!verified) return;
        delCookie('AUTH_TOKEN');
        replace('/');
        updateAuth();
    }
    
    return !show? null :  <>
    <FullPagePopUp show={show} toggleShow={toggleShow} zIndex={2}>
        <div className={css.names(`pop-up-section-one ${effectiveTheme}`)}>
            <div className={moduleStyle['image-container']}>
            <UserIcon hidden={username && profilePictureVersion? true:false}/>
            <HideIf hideIf={!profilePictureVersion || !verified}>
                <UserProfilePicture alt={displayName||"Unknown"} className={moduleStyle['image']}
                username={username as any} profilePicture={profilePictureVersion}
                width={500} height={500}/>
            </HideIf>    
            </div>
            
            <div>
                <h1>{displayName}</h1>
                {displayName!==username?
                <h5 style={{marginLeft:"2px"}}>{username}</h5>
                :null}
                <h5 style={{marginLeft:"2px"}}>{email}</h5>
            </div>
        </div>
        <div className={moduleStyle['pop-up-section-two']}>
            <Button2 style={{
                backgroundColor: 'rgba(226, 87, 87, 1)',
                color:"rgba(255, 208, 208, 1)"
            }} className={css.names(`button ${effectiveTheme}`)}
                onClick={logout}
            >Logout</Button2>
            <Button2 style={{
                backgroundColor: effectiveTheme==='light'?
                'rgb(95, 95, 247)':'rgb(95, 95, 247)',
                color: effectiveTheme==='light'?
                'rgba(216, 225, 255, 1)':'rgba(209, 209, 255, 1)',
            }} className={css.names(`button ${effectiveTheme}`)}
                href={"/settings2"}
            >Settings</Button2>
            { hideTheme ? null:
            <Button2 style={{
                backgroundColor: effectiveTheme==='light'?
                'rgb(95, 95, 247)':'rgb(95, 95, 247)',
                color: effectiveTheme==='light'?
                'rgba(216, 225, 255, 1)':'rgba(209, 209, 255, 1)',
            }} className={css.names(`button ${effectiveTheme}`)}
                onClick={()=>{
                    if(theme==='light') setTheme('dark');
                    else if (theme==='dark') setTheme('default');
                    else setTheme('light');
                }}
            ><ThemeIcon mode={theme} fill={effectiveTheme==='light'?
                'rgba(216, 225, 255, 1)':'rgba(209, 209, 255, 1)'}
            /></Button2>}
        </div>
        
    </FullPagePopUp>
    </>
}
export default ProfilePopup;