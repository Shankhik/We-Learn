'use client'

import Link from 'next/link'
import './style.css'

export default function Changelog (){
    const changelog = [
        <>
            <h2>Version: 0.2.8 </h2>
            <h6>06/02/2025</h6>
            <h3>Modified</h3>
            <ul>
                <li><strong>Dashboard</strong>{`'s`} course card</li>
            </ul>
            <h3>Fixed</h3>
            <ul>
                <li><strong>Landing Page</strong>{`'s`} highlights icons</li>
            </ul>
        </>,
        <>
            <h2>Version: 0.2.7 </h2>
            <h6>16/01/2025</h6>
            <h3>Fixed</h3>
            <ul>
                <li><strong>Learn More</strong> {`sections's`} text alignment for mobile devices</li>
            </ul>
        </>,
        <>
            <h2>Version: 0.2.6 </h2>
            <h6>16/01/2025</h6>
            <h3>Added</h3>
            <ul>
                <li><strong>Learn More</strong> details in Landing page footer</li>
            </ul>
            
        </>,
        <>
            <h2>Version: 0.2.5</h2>
            <h6>11/01/2025</h6>
            <h3>Added</h3>
            <ul>
                <li><strong>Forgot Password</strong> Section</li>
                <li>Email Service for <strong>SignUp</strong>, <strong>Forgot Password OTP</strong></li>
            </ul>
        </>,
        <>
            <h2>Version: 0.2.3</h2>
            <h6>04/01/2025</h6>
            <h3>Modified</h3>
            <ul>
                <li><strong>Login</strong> and <strong>Signup</strong> Section</li>
                <li><strong>README.md</strong> file</li>
                <li>Course learn {`page's`} Course Name alignment</li>
            </ul>
            <h3>Fixed</h3>
            <ul>
                <li>Landing Page font-color when Browser Theme: Light</li>
                <li>Course skills not loading at first go</li>
            </ul>
        </>,
        <>
            <h2>Version: 0.2.0</h2>
            <h6>01/01/2025</h6>
            <h3>Added</h3>
            <ul>
                <li>Added Changelog in the Repository</li>
                <li>Added {`'sharp'`} package for image optization.</li>
                <li>CORs for Production Build</li>
            </ul>
            <h3>Modified</h3>
            <ul>
                <li>Landing Page</li>
                <li>Reworked Login and Signup page</li>
                <li>Reworked Loading & Locked page</li>
                <li>UI responsiveness for mobile devices</li>
            </ul>
            <h3>Fixed</h3>
            <ul>
                <li>API Endpoints</li>
                <li>UI issues in: Landing page, Home Page</li>
            </ul>
        </>,
        <>
            <h2>Version: 0.1.3</h2>
            <h6>24/12/2024</h6>
            <h3>Modified</h3>
            <ul>
                <li>Landing Page {`' Let's Learn '`} button</li>
            </ul>
        </>,
        <>
            <h2>Version: 0.1.0</h2>
            <h6>24/12/2024</h6>
            <h3>Created</h3>
            <ul>
                <li>{`'We Learn'`} GitHub Repository</li>
            </ul>
        </>
    ]
    
    return (
        <>
            <h1 id='changelog-heading'>ChangeLog</h1>
            <div className="changelog-versions">{changelog.map((element,index)=> {
                return <div key={index}>
                    <div>{element}</div>
                    <hr hidden={index===changelog.length-1? true:false}/>
                </div>
            })}</div>
            {/*<Link href={'upload'}>Upload</Link>*/}
        </>
    )
}