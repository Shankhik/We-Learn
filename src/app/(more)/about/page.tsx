import { Anchor, Heading, Paragraph } from "../PageElements";
import CreatorProfile from "./components/CreatorProfile";
import BehindTheBuild from "./components/BehindTheBuild";

type WithChildren<T extends unknown = {}> = T &{
    children?: React.ReactNode
}
type Props = {
    Paragraph: WithChildren<{
        isLast?: boolean
    }>,
    Heading: WithChildren
}
export default function AboutPage () {
    //const css = new ModuleClassname(moduleStyle);

    return <>
    <Heading>About <strong>"We Learn"</strong></Heading>
    <Paragraph>
        This project started as an idea to make learning more flexible and creator friendly. 
        I wanted a platform where anyone could both learn and share knowledge without unnecessary barriers. 
        This is an independently built project, designed and developed by a single developer, 
        with a focus on simplicity, performance, and continuous improvement.
    </Paragraph>

    <Paragraph>
        The platform is designed to give creators full control over their content using familiar 
        tools like Markdown and HTML, making course creation both flexible and accessible. 
    </Paragraph>

    <Paragraph>
        Built using modern technologies to ensure fast performance, smooth navigation, and a scalable learning experience. 
        This platform is constantly evolving, with new features and improvements being added over time based on learning, 
        experimentation, and feedback.
    </Paragraph>

    <BehindTheBuild/>

    <Heading style={{marginTop:"60px"}}>More Links</Heading>
    <ul style={{
        listStyleType:"circle", display:"flex", gap:"40px", listStylePosition:"inside",
        flexWrap:"wrap"
    }}>
        <li><Anchor inApp href="/change-log">Changelog</Anchor></li>
        <li><Anchor inApp href="/bug-report">Bug Report</Anchor></li>
        <li><Anchor inApp href="/feature-request">Feature Request</Anchor></li>
        {/* <li><Anchor href="/bug-report">Bug Report</Anchor></li> */}
    </ul>
    <CreatorProfile/>
    </>
}

// const BehindTheBuild = ()=>{
//     return <>
//     <div style={{display:"flex", flexWrap:"wrap"}}>
//        <Heading style={{marginBottom:"",background:"red"}}>Behind the Build</Heading>
//        <div style={{marginLeft:"auto",width: "250px", background:"green"}}>
       
//        </div>
//     </div>
    
//     <Paragraph>
//     {`"We Learn"`} is a SPA (Single Page Application) using <Anchor style={{fontWeight: 600}} href="https://nextjs.org/">Nextjs</Anchor> framework that uses <strong>React</strong> library. 
//     It is buil
//     </Paragraph>
//     <Paragraph>
//         Services used:
//     </Paragraph>
//     <ul style={{listStyleType:"square"}}>
//         <li>Database: <Anchor style={{fontWeight: 600}} href="https://nextjs.org/">MongoDB Atlas</Anchor></li>
//         <li>SSR (Server Side Rendering) is heavily used to deliver initial page fast.</li>
//         <li>Handles sensitive pages and API routes securely, so that users don&apos;t have to worry about their data.</li>
//         <li>All the data is stored in <Anchor href="https://www.mongodb.com/products/platform/atlas-database">MongoDB Atlas</Anchor> database and additionally</li>
//     </ul>
//     <Paragraph>
//         Some basic informations about the working:
//     </Paragraph>
//     <ul style={{listStyleType:"square"}}>
//         <li><Anchor style={{fontWeight: 600}} href="https://nextjs.org/">Nextjs</Anchor> framework is used for handling both Front-End and Back-End.</li>
//         <li>SSR (Server Side Rendering) is heavily used to deliver initial page fast.</li>
//         <li>Handles sensitive pages and API routes securely, so that users don&apos;t have to worry about their data.</li>
//         <li>All the data is stored in <Anchor href="https://www.mongodb.com/products/platform/atlas-database">MongoDB Atlas</Anchor> database and additionally</li>
//     </ul>

//     <Paragraph>
//         Data Storage:
//     </Paragraph>
//     <ul style={{listStyleType:"square"}}>
//         <li><strong>User Data:</strong> All the user credentials, track record are strored in <Anchor href="https://www.mongodb.com/products/platform/atlas-database">MongoDB Atlas</Anchor> database and additionally</li>
//     </ul>
//     </>
// }
