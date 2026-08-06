"use client";

import moduleStyle from "./_components.module.css";
import ModuleClassname from "@/lib/cssUtil";

import { Heading, Paragraph, Anchor } from "../../PageElements";
import { useMemo, useState } from "react";
import { useColorContext } from "@/context/colorScheme";

export default function BehindTheBuild (){
    const css = useMemo(()=>new ModuleClassname(moduleStyle),[moduleStyle]);
    const { effectiveTheme } = useColorContext();
    const [isDevMode, setIsDevMode] = useState<boolean>(false)
    return <>
    {/* Top Heading with Dev toggle */}
    <div style={{
        display:"flex", flexWrap:"wrap", gap:"10px",
        margin:"20px 0 20px 0", alignItems:"center"
    }}>
       <Heading style={{marginBottom:""}}>Behind the Build</Heading>
       <DevToggle isDevMode={isDevMode} setIsDevMode={setIsDevMode}/>
    </div>
    
    {/* * * * * * * * * * * * * * Main Content * * * * * * * * * * * * * */}
    
    {/* Sub-Heading: Performance */}
    <h3 style={{fontWeight:"700", textDecoration:"underline"}}>Performance:</h3>
    <ul style={{listStyleType:"square", marginBottom:"15px"}}>{
        isDevMode?<>
        <li>We Learn is a Single Page Application created with <HyperLink href="https://nextjs.org/" title="NextJS"/> (uses React Library) framework that handles both front-end and back-end.</li>
        <li>Uses <strong>SSR</strong> (Server Side Rendering) ensuring fast initial page load followed by fetched page data.</li>
        <li><strong>Lazy loading</strong> of expensive components improves performance significantly.</li>
        <li><strong>Caching</strong> is used for improved performance. Check out "Cookies and Caches" for more details</li>
        </>:<>
        <li>We Learn is a Single Page Application that uses React library ensuring a smooth page navigation.</li>
        <li>Ensures fast initial page load followed by the data; giving users a smooth user experience.</li>
        <li>UI elements are loaded only when they visible (or about to be). This boosts the performance signicantly.</li>
        <li><strong>Caching</strong> is used for improved performance. Check out "Cookies and Caches" for more details</li>
        </>
    }</ul>

    {/* Sub-Heading: Data Management */}
    <h3 style={{fontWeight:"700", textDecoration:"underline"}}>Data Management:</h3>
    <ul style={{listStyleType:"square", marginBottom:"15px"}}>{
        isDevMode?<>
        <li>All the users data is securely stored in:
            <ul style={{listStyleType:"circle"}}>
                <li><HyperLink title="MongoDB Atlas" href="https://www.mongodb.com/products/platform/atlas-database"/></li>
                <li><HyperLink title="Cloudinary" href="https://cloudinary.com"/></li>
            </ul>
        </li>
        <li>Cloudinary file references (like version) are stored in MongoDB documents.</li>
        </>:<>
        <li>All the data is securely stored in:
            <ul style={{listStyleType:"circle"}}>
                <li>No-SQL database</li>
                <li>Content Delivery Network</li>
            </ul>
        </li>
        </>
    }</ul>

    {/* Sub-Heading: Cookies and Caches */}
    <h3 style={{fontWeight:"700", textDecoration:"underline"}}>Cookies and Caches:</h3>
    <ul style={{listStyleType:"square", marginBottom:"15px"}}>{
        isDevMode?<>
        <li>Cookies are used to:
            <ul style={{listStyleType:"circle"}}>
                <li>store user's app preferences.</li>
                <li>store tokens.</li>
            </ul>
        </li>
        <li>Server caching and client caching is used to deliver mostlty fresh fetched data as fast as possible; This also reduces the number of MongoDB hit significantly.</li>
        <li>
            Client side caching uses local storage for storing user specific data. 
            This is implemented using Tanstack Query with persistent storage (local-storage) so that data persists even after a fresh load / reload.
        </li>
        <li>Server side caching is handled by <strong>NextJS</strong>; however, Redis will be used in the future to some extent.</li>
        </>:<>
        <li>Cookies are used to:
            <ul style={{listStyleType:"circle"}}>
                <li>store user's app preferences.</li>
                <li>store tokens.</li>
            </ul>
        </li>
        <li>Caching is used to deliver a fast fetch experience for users; also reducing the number of database hits.</li>
        </>
    }</ul>

    {/* Sub-Heading: Security and Privacy */}
    <h3 style={{fontWeight:"700", textDecoration:"underline"}}>Security and Privacy:</h3>
    <ul style={{listStyleType:"square", marginBottom:"15px"}}>{
        isDevMode?<>
        <li>
            None of the user's data is being sold or shared with any unauthorized third-parties.
            However, they are being shared with listed third-party services for storage:
            <ul style={{listStyleType:"circle"}}>
                <li><strong>Cloudinary</strong></li>
                <li><strong>MongoDB Atlas</strong></li>
            </ul>
        </li>
        <li>Uses JWT (JSON Web Token) for authentication saved in cookies.</li>
        <li>Secure paths are implemented so that only authenticated user with appropiate permissions can access them.</li>
        </>:<>
        <li>
            None of the user's data is being sold or shared with any unauthorized third-parties.
            However, they are being shared with listed third-party services for storage:
            <ul style={{listStyleType:"circle"}}>
                <li><strong>Cloudinary</strong> (Content Delivery Network)</li>
                <li><strong>MongoDB Atlas</strong> (Database)</li>
            </ul>
        </li>
        <li>Secure paths are implemented so that only authenticated user with appropiate permissions can access them.</li>
        </>
    }
        <li className={css.names(`list-item ${effectiveTheme}`)}>
            The security of the app is being constantly inproved to prevent security threats and minimize vulnerabilities.
        </li>
    </ul>
    </>
}

