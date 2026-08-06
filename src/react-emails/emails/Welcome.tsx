import MainLayout from "../layouts/MainLayout";
import { Heading, Hr, Link, Text} from "../components/Elements";
import { WithChildren } from "../components/Types";
import { Column, Container, Row, Section } from "react-email";
import EmailHeading from "../components/EmailHeading";

const LayoutHead = ()=>(<>
<style>{`
.welcome{
    background: linear-gradient(10deg, rgb(32, 43, 194), rgb(236, 104, 137));
    background-clip: text;
}`}</style>
</>)

const WelcomeNote = ()=>{
    return <>
    <EmailHeading
    containersProps={{heading: {align:"center"}}}
    style={{ width:"fit-content" }}>
        🎊<span className="welcome" style={{color: "transparent"}}>
            WELCOME
        </span>🎊
    </EmailHeading>
    </>
}
export default function Welcome ({username, inPreview}:{
    username: string,
    inPreview?: boolean
}){
    return <>
    <MainLayout inPreview={inPreview}
    head={<LayoutHead/>}
    purpose={<>
        You recieved this email because you signed-up in{" "}
        <Link style={{fontSize:"inherit"}} href="http://localhost:3000">
        <u>We Learn</u>
        </Link>
    </>}
    >
        <WelcomeNote/>

        <Text>
            Hey {username}! We're excited to have you join our learning community.
        </Text>
        <Text>
            Your account has been created successfully, and you're all set to begin your learning journey.
        </Text>

        <Hr/>
        <Heading style={{
            lineHeight: "",
            marginTop:"30px",
            fontWeight: 500,
            fontSize: "1.2rem",
        }}>From the Creator</Heading>

        <CreatorText>
            I realy appreciate you joining We Learn.
        </CreatorText>
        <CreatorText>
            This is a small personal project primarily built for me to gain experience in handling a real application with real users.
            
        </CreatorText>
        <CreatorText>
            Feel free to checkout the features available in this platform; 
            it certainly lacks some features you would expect from a fully fledged LMS platform.
        </CreatorText>
        <CreatorText>
            I hope you don&apos;t experience any inconvenience; 
            and if you unfortunately face any issues feel free to report them.
        </CreatorText>
        <CreatorText>
            THANK YOU for even trying it out!
        </CreatorText>

        <CreatorText>
            - Shankhik
        </CreatorText>
    </MainLayout>
    </>
}

const CreatorText = ({children}:WithChildren)=>{
    return <>
    <Text style={{
        fontStyle: "oblique", color: "rgb(63, 82, 134)",
        // color:"rgb(255, 255, 255)", //fontStyle:"oblique",
        // fontFamily: "Inter",
        fontSize: "0.85rem"
    }}>
        {children}
    </Text>
    </>
}
// 🎉 Welcome to Our Learning Platform!

// We're excited to have you join our learning community.

// Your account has been created successfully, and you're all set to begin your learning journey. Explore courses, track your progress, complete quizzes, and earn certificates as you build new skills.

// Whether you're here to learn something new or advance your career, we're here to support you every step of the way.

// Get started by:

// 📚 Browsing available courses
// 🎯 Enrolling in your first course
// 📈 Tracking your learning progress
// 🏆 Earning certificates upon completion

// Happy learning, and welcome aboard!

// The LMS Team