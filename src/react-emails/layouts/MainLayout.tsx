"use client";
import {
    Html, Body, Head, Container, Img, Font, Hr,
    
    // Props
    ContainerProps, ImgProps, LinkProps, HrProps
    
} from "react-email"

import Footer from "../components/Footer";
import { EmailProps, WithChildren } from "../components/Types";

type Props = {
    children?: React.ReactNode,
    purpose?: React.ComponentProps<typeof Footer>['purpose'],
    inPreview?: boolean
}

type MainLayoutProp = EmailProps<WithChildren<{
    purpose?: React.ComponentProps<typeof Footer>['purpose'],
    head?: React.ReactNode
}>>
export default function MainLayout ({
    children, purpose, inPreview, head
}:MainLayoutProp){

    const propsMainContainer:ContainerProps = {
        // className: "main-container",
        style: {
            
        }
    }
    const propsChildrenContainer:ContainerProps = {
        style:{
            // display:"flex",
            // fontFamily: "monospace",
            borderRadius: "15px",
            border: "1px solid rgb(231, 231, 255)",
            marginBottom:"10px",
            boxSizing: "border-box",
            backgroundColor: "rgb(242, 243, 255)",
            padding: "20px"
        }
    }
    const propsLogo: ImgProps = {
        src: "https://res.cloudinary.com/dwjtsqbqn/image/upload/v1782488924/welearn-logo-full.svg",
        style: {
            margin: "20px auto",
            width: "160px"
        }
    }
    return <>
    <Html style={{scale: inPreview? 1: undefined}}>
    <Head>
        <Fonts/>
        <style>{`
            html, body {
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
            html::-webkit-scrollbar,
            body::-webkit-scrollbar {
                display: none;
            }
            .Nunito {
                font-family: 'Nunito Sans', system-ui
            }
            .Nunito-Heading {
                font-family: 'Nunito Sans Heading', 'Nunito Sans', monospace
            }
            .Oxanium{
                font-family: 'Oxanium', monospace, system-ui
            }
            .footer{
                background: linear-gradient(-10deg, rgb(9, 9, 22), rgb(48, 51, 75))
            }
        `}</style>
        {head}
    </Head>
    <Body>
        <Container {...propsMainContainer}>
            <Img {...propsLogo}/>
            <Container {...propsChildrenContainer}>
                {children}
            </Container >
            
            <Footer purpose={purpose}/>
        </Container>
    </Body>
    </Html>
    </>
}

const Fonts = ()=>{
    return <>
    <Font //fontWeight={400}
        fontFamily={
            "Segoe UI"
            // "Verdana"
            // "Nunito Sans"
        }
        fallbackFontFamily={[
            "Segoe UI" as any, // Not in Mobile
            "Arial",
            "Verdana",
            "Georgia",
            "Helvetica",
            "serif"
        ]}
        // webFont={{
        //     url: "https://fonts.gstatic.com/s/nunitosans/v19/pe0AMImSLYBIv1o4X1M8ce2xCx3yop4tQpF_MeTm0lfUVwoNnq4CLz0_kJ3xzHGAVFIF2w.woff2",
        //     format: "woff2"
        // }}
    />
    {/* <Font fontWeight={400}
        fontFamily={"Oxanium"}
        fallbackFontFamily={"Nunito Sans" as any}
        webFont={{
            url: "https://fonts.gstatic.com/s/oxanium/v21/RrQQboN_4yJ0JmiMe2LE0Q.woff2",
            format: "woff2"
        }}
    />
    <Font fontWeight={900}
        fontFamily={"Nunito Sans Heading"}
        fallbackFontFamily={"Nunito Sans" as any}
        webFont={{
            url: "https://fonts.gstatic.com/s/nunitosans/v19/pe0AMImSLYBIv1o4X1M8ce2xCx3yop4tQpF_MeTm0lfUVwoNnq4CLz0_kJ3xzHGAVFIF2w.woff2",
            format: "woff2"
        }}
    />
    <Font fontWeight={400}
        fontFamily={"Nunito Sans"}
        fallbackFontFamily={"system-ui" as any}
        webFont={{
            url: "https://fonts.gstatic.com/s/nunitosans/v19/pe0AMImSLYBIv1o4X1M8ce2xCx3yop4tQpF_MeTm0lfUVwoNnq4CLz0_kJ3xzHGAVFIF2w.woff2",
            format: "woff2"
        }}
    /> */}
    </>
}