import { } from "react-email";

import MainLayout from "../layouts/MainLayout";
import { Text, Heading, Hr } from "../components/Elements";
import { useMemo } from "react";
import EmailHeading from "../components/EmailHeading";

type Props = {
    inPreview?: boolean
    purpose: React.ReactNode
    otp: string,
    username?: string,
    otpExpireTime?: string,
    sessionExpireTime?: string
    requested?: boolean
}
export default function OtpVerification ({
    inPreview,
    purpose = <>Email Verification</>, otp, username,
    otpExpireTime, sessionExpireTime, requested
}:Props){
    const layoutPurpose = useMemo(()=><>
        You are recieving this email for :
        <span style={{whiteSpace: "nowrap"}}>
            {" "}{purpose}{requested? " (requested)":null}
        </span>
    </>,[requested, purpose]);

    return <>
    <MainLayout purpose={layoutPurpose}
    head={<StyleHead/>}
    inPreview={inPreview}>
        <EmailHeading textAlign="left" tag={purpose as any}>OTP</EmailHeading>
        <Text>
            Hey {username || "Shankhik"}! 
            Please use this OTP to continue with the process.
        </Text> 
        <Heading className="otp"
        style={{ width:"fit-content",
            lineHeight:"",
            fontFamily: "monospace", //whiteSpace:"preserve",
            margin:"0 auto", padding:"6px 14px",
            borderRadius:"10px", color: "rgb(216, 214, 255)",
            // background: "linear-gradient(rgb(78, 86, 202), rgb(121, 78, 202))",
            // backgroundColor:"rgb(78, 86, 202)"
        }}>{(otp || "000000").split("").join(" ")}</Heading>

        <Text style={{
            display: !sessionExpireTime && !otpExpireTime ? "none":""
        }}>{ otpExpireTime ? <>
            This OTP is set to expire after <strong>{otpExpireTime}</strong>; 
            use it before it expire.
        </>: sessionExpireTime ? <>
            This session will be ending in <strong>{sessionExpireTime}</strong>; 
            use the OTP before the session expire.
        </>:<></>}
        </Text>
        <Hr/>
        <Text style={{fontSize: "0.8rem", marginBottom:"0px"}}>
            ⚠️ If it wasn&apos;t you, your account might be compromised. Please secure your account now.
        </Text>
    </MainLayout>
    </>
}

const StyleHead = ()=>{
    return <>
    <style>{
`.otp{
    background: linear-gradient(rgb(78, 86, 202), rgb(121, 78, 202))
}`
    }</style>
    </>
}
const OTP = ({otp}: {
    otp: string
})=>{
    return <>
    
    </>
}
