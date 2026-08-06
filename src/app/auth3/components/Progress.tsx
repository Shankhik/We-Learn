"use client";

import { useColorContext } from "@/context/colorScheme";
import moduleStyle from "./Progress.module.css";
import ModuleClassname from "@/lib/cssUtil";

import StageIcon from "./StageIcon";
import { colorScheme } from "@/lib/color/appColors";

type StageIconType = React.ComponentProps<typeof StageIcon>['type'];

type ProgressBarProps = {
    stages: { name: string, iconType: StageIconType }[],
    currentStage: number,
    stagesOnClick?: (()=> Promise<any>)[],
    styles?: {
        container?: React.CSSProperties,
        progressBar?: React.CSSProperties,
    }
}

export default function ProgressBar ({
    stages, currentStage, stagesOnClick, styles
}:ProgressBarProps){

    if (stages.length<=1) return null;

    const css = new ModuleClassname(moduleStyle);
    const { effectiveTheme } = useColorContext();
    
    const equalLength = Number((100/(stages.length-1)).toPrecision(5));
    
    const getIcons = (icon: StageIconType, isActive: boolean)=>{
        if (icon !== "DOC" && icon !== "USER" && icon !== "EMAIL" && icon!=="OK" )
            return null;

        return <StageIcon type={icon} fill={isActive
            ? "rgb(255, 255, 255)"
            : effectiveTheme==="light"?"rgb(0, 0, 0)":undefined
        } />
    }
    return <>
    <div className={css.names(`container ${effectiveTheme}`)}
    style={styles?.container}>
    <div className={css.names(`progress-bar ${effectiveTheme}`)}
    style={styles?.progressBar}>
        <div className={css.names(`bar ${effectiveTheme}`)} style={{
            width: `${Math.min(100,(currentStage-1)*equalLength)}%`
        }}/>
        {stages.map((stage, i)=>(
            <Node onClick={stagesOnClick?.at(i)} key={i} name={stage.name} left={i * equalLength}
            isCompleted={i<currentStage} isActive={i+1===currentStage}>
                {getIcons(stage.iconType, i+1===currentStage)}
            </Node>
        ))}
    </div>
    </div>
    {/* <div className={moduleStyle['progress-bar']}>
        {stages.map((stage, i)=>(
            <Node key={i} name={stage} left={i*equalLength}/>
        ))}
    </div> */}
    </>
}

type NodeProps = {
    children?: React.ReactNode,
    name?: string, left: number,
    isActive: boolean, isCompleted?: boolean,
    onClick?: ()=> Promise<any>|any
}
const Node = ({
    children, name, left, isActive, isCompleted, onClick
}:NodeProps)=>{
    const css = new ModuleClassname(moduleStyle);
    const { effectiveTheme } = useColorContext();
    //`${Math.min(i*equalLength, 100)}%`
    return <>
    <div className={css.names(`node ${effectiveTheme} ${isActive?"active":""} ${isCompleted?"completed":""}`)}
        style={{
            left: `${Math.min(left, 100)}%`
        }}
    >
        <div className={css.names(`details ${effectiveTheme} ${isActive?"active":""}`)}
            style={{
                backgroundColor: isActive?colorScheme.accent.green[effectiveTheme]:"",
            }}
            onClick={onClick}
        >
            <div className={moduleStyle['logo']}>{children}</div>
            <div className={moduleStyle['stage']}>{name}</div>
        </div>
    </div>
    </>
}