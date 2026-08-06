'use client';

import moduleStyle from "./global.module.css";
import ModuleClassname from "@/lib/cssUtil";
import { useRouter } from "next/navigation";
import { SettingsFloatingIcons } from "../icons/Icons";

const SettingsFloatingButtons = ({effectiveTheme, active, disabled}:{
    effectiveTheme: "light"|"dark",
    active?: 'account'|'profile'| null,
    disabled?: boolean
})=>{
    const cssUtil = new ModuleClassname(moduleStyle);
    const {push} = useRouter();
    
    const colors = {
        profile:{
            light:'rgba(156, 69, 255, 1)', dark:'rgba(170, 59, 243, 1)'
        },
        account:{
            light:'rgba(52, 184, 133, 1)', dark:'rgba(46, 190, 118, 1)'
        },
        disabled: {
            light:'rgba(59, 59, 59, 1)', dark:'rgba(73, 73, 73, 1)'
        }
    }
    const onClick = (e:React.MouseEvent<HTMLDivElement>)=>{
        if(disabled) return;
        const target = (e.target as HTMLDivElement).closest('div');
        let link = null;
        if(!target) return;
        switch (target.id){
            case 'profile_button':
                link = 'profile'; break;
            case 'account_button':
                link = 'account'; break;
            default:
                link = null;
        }
        if (link) push(`/settings/${link}`)
    }
    const getStyle = (name: typeof active): React.CSSProperties=>{
        return {
            backgroundColor: active === name? (
                !disabled? colors[name||'profile'][effectiveTheme]:
                colors['disabled'][effectiveTheme]
            ):'',
            color: active === name? "rgba(255, 255, 255, 1)":''
        }
    }
    
    return <>
    <div 
        className={cssUtil.names(`floating-buttons ${effectiveTheme}`)}
        onClick={onClick}
    >
        <div style={getStyle('profile')} id="profile_button"
            className={cssUtil.names(`button ${effectiveTheme}`)}
        >
            <SettingsFloatingIcons mode={"profile"}
                fill={active==="profile"?"rgba(255, 255, 255, 0.8)":
                effectiveTheme==='light'?"rgba(46, 46, 46, 1)":"rgba(255, 255, 255, 0.9)"
            }/>
        </div>
        <div style={getStyle('account')} id="account_button"
            className={cssUtil.names(`button ${effectiveTheme}`)}
        >
            <SettingsFloatingIcons mode={'account'}
                fill={active==='account'? "rgba(255, 255, 255, 0.8)":
                effectiveTheme==='light'?"rgba(46, 46, 46, 1)":"rgba(255, 255, 255, 0.9)"
            }/>
        </div>
    </div>
    </>
}

export default SettingsFloatingButtons