const HyperLink = ({
    href, children, title
}:{
    children?: React.ReactNode
    href: string,
    title: string
})=>{
    
    return <>
        <strong>{children||title} </strong>
        <Anchor href={href} title={`go-to ${children?.toString()||title}`}>
            <strong>🡥</strong>
        </Anchor>
    </>
}
const DevToggle = ({isDevMode, setIsDevMode}:{
    isDevMode: boolean,
    setIsDevMode: React.Dispatch<React.SetStateAction<boolean>>
})=>{
    const css = useMemo(()=>new ModuleClassname(moduleStyle),[moduleStyle]);
    
    const { effectiveTheme } = useColorContext();
    
    const colors = {
        light:{
            on: "rgb(215, 217, 255)",
            off: "rgba(255, 255, 255, 0.74)",
        },
        dark:{
            on: "rgb(206, 209, 255)",
            off: "rgb(117, 118, 133)",
        }
    }
    const devModeSvg = useMemo(()=>{
        return <>
        <svg width={50} height={25} viewBox="0 0 50 35" style={{
            
        }}>
            <path
            d="M16.65 28.937 4.325 17.694 16.65 6.452M33.726 28.937 46.05 17.694 33.726 6.452M21.16 23.643l7.68-12.286"
            style={{
                transition:"all 0.3s ease",
                fill: "none",
                stroke: colors[effectiveTheme][isDevMode?"on":"off"],
                strokeWidth: isDevMode?4:3,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                paintOrder: "normal",
            }}
            />
        </svg></>
    },[effectiveTheme, isDevMode]);

    return <>
    <div style={{display:"flex", 
        marginLeft:"auto"
    }} onClick={()=>setIsDevMode(prev=> !prev)}>
        {/* Main Toggle Button */}
        <div className={css.names(`dev-toggle ${effectiveTheme} ${isDevMode?"on":"off"}`)}
        style={{}}>
            {devModeSvg} <span style={{
                transition:"all 0.2s ease",
                color: colors[effectiveTheme][isDevMode?"on":"off"]
            }}>Dev View</span>
        </div>
    </div>
    </>
}