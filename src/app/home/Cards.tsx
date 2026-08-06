"use client";

import ModuleClassname from "@/lib/cssUtil";
import moduleStyle from "./Cards.module.css";
import { Heading } from "@/components/htmlElements/Texts";
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useColorContext } from "@/context/colorScheme";
import { appColors } from "@/lib/color/appColors";
import { Course } from "@/types/databaseTypes";
import React from "react";
import { useScreenDimension } from "@/context/screenWidth";
import LoadingAnimation from "@/components/loading/LoadingAnimation";
import HideIf from "@/components/HideIf";
import Link from "next/link";
import { getThumbnail } from "@/images/course/thumbnails/getThumbnail";

const ExpandButton = (props:{
    expanded: boolean,
    onClick?: ()=>void,
})=>{
    const css = new ModuleClassname(moduleStyle);
    const {effectiveTheme} = useColorContext();
    return <button
        className={css.names(
            `exp-btn button-thm ${effectiveTheme} hover-eff ${props.expanded?"on":''}`
        )} style={{
            color: appColors.violet[effectiveTheme][1]
        }} onClick={props.onClick}
    >{props.expanded?"Collapse":"Expand"}</button>
}
const NavigateButton = ({children, onClick}:{
    children: React.ReactNode,
    onClick?:()=>void
})=>{
    const css = new ModuleClassname(moduleStyle);
    const {effectiveTheme} = useColorContext()
    return <>
    <button
        className={css.names(
            `button-thm ${effectiveTheme} hover-eff`
        )} style={{
            color: appColors.violet[effectiveTheme][0]
        }} onClick={onClick}
    >{children}</button>
    </>
}
const List = ({children, expanded, ref, cardsHeight, pageNo}:{
    children?: React.ReactNode,
    expanded: boolean,
    cardsHeight: number,
    pageNo: number
    // translate?: number,
    ref?: RefObject<HTMLDivElement|null>
})=>{
    const css = new ModuleClassname(moduleStyle);
    const translate = -cardsHeight * (pageNo-1);
    const isMounted = useRef(false);

    useEffect(()=>{
        const timeout = setTimeout(()=>{
            isMounted.current = true;
        },300)
        return ()=>{
            clearTimeout(timeout);
        }
    },[]);

    return <>
    <div 
        className={css.names(`list`)}// ${expanded?"expand":''}
        style={{
            height: cardsHeight*(expanded?2:1),
            // Stops first render height transition
            transition: !isMounted.current?"none":""
        }}
    >
        <div className={moduleStyle['list-whole']}
            style={{
                translate: `0px ${translate||0}px`
            }} ref={ref}
        >{children}</div>
    </div>
    </>
}
const getCourseCardsListDimensions = (width: number, isExpanded: boolean)=>{
    
    if (width<=500) return {
        columns: 2,
        rows: isExpanded? 2:1
    };
    if (width<=950) return {
        columns: 3,
        rows: isExpanded? 2:1
    };
    return{
        columns: 4,
        rows: isExpanded? 2:1
    }

}
export const CardsCollection = React.memo(({
    title, cardList, maxCount, loadMoreFn, loading
}:{
    title?: string,
    cardList?: Partial<Course>[],
    maxCount?: number,
    loading?: boolean,
    loadMoreFn?: ()=> Promise<void>
})=>{

    const css = new ModuleClassname(moduleStyle);

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [pageNo, setPageNo] = useState<number>(1);

    const screen = useScreenDimension({width: 900, height: 500});
    const gridDimension = getCourseCardsListDimensions(screen.width!, isExpanded);
    
    const [cardsDetails, setCardsDetails] = useState({
        height: 0,
        count: 0,
        limitExceeded: false
    });
    
    const refList = useRef<HTMLDivElement|null>(null);
    
    // Updates Cards Details on Resize [based on gridDimension]
    useEffect(()=>{
        if(!refList.current) return;
        const children = refList.current.children;
        
        setCardsDetails( prev => {
            const first = children.item(0);
            if (!first){
                return {
                    height:0,
                    count:0,
                    limitExceeded: false
                }
            }
            return {
                height: first.getBoundingClientRect().height,
                count: children.length,
                limitExceeded: (maxCount!==undefined && children.length>maxCount)
            }
        });
    },[
        // When new cards are added
        cardList?.length,
        // When grid columns change i.e viewport resize
        gridDimension?.columns
    ]);

    useEffect(()=>{
        //console.log("Cards Count:",cardsDetails.count)
    },[cardsDetails.count]);

    /* Number of Cards left */
    const getLeftCount = ()=>{
        const data = {
            // Past no. of Cards
            past: (pageNo-1) * (gridDimension.columns),
            // Cards on screen
            onScreen: (gridDimension.columns) * (gridDimension.rows)
                //+ (isExpanded?gridDimension.columns:0)
        }
        return Math.max(0,
            // Considers max-count if available
            Math.min(maxCount||1000,cardsDetails.count)
            - data.past
            - data.onScreen
            // For Show-All Card (if limit is exceeded)
            + (cardsDetails.limitExceeded?1:0)
        )
    }

    /* |||||||||||||||||||| ON-CLICK handlers |||||||||||||||||||| */
    // Expand/Collapse Button
    const toggleCollapse = ()=>{
        const left = {
            available: getLeftCount()!==0
        };
        setIsExpanded(prev => {
            if (prev===false){
                if(!left.available){
                    setPageNo(prev=>{{
                        if (pageNo<=1) return prev;
                        return prev-1
                    }});
                }
                return left.available || pageNo>1?true:false;
            }
            // If already expanded
            if (!left.available)
                // Gets to the last row [if reached already]
                setPageNo(prev=>prev+1);
            return false;
        })
    }

    // List UP/DOWN Buttons
    const navOnClick = (mode:'up'|'down')=>{
        const element = refList.current
        if(mode==='up') return ()=>{
            if(!element || pageNo===1) return;
            setPageNo(prev=>prev-1);
        }
        return ()=>{
            if(!element) return;
            if(getLeftCount()===0) return;
            setPageNo(prev=> prev+1)
        }
    }

    // Main Rendered Content/List
    const mainContent = useMemo(()=>{
        const moreAvailable = maxCount!==undefined &&
            cardList!==undefined && cardList.length> maxCount;
        const isLoading = !!loading;
        
        return <>
        <HideIf hideIf={(cardList!==undefined && cardList?.length>0) || isLoading}>
            <EmptyList/>
        </HideIf>
        <HideIf hideIf={cardList===undefined || cardList.length===0}>
        {cardList?.slice(0,moreAvailable?maxCount:undefined).map(
            (element, index)=>{
                return <Card key={index}
                    course={element as Course}
                />
            }
        )}
        </HideIf>
        <HideIf hideIf={!isLoading}>
            <Card type="loading"
                course={{} as Course} 
                styles={{container:{
                    flexGrow: !cardList||(cardList&& cardList.length===0)?
                    '1':''
                }}}
            />
        </HideIf>
        { moreAvailable && <ShowAll/> }
        </>
    },[cardList, maxCount, loading])

    return <>
    <div className={css.names(`container`)}>
        <div className={moduleStyle['top']}>
            {title && <Heading>{title}</Heading>}
            <ExpandButton
                expanded={isExpanded}
                onClick={toggleCollapse}
            />
        </div>
        <div className={moduleStyle['l-and-n']}>
            <List expanded={isExpanded} ref={refList}
            cardsHeight={cardsDetails.height} pageNo={pageNo}>
                {mainContent}
            </List>
            <div className={moduleStyle['navigate']}>
                <NavigateButton onClick={navOnClick('up')}>U</NavigateButton>
                <NavigateButton onClick={navOnClick('down')}>D</NavigateButton>
            </div>
        </div>
    </div>
    </>
})

