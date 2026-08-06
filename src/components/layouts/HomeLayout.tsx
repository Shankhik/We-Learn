"use client";

import moduleStyle from "./HomeLayout.module.css";
import { memo as ReactMemo, useCallback, useMemo, useRef, useState, ViewTransition, ViewTransitionProps } from "react";
import { useColorContext } from "@/context/colorScheme";
import Navbar2 from "../navbar/Navbar2";
import { useAuthContext } from "@/context/authContext";
import ProfilePopup from "@/components/popup/ProfilePopup";
import Button from "../buttons/NewButton";
import useClassname from "@/lib/hooks/useClassname";
import NextImage from "next/image";

type HomeLayoutProps = {
    children?: React.ReactNode,
    activePath?: string|null,
    floatingButtons?: React.JSX.Element,
    bypassAuth?: boolean,
    hideProfile?: boolean,
    hideFooter?: boolean,
    removeContainer?: boolean,
    contentTransition?: ViewTransitionProps
    customClassnames?: {
        main?: string,
        container?: string,
    },

    elementStyles?: {
        main?: React.CSSProperties,
        page?: React.CSSProperties,
        container?: React.CSSProperties,
        footer?: React.CSSProperties,
        footerMain?: React.CSSProperties
    },
    elementProps?: {
        navbar?: React.ComponentProps<typeof Navbar2>,
        profilePopup?: React.ComponentProps<typeof ProfilePopup>
    }
}

export default ReactMemo(({ contentTransition, children, ...props }:HomeLayoutProps)=>{
    return contentTransition? <>
    <ViewTransition default={"none"}>
        <Layout contentTransition={contentTransition}
        {...props}>{children}</Layout>
    </ViewTransition>
    </>:<Layout {...props}>{children}</Layout>
});

function Layout ({
    children, activePath, floatingButtons, contentTransition,
    bypassAuth, hideFooter, hideProfile, removeContainer,
    elementProps, elementStyles, customClassnames
}:HomeLayoutProps) {
    const css = useClassname(moduleStyle);
    const { effectiveTheme, returnOnTheme } = useColorContext();
    const [ showProfilePopup, setShowProfilePopup ] = useState<boolean>(false);
    
    const { verified } = useAuthContext();
    const contentRef = useRef<HTMLElement | null>(null);
   
    const navbar_onProfileClick = useCallback(()=>setShowProfilePopup(prev=> prev === true? prev: true),[]);
    
    const navbar_profileStyle: React.CSSProperties = useMemo(()=>({
        display: hideProfile? "none": ""
    }),[hideProfile]);

    const footerStyles = useMemo(()=>({
        footer: {
            marginTop: floatingButtons===undefined? "auto":undefined,
            background: `linear-gradient(-30deg, ${
                returnOnTheme("rgb(238, 234, 255)", "rgba(12, 15, 31, 0.18)")
            }, ${
                returnOnTheme("rgb(237, 239, 252)", "rgb(22, 22, 36)")
            })`,
            ...elementStyles?.footer
        } satisfies React.CSSProperties,
        main: {
            background: "rgba(0, 0, 0, 0.05)",
            ...elementStyles?.footerMain
        } satisfies React.CSSProperties
    }),[effectiveTheme, floatingButtons, elementStyles?.footer, elementStyles?.footerMain]);
    
    return <>
    <ProfilePopup show={showProfilePopup} setShow={setShowProfilePopup}
        // Overwritten Props
        {...elementProps?.profilePopup}
    />
    <div className={css.names(`home-page ${hideFooter?"no-footer":undefined} ${effectiveTheme}`)}
    style={elementStyles?.page}>

        <Memoed_Navbar title={activePath??""}
            showTitleAlways={bypassAuth}
            profileStyle={navbar_profileStyle}
            onProfileClick={navbar_onProfileClick}
            // Overwritten Props
            {...elementProps?.navbar}
        />
        
        { removeContainer?<>
        <MainContent bypassAuth={bypassAuth}
        contentRef={contentRef} contentTransition={contentTransition}
        className={customClassnames?.main} style={elementStyles?.main}>
            {children}
        </MainContent>
        </>:<>
        <div style={elementStyles?.container}
        className={customClassnames?.container||moduleStyle['main-container']}>
            <MainContent contentRef={contentRef} contentTransition={contentTransition}
            className={customClassnames?.main} style={elementStyles?.main}>
                {children}
            </MainContent>
        </div>
        </>}

        {floatingButtons || null}
        {!hideFooter && <>
        <footer className={css.names(`footer ${effectiveTheme}`)} style={footerStyles.footer}>
            <main style={footerStyles.main}>
                <NextImage src={"/WeLearnLogo.svg"} alt="We Learn"
                width={200} height={100} draggable={false}
                />
            </main>
        </footer>
        </>}
    </div>
    </>
}
const MainContent = ReactMemo(({children, bypassAuth, className, style, contentRef, contentTransition}: {
    children?: React.ReactNode,
    contentRef: React.RefObject<HTMLElement|null>,
    className?: string,
    style?: React.CSSProperties,
    bypassAuth?: boolean,
    contentTransition?: ViewTransitionProps,
})=>{
    const {verified} = useAuthContext();
    return contentTransition? <>
    <ViewTransition {...contentTransition}>
        <main ref={contentRef}
        className={className||moduleStyle['main']}
        style={style}>
            { verified || bypassAuth? children: <NotAvailable/>}
        </main>
    </ViewTransition>
    </>:<>
        <main ref={contentRef}
        className={className||moduleStyle['main']}
        style={style}>
            { verified || bypassAuth? children: <NotAvailable/>}
        </main>
    </>
});
const Memoed_Navbar = ReactMemo(Navbar2);

/* Not Available Page */
const NotAvailable = ()=>{
    return <>
    <div style={{alignSelf:'center'}} className={moduleStyle['not-available']}>
        <h1>{`Authentication Required`}</h1>
        <h1 style={{textAlign:'center',fontSize:'2.3rem'}}>❌</h1>
        
        <Button style={{
            width:'100%',
            marginTop:'10%'
        }} href="/auth/login">Login</Button>
        <Button style={{
            width:'100%',
            marginTop:'2%'
        }} href="/auth/signup">Signup</Button>
    </div>
    </>
}