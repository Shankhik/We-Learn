import {
    Container, Hr,

    ContainerProps, LinkProps, HrProps,
    Section,
    Row,
    Column
} from "react-email"

import { useCallback } from "react";

import { Link, Text} from "./Elements"

export type FooterProps = {
    purpose?: string | React.ReactNode
}
const Footer = ({
    purpose
}: FooterProps)=>{
    const propsFooter: ContainerProps = {
        className: "footer",
        style: {
            color: "rgb(224, 230, 255)",
            // fontSize: "10px",
            padding: "20px",
            minHeight: "60px",
            borderRadius:"15px", border: "1px solid rgb(51, 50, 70)",
            // backgroundColor: "rgb(32, 30, 46)",
            // backgroundImage: "linear-gradient(-10deg, rgb(9, 9, 22), rgb(48, 51, 75))"
        }
    }

    const FooterLink = useCallback(({children, ...props}: LinkProps)=>(
        <Link {...props} style={{
            color: "rgb(224, 230, 255)", fontSize:"0.8rem"
        }}>{children}</Link>
    ),[]);

    const FooterHr = useCallback(({style,...props}: HrProps)=>(
        <Hr {...props} style={{
            margin: "15px 0",
            border: "none",
            borderTop: "1px solid rgb(84, 90, 117)"
        }}/>
    ),[]);

    const Purpose = useCallback(()=>{
        if (!purpose) return null;
        return <>
        <Text style={{
            padding: "5px 9px", fontSize: "0.8rem",
            textAlign:"center", marginTop: "0",
            backgroundColor: "rgb(57, 62, 94)",
            borderRadius: "8px",
        }}>
            {purpose}
        </Text>
        </>
    },[purpose]);
    return<>
    <Container {...propsFooter}>
    <Purpose/>
    <Text style={{
        marginTop: purpose?undefined:0,
        fontSize: "0.8rem", textAlign:"center"
    }}>
        * This email is system generated, do not reply.
    </Text>
    
    <FooterHr/>

    {/* Links Section */}
    <Section><Row>
        <Column align="center"><FooterLink href="https://google.com">About Us</FooterLink></Column>
        <Column align="center"><FooterLink href="https://google.com">Privacy Policy</FooterLink></Column>
        <Column align="center"><FooterLink href="https://google.com">Contact Us</FooterLink></Column>
    </Row></Section>

    </Container>
    </>

    
}

export default Footer;