"use client";

import { Heading } from "@/components/htmlElements/Texts";
import moduleStyle from "./page.module.css";

import { useColorContext } from "@/context/colorScheme";
import { colorScheme } from "@/lib/color/appColors";
import NextImage from "next/image";
import { Activity, ComponentProps, CSSProperties, useCallback, useMemo, useState } from "react";
import UserProfilePicture from "@/components/misc/UserProfilePicture";
import { useAuthContext } from "@/context/authContext";
import Button from "@/components/buttons/NewButton";

export default function MyChannel (){
    const [currentTab, setCurrentTab] = useState(0);
    const tabs = useMemo(()=>["About", "Courses"],[]);
    const tabsOnClick = useCallback((index: number)=>{
        setCurrentTab(prev=> prev===index? prev: index)
    },[]);
    return <>
    <TopSection/>
    <ContentTabs tabs={tabs} onClick={tabsOnClick} active={currentTab}/>
    <Activity mode={currentTab===0?"visible":"hidden"}>
        <PageAbout/>
    </Activity>
    <Activity mode={currentTab===1?"visible":"hidden"}>
        <PageCourses/>
    </Activity>
    </>
}

const TopSection = ({}:{})=>{
    const {effectiveTheme} = useColorContext();
    const {profilePicture, username} = useAuthContext();
    const backdropFilter:CSSProperties = useMemo(()=>({
        backgroundColor: colorScheme.getAlpha(colorScheme.page.main[effectiveTheme], 0.5),
        backdropFilter: "blur(20px)"
    }),[effectiveTheme]);

    const displayPicture = useMemo(()=><>
    <div className={moduleStyle['display-picture']} style={{
        ...backdropFilter, display:"flex"
    }}>
        <UserProfilePicture draggable={false}
        username={username} profilePicture={profilePicture}
        style={{width:'90%', height: "90%", margin:"auto", borderRadius: "50%"}}/>
    </div>
    </>,[backdropFilter, username, profilePicture]);
    return <>
    <div className={moduleStyle['banner-section']}>

        {/* Background Banner */}
        <NextImage alt={"Banner"} width={1000} height={100}
            draggable={false}
            src={"/media/public/WeLearn/course-images/cover/aura-t-1.png?media=image"}
            // src={"https://res.cloudinary.com/dwjtsqbqn/image/upload/WeLearn/course-images/cover/aura-t-1.png"}
            style={{
                width: "100%", height: "90%",
                objectFit: "cover", objectPosition:"center",
                maskImage: "linear-gradient(transparent, white 3%, transparent)",
                position: "absolute",
                borderRadius: "20px 20px 0 0",
                top: 0, right: 0, left: 0, bottom: 0
            }}
        />
        <div className={moduleStyle['clamp']}>
            {displayPicture}
            <div className={moduleStyle['details']} style={{
                ...backdropFilter
            }}>
                <Heading className={moduleStyle['name']}>
                    Shankhik
                </Heading>
                <h4 style={{opacity: 0.7}}>@someinhadh</h4>
            </div>
        </div>
    </div>
    </>
}

const ContentTabs = ({onClick, tabs, active}:{
    active?: number,
    onClick: (index: number)=>void
    tabs?: string[]
})=>{
    const tabsSections = useMemo(()=> tabs?.map((tab, index)=> (
        <Tab key={index} isActive={index===active}
        onClick={()=> onClick(index)}
        >{tab}</Tab>
    )),[tabs, active, onClick]);
    return <>
    <div style={{display:"flex", gap:"6px", margin: "20px 0"}}>
        {tabsSections}
        <Tab style={{marginLeft:"auto"}}>Share</Tab>
    </div>
    </>
}

type TabProps = Omit<ComponentProps<typeof Button> & {
    isActive?: boolean
},'hoverStyle'>
const Tab = ({children, isActive, onClick, style, ...props}: TabProps)=>{
    const {returnOnTheme, effectiveTheme} = useColorContext();
    const styleProps: Pick<ComponentProps<typeof Button>,'hoverStyle'|'style'> = useMemo(()=>({
        hoverStyle: {
            backgroundColor: returnOnTheme(
                "rgba(96, 110, 170, 0.15)",
                "rgba(171, 179, 255, 0.1)"
            )
        },
        style: {
            fontWeight: 500, fontSize: "0.9rem",
            ...style,

            borderBottom: `2px solid ${isActive?colorScheme.accent.blue[effectiveTheme]: "transparent"}`,
            color: isActive? colorScheme.accent.blue[effectiveTheme]: "inherit",
            backgroundColor: isActive
            ? returnOnTheme(
                "rgba(96, 110, 170, 0.1)",
                "rgba(171, 179, 255, 0.05)")
            : "transparent", borderRadius: "7px"
        }
    }),[isActive, effectiveTheme, style]);
    return <>
    <Button className={moduleStyle['tab']}
    onClick={onClick} {...props}
    {...styleProps}>{children}</Button>
    </>
}

const PageAbout = ({content}:{
    content?: any
})=>{
    const NotFound = useMemo(()=>{
        return <>
        <EmptyIllustration style={{margin: "0 auto"}}/>
        <h2 style={{
            alignSelf:"center", margin:"20px 0"
        }}>Nothing to see!</h2>
        </>
    },[content])
    return <>
    {content?<></>:NotFound}
    </>
}