export const Card = ({course, type, styles}:{
    course: Course,
    type?: 'loading'|'course'|'error',
    styles?: {
        container?: React.CSSProperties,
        card?: React.CSSProperties,
    }
})=>{
    const {effectiveTheme} = useColorContext()
    const css = new ModuleClassname(moduleStyle);

    const wordLimit = { data: 18 };

    const [cnDetails, setCnDetails] = useState({
        translatePx: 0,
        timeInMs: 0
    });
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const nameContainer = useRef<HTMLDivElement>(null);
    const courseLink = useRef<HTMLAnchorElement>(null);

    const thumbnail = useMemo(()=>{
        if (course.images?.thumbnail?.url){
            return {
                url: course.images.thumbnail.url,
                dominantColor: course.images.thumbnail.dominantColor
            }
        }
        const defaultThumbnail = getThumbnail({random:true})
        return {
            url: defaultThumbnail.image.src,
            dominantColor: defaultThumbnail.dominantColor
        }
    },[course.images?.thumbnail]);
    
    // const thumbnail = useMemo(()=>{
    //     if (course.images?.thumbnail?.url){
    //         return {
    //             url: course.images.thumbnail.url,
    //             dominantColor: course.images.thumbnail.dominantColor
    //         }
    //     }
    //     const defaultThumbnail = getThumbnail({random:true})
    //     return {
    //         url: defaultThumbnail.image.src,
    //         dominantColor: defaultThumbnail.dominantColor
    //     }
    // },[course.images?.thumbnail]);

    useEffect(()=>{
        const container = nameContainer.current;
        if(!container) return;

        const text = container.firstElementChild
        if(!text) return;

        setCnDetails(prev=>{
            const diff = Math.max(0, text.scrollWidth - container.clientWidth);
            return{
                translatePx: diff,
                timeInMs: (diff*20)
            }
        })
    },[course.courseName]);

    //const dThumbnail = getThumbnail({random:true}).src
    
    return type==='loading'? <>
    <div className={css.names(`card-container ${effectiveTheme}`)}
        style={styles?.container}
    >
        
        <div className={css.names(`card`)}
            onMouseEnter={()=> setIsHovered(true)}
            onMouseLeave={()=> setIsHovered(false)}
            
            style={{
                backgroundColor:'transparent',
                ...styles?.card
            }}
        >
            <LoadingAnimation height="20%" width="auto" 
            style={{margin:'auto auto'}} circleColors={{
                first: appColors.red[effectiveTheme][0],
                second: appColors.green[effectiveTheme][0],
                third: appColors.violet[effectiveTheme][0]
            }}/>
        </div>
    </div>
    </>:<>
    <div className={css.names(`card-container ${effectiveTheme}`)}
        style={styles?.container}
    >
        <Link href={`courses/${course.courseId}`} hidden ref={courseLink}/>
        <div className={css.names(`card`)}
            onMouseEnter={()=> setIsHovered(true)}
            onMouseLeave={()=> setIsHovered(false)}
            onClick={()=> courseLink.current?.click()}
            style={{
                backgroundImage: `url("${thumbnail.url}")`,
                ...styles?.card
            }}
        >
            <div className={css.names(`footer`)} style={{
                backgroundColor: !isHovered?"":(thumbnail.dominantColor)
            }}>
                
            </div>
            <div className={css.names(`name`)}
                ref={nameContainer}
            >
                <h3 title={course.courseName.length>wordLimit.data?course.courseName:undefined}
                    style={{
                        translate: cnDetails.translatePx && isHovered?
                            `-${cnDetails.translatePx}px`:"",
                        transition: `translate ${isHovered?cnDetails.timeInMs:0}ms linear`
                    }}
                >{course.courseName}</h3>
            </div>
        </div>
    </div>
    </>
}
const EmptyList = ()=>{
    const css = new ModuleClassname(moduleStyle);
    const {effectiveTheme} = useColorContext();
    return <>
    <div className={css.names(
        `card-container ${effectiveTheme} stop-grow`
    )} style={{flexGrow:1}}>
       <span style={{fontWeight: 700, fontSize: "1.2rem"}}>Empty</span>
    </div>
    </>
}
const ShowAll = ({onClick}:{
    onClick?:()=>Promise<void>|void
})=>{
    const css = new ModuleClassname(moduleStyle);
    const {effectiveTheme} = useColorContext();
    const colors = {
        light: "rgb(92, 101, 185)",
        text:{
            light:"rgba(217, 210, 255, 1)",
            dark:"rgba(221, 219, 255, 1)"
        },
        dark: "rgba(94, 102, 194, 1)"
    }
    return <>
    <div className={css.names(`card-container ${effectiveTheme} stop-grow`)}>
        <div className={css.names(`show-all`)}
            style={{
                backgroundColor:colors[effectiveTheme],
            }}
            onClick={async ()=>{
                if(onClick) onClick?.call
            }}
        >
            <svg width={"70%"}
                style={{margin:'auto', translate:'5% 0'}}
                viewBox="0 0 50 50">
                <path
                    fill="none"
                    stroke={colors.text[effectiveTheme]}
                    strokeWidth={7}
                    strokeLinecap = "round"
                    strokeLinejoin= "round"
                    d="M 17.808452,10.725966 32.191681,25 17.808452,39.274034"
                />
            </svg>
        </div>
    </div>
    </>
}