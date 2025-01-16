import './style.css'
import Image from 'next/image'
export default function About() {
    return (
        <div className='about-page'>
            <h1 id='about-heading'>About</h1>
            <p>
                We-Learn is a cutting-edge e-learning platform designed to revolutionize the way you learn online. 
                With its intuitive design, secure architecture, and versatile course offerings, 
                We-Learn empowers learners of all levels to achieve their educational goals seamlessly.
            </p>
            <p><strong>
                Key Features:
            </strong></p>
            <ul>
                <li>
                    <strong style={{color:'rgb(172, 95, 95)'}}>Interactive Dashboard: </strong>
                    Your personalized hub for tracking progress, managing courses, and staying motivated.
                </li>
                <li>
                    <strong style={{color:'rgb(117, 83, 156)'}}>Diverse Courses: </strong>
                    Access a wide range of topics tailored to your interests and career aspirations.
                </li>
                <li>
                    <strong style={{color:'rgb(83, 109, 167)'}}>Fluid UI: </strong>
                    Built with a sleek and responsive interface for a seamless learning experience across devices.
                </li>
                <li>
                    <strong style={{color:'rgb(68, 126, 53)'}}>Secure Environment: </strong>
                    Advanced security measures ensure the protection of your data and learning resources.
                </li>
            </ul>

            <p style={{marginTop:'30px'}}>
            Here are some of the key tools and frameworks {`we've`} used to bring this platform to life:
            </p>
            <div className='pck-container'>
                <div>
                    <img src={"https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png"} alt='React'/>
                </div>
                <div>
                    <img src={"https://cdn.brandfetch.io/id2alue-rx/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B"} alt='next'/>
                </div>
                <div>
                    <img src={"https://jwt.io/img/logo.svg"} alt='JWT'/>
                </div>
                <div>
                    <img src={"https://webimages.mongodb.com/_com_assets/cms/kuyjf3vea2hg34taa-horizontal_default_slate_blue.svg?auto=format%252Ccompress"} alt='MongoDB'/>
                </div>
            </div>

            <div style={{
                marginTop:'10dvh',
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                gap:'20px'
            }}>
                <h2>Thanks for Visiting! ☺️</h2>
                <img style={{
                    width:'20dvh',
                    alignSelf:'center'
                }} src="https://cdn-icons-png.flaticon.com/512/9554/9554962.png" alt="ok" />
            </div>
        </div>
    )
}