const PageCourses = ({isActive}:{
    isActive?: boolean
})=>{
    return <>
    <div>
        <h1>Channel Courses</h1>
        <Button href="./channel/test-course-id">Test Course</Button>
    </div>
    </>
}
const EmptyIllustration = ({width, height, style}:{
    width?: number | string,
    height?: number | string,
    style?: CSSProperties
}) => {
    return <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width||"30%"}
      height={height||"auto"}
      viewBox="0 0 650.864 800"
      style={style}
    >
      <g transform="translate(-414.25 -77.75)">
        <ellipse
          cx={724.644}
          cy={817.348}
          fill="rgb(142, 152, 196)"
          rx={280.614}
          ry={49.574}
        />
        <g transform="translate(490.095 107.53)">
          <ellipse // big circle BG
            cx={274}
            cy={274.5}
            fill="#3f3d56"
            rx={274}
            ry={274.5}
            style={{
              fill: "#4c4f66",
              fillOpacity: 1,
            }}
            transform="translate(-.055)"
          />
          <circle
            cx={226.399}
            cy={226.399}
            r={226.399}
            opacity={0.05}
            transform="translate(47.715 47.848)"
          />
          <circle
            cx={185.554}
            cy={185.554}
            r={185.554}
            opacity={0.05}
            transform="translate(88.56 88.693)"
          />
          <circle
            cx={133.039}
            cy={133.039}
            r={133.039}
            opacity={0.05}
            transform="translate(141.075 141.208)"
          />
        </g>
        <path // Legs
          fill="#2f2e41"
          d="M412.8 515.588s-1.6 15.173-2.4 15.971c-.8.798.8 2.4 0 4.791-.8 2.391-1.6 5.59 0 6.389 1.6.799-19.081 103.468-20.763 210.821 0 0 24.756 1.6 24.756-7.187 0 0 30.175-94.48 30.175-95.279 0-.799 12.149-71.622 12.149-71.622l8.783 35.138 9.583 50.31s28.541 130.28 28.541 128.68c0-1.6 30.558-15.288 29.759-22.475-.799-7.187-16.77-107.806-16.77-107.806l3.993-149.332z"
          style={{
            fill: "#4d7ac7",
            fillOpacity: 1,
          }}
          transform="translate(225.751 31.603)"
        />
        <path
          fill="#2f2e41"
          d="M616.99 781.17s-21.562 42.325-7.192 43.922c14.37 1.597 19.964 1.6 26.353-4.791 3.493-3.493 10.565-8.18 16.26-11.71a21.027 21.027 0 0 0 9.977-19.994c-.421-3.907-1.881-7.126-5.475-7.426-9.583-.8-20.763-9.583-20.763-9.583zM735.973 812.315s-21.561 42.324-7.187 43.92c14.374 1.598 19.964 1.6 26.353-4.79 3.493-3.493 10.565-8.18 16.26-11.71a21.027 21.027 0 0 0 9.977-19.994c-.421-3.907-1.881-7.126-5.475-7.426-9.583-.8-20.763-9.583-20.763-9.583z"
        />
        <path
          fill="#ed9da0"
          d="M665.711 358.96c1.349 0 13.623-21.85 20.778-34.8a33.567 33.567 0 1 1 33.531 12.52c-4.326 13.579-11.147 36.662-11.147 36.662s-45.079-14.381-43.162-14.381z"
        />
        <path
          fill="#e6e6e6"
          d="m732.783 551.185-.666-1.458c-30.885 1.057-95.144 1.057-96.357 1.057-1.6 0 3.994-14.372-.8-15.172-4.794-.8-7.189-85.446-7.189-85.446s.8-33.737 0-52.1 43.122-59.7 47.914-60.498c4.075-.68 39.289 18.255 49.775 23.956a30.846 30.846 0 0 1 3.332 1.2c7.186 3.2 12.778 102.217 12.778 102.217l15.97 92.636-21.562 5.588z"
        />
        <path
          fill="#ed9da0"
          d="M754.438 557.572s15.876 41.525 3.1 39.928c-12.776-1.597-19.408-35.4-19.408-35.4z"
        />
        <path // hair
          fill="#2f2e41"
          d="m746.607 293.928.111-2.565 5.1 1.27a5.7 5.7 0 0 0-2.286-4.2l5.436-.3a58.649 58.649 0 0 0-39.226-24.242c-11.757-1.7-24.849.762-32.911 9.488-3.911 4.232-6.368 9.615-8.116 15.106-3.219 10.113-3.875 22.169 2.838 30.389 6.823 8.355 18.74 9.99 29.477 11.025 3.778.364 7.737.7 11.238-.763a27.034 27.034 0 0 0-1.5-11.858 7.9 7.9 0 0 1-.8-3.777c.477-3.194 4.738-4 7.939-3.567 3.201.433 7.049 1.092 9.152-1.36 1.449-1.687 1.363-4.146 1.555-6.362.52-6.038 11.939-7.02 11.993-8.284z"
        />
        <circle // right pebble
          cx={952.501}
          cy={785.056}
          r={39.113}
          fill="#6c63ff"
          style={{
            fill: "#567bff",
            fillOpacity: 1,
          }}
        />
        <path // left pebbles
          fill="#6c63ff"
          d="M454.037 782.613a27.891 27.891 0 0 1 12.935-23.558 20.127 20.127 0 0 1 7.8-32.246 14.281 14.281 0 1 1 14.345 0 20.127 20.127 0 0 1 7.8 32.246 27.914 27.914 0 1 1-42.88 23.558z"
          style={{
            fill: "#567bff",
            fillOpacity: 1,
          }}
        />
      </g>
    </svg>
    </>
}