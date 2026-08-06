import { Body, Container, Html, Img,} from "react-email";
// import { Body, Container, Html, Img,} from "@react-email/components";
import { EmailText } from "./_Components";
// @react-email/components : ^0.5.5
type Props = {
    title?: string,
    purpose?: string,
    username?: string,
    otp: string|number,
}

export default function OTPEmail ({
    title, purpose, username, otp
}:Props) {

    const topStyle:React.CSSProperties={
        background:'linear-gradient(rgba(79, 96, 190, 1),rgba(0, 0, 0, 0))',
        padding:'20px 0',
    }
    const containerStyle:React.CSSProperties={
        borderRadius:"20px",
        padding:"0px", fontFamily:'Calibri',
        backgroundColor:'rgba(230, 233, 255, 1)',
        overflow:'hidden'
    }
    
    const issuedFor = <>
        Requested for:
        <span style={{fontWeight:"500"}}> {purpose}</span>,<br/>
    </>

    return <>
    {/* <Html>
    <Body> */}
    <Container style={containerStyle}>
        <div style={topStyle}>
            <Img src="https://res.cloudinary.com/dwjtsqbqn/image/upload/v1739002192/WeLearn/full-logo.png"
            style={{
                width:"40%", margin:'0 auto'
            }}
        />
        </div>
        <div style={{padding:"10px 10% 30px 10%"}}>
            <EmailText fontSize={"1.5rem"} fontWeight={700}
                textAlign='center'
                fontColor="rgba(35, 84, 156, 1)"
            >
                { title ||"Verify Email!"}
            </EmailText>

            <EmailText>
                Hey {username||"there"}! Please verify your identity using this OTP:
            </EmailText>

            <EmailText style={{
                textAlign:'center',
                margin:"0 auto", width:'fit-content',
                padding: "14px", backgroundColor:"rgba(36, 167, 117, 1)",
                borderRadius:"20px", letterSpacing:"7px",
            }} fontSize={'2rem'} fontColor={'rgba(255, 255, 255, 0.8)'}>
                {otp}
            </EmailText>

            <EmailText style={{
                marginTop:"30px"
            }} fontSize={'1rem'}>
                More details: <br/>
                {purpose && issuedFor}
                Requested at:
                <span style={{fontWeight:"600"}}> {(new Date()).toString()}</span>
            </EmailText>

            <EmailText>
                If this was not you, your account might be danger.<br/>
                Please change you password right now!
            </EmailText>
        </div>
        
    </Container>
    {/* </Body>
    </Html> */}
    </>
}
