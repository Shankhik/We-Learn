"use client";

import { Heading } from "@/components/htmlElements/Texts";
import moduleStyle from "./MyChannel.module.css";

import { useColorContext } from "@/context/colorScheme";
import { colorScheme } from "@/lib/color/appColors";
import useClassname from "@/lib/hooks/useClassname";
import Button from "@/components/buttons/NewButton";
import { useRouter } from "next/navigation";

export default function MyChannel () {
    const {effectiveTheme} = useColorContext();
    const css = useClassname(moduleStyle);

    const {push} = useRouter();

    const onClickDetails = ()=>{
        push("library/channel");
    }
    return <>
    <div className={css.names('main')} style={{
        backgroundColor: colorScheme.card[effectiveTheme]
    }}>
        <div style={{display: "flex", gap:"20px"}}>
            <Heading>My Channel</Heading>
            {/* <Button style={{padding:"0", height:"auto"}}>View</Button> */}
        </div>
        
        <div className={css.names(`container`)}>
            <div className={css.names(`picture`)} onClick={onClickDetails}/>
            <div className={css.names(`details`)} onClick={onClickDetails}>
                <h2 onClick={onClickDetails}
                style={{lineHeight:1}}>
                    Channel Name
                </h2>
                <p onClick={onClickDetails}>@channelId</p>
                <p onClick={onClickDetails}>Total enrolled: 796</p>
            </div>
            <div className={css.names(`recents`)} style={{
                // backgroundColor: "rgba(50, 57, 114, 0.2)"
            }}>
                <h3 style={{
                    textWrap: "wrap",
                    alignSelf:"center"
                }}>No enrollments yet!</h3>
                <h1 style={{ alignSelf:"center" }}>🥲</h1>
            </div>
        </div>
    </div>
    </>
}