'use client';

import moduleStyle from "./global.module.css";
import ModuleClassname from "@/lib/cssUtil";
import { HomeFloatingIcons } from "../icons/Icons";
import { useRouter } from "next/navigation";

const HomeFloatingButtons = ({effectiveTheme, active, disabled}:{
    effectiveTheme: "light"|"dark",
    active?: 'dashboard'|'library'|'courses'| null,
    disabled?: boolean
})=>{
    const cssUtil = new ModuleClassname(moduleStyle);
    const {push, replace} = useRouter();
    
    const colors = {
        dashboard:{
            light:'rgba(182, 57, 57, 1)', dark:'rgba(240, 90, 90, 1)'
        },
        library:{
            light:'rgba(97, 54, 199, 1)', dark:'rgba(110, 94, 199, 1)'
        },
        courses:{
            light:'rgba(10, 185, 142, 1)', dark:'rgba(75, 177, 138, 1)'
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
            case 'dashboard_button':
                link = 'dashboard'; break;
            case 'library_button':
                link = 'library'; break;
            case 'courses_button':
                link = 'courses'; break;
            default:
                link = null;
        }
        if(link) push(`/home/${link}`)
    }
    const getStyle = (name: typeof active): React.CSSProperties=>{
        return {
            backgroundColor: active === name? (
                !disabled? colors[name||'dashboard'][effectiveTheme]:
                colors['disabled'][effectiveTheme]
            ):'',
            color: active === name? "rgba(255, 255, 255, 1)":''
        }
    }
    
    return <>
    <div 
        className={cssUtil.names(`floating-buttons ${effectiveTheme}`)}
        onClick={onClick} style={{
            // Hides when admin-panel is Open
            display: active===("admin-panel" as any)? "none":undefined
        }}
    >
        <div style={getStyle('dashboard')} id="dashboard_button"
            className={cssUtil.names(`button ${effectiveTheme}`)}
        >
            <HomeFloatingIcons mode="dashboard"
                fill={active==='dashboard'? "rgba(255, 255, 255, 0.8)":
                effectiveTheme==='light'?"rgba(46, 46, 46, 1)":"rgba(255, 255, 255, 0.9)"
            }/>
        </div>
        <div style={getStyle('library')} id="library_button"
            className={cssUtil.names(`button ${effectiveTheme}`)}
        >
            <HomeFloatingIcons mode="library"
                fill={active==='library'? "rgba(255, 255, 255, 0.8)":
                effectiveTheme==='light'?"rgba(46, 46, 46, 1)":"rgba(255, 255, 255, 0.9)"
            }/>
        </div>
        <div style={getStyle('courses')}id="courses_button"
            className={cssUtil.names(`button ${effectiveTheme}`)}
        >   
            <HomeFloatingIcons mode="courses"
                fill={active==='courses'? "rgba(255, 255, 255, 0.8)":
                effectiveTheme==='light'?"rgba(46, 46, 46, 1)":"rgba(255, 255, 255, 0.9)"
            }/>
        </div>
    </div>
    </>
}

export default HomeFloatingButtons