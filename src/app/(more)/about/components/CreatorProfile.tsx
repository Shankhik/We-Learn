"use client";

import moduleStyle from "./_components.module.css";
import ModuleClassname from "@/lib/cssUtil";

import { Heading, Paragraph } from "../../PageElements";
import { useColorContext } from "@/context/colorScheme";

export default function CreatorProfile (){
    const { effectiveTheme } = useColorContext()
    return <>
    <hr style={{marginTop:"30px", border:`1px solid ${effectiveTheme==="light"?
        "rgba(72, 97, 240, 0.4)":
        "rgba(184, 197, 255, 0.31)"}`,
    }}/>
    <Heading style={{
        //textAlign:"center",
        marginTop:"20px",
    }}>
        From the Creator
    </Heading>
    <div className={moduleStyle['creator-profile-picture']}
    style={{margin:"30px 0"}}>

    </div>
    <h1 style={{alignSelf:"center",
        translate: "0 -30%",
        marginBottom:"30px"
    }}>Shakhik Sarkar</h1>
    <Paragraph fontSize="1.2rem">
        <em>" <span style={{fontSize:"1.4rem", fontWeight:"700"}}>Hello!</span> I&apos;m the developer behind this project and I sincerely appreciate you visiting this website and taking a look around. 
        This platform is a result of experimenting, learning, and trying to create something that others can benefit from as well.
        </em>
    </Paragraph>
    <Paragraph fontSize="1.2rem">
        <em>
        This project is <strong>not</strong> just a platform for me, but a continuous learning process. 
        This project demonstrate most of the skills I have as a developer.
        The goal is to keep improving the platform, expand its capabilities, and make it a place where both learners and creators can grow together.
        "</em>
    </Paragraph>
    </>
}
//I enjoy building tools that are simple, practical, & useful. 