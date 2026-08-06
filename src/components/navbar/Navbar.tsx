//"use client";

import ModuleClassname from "@/lib/cssUtil";
import moduleStyle from "./Navbar.module.css";
import { useColorContext } from "@/context/colorScheme";
import { useAuthContext } from "@/context/authContext";
import HideIf from "../HideIf";
import { Profile } from "../popup/Profile";
import { Dispatch, SetStateAction } from "react";
import NavbarLogo from "../misc/NavbarLogo";

type Props = React.ComponentProps<"nav"> & {
    children?: React.ReactNode,
    pageTitle: string, hideProfile?: boolean,
    toggleProfile?: Dispatch<SetStateAction<boolean>>,
    bypassAuth?: boolean
}
export default function Navbar ({
    children, pageTitle, hideProfile,
    toggleProfile, bypassAuth
}: Props){
    const css = new ModuleClassname(moduleStyle);
    const {effectiveTheme} = useColorContext();
    const { verified, username,displayName, profilePicture } = useAuthContext();
    return <>
    <nav
        className={css.names(`navbar ${effectiveTheme}`)}
    >
    <div className={moduleStyle['main']}>
        <NavbarLogo/>
        <HideIf hideIf={!pageTitle}>
        <h2 className={css.names(`page-title ${effectiveTheme}`)}>
            {verified || bypassAuth ?pageTitle:"Not Verified"}
        </h2>
        </HideIf>
        <div className={moduleStyle['children']}>
        </div>
        {children}
        <HideIf hideIf={hideProfile||false}>
        <Profile username={username} displayName={displayName}
            profileVersion={profilePicture} toggle={toggleProfile}
        />    
        </HideIf>
    </div>
    </nav>
    </>
}
// const Logo = ({effectiveTheme}:{effectiveTheme:"light"|"dark"})=>{
//     const css = new ModuleClassname(moduleStyle);
//     return <Image
//         className={css.names(`logo ${effectiveTheme}`)}
//         src={WeLearnLogo} alt="We-Learn"
//     />
// }