'use client';

import { useColorContext } from "@/context/colorScheme";
import moduleStyle from "./FeatureUnavailable.module.css";
import ModuleClassname from "@/lib/cssUtil";
import WaitingAnimation from "../loading/WaitingAnimation";

export default function FeatureUnavailable (){
    const {effectiveTheme} = useColorContext();
    const css = new ModuleClassname(moduleStyle);
    return <>
    <title>Feature Unavailable</title>
    <div className={css.names(`page ${effectiveTheme}`)}>
        <WaitingAnimation
            circleColor={{
                light: 'rgba(30, 49, 223, 0.77)',
                dark: 'rgba(18, 187, 164, 1)',
            }}
            className={moduleStyle['waiting-animation']}
        />
        <h1 className={css.names(`unavailable-text ${effectiveTheme}`)}>
            This feature is currently unavailable.<br/><br/>
            Apologies 🙇🏼!
        </h1>
    </div>
    </>
}