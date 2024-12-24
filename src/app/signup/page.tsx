'use client'

import './page.css'

//React/Next Imports
import { FormEvent, useRef, useState} from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

//Other Libraries and Types
import { get,post } from '@/lib/fetchReq';
import { signupDataType } from '@/types/authType';
import { setCookie } from '@/lib/cookies';
import { status } from '@/types/statusType';
import { useAuthContext } from '@/context/authContext';
import Loading from '@/components/loadingAnimation';

class apiLinks {
    static apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN||'localhost:3000'
    static httpsOrNot = process.env.NODE_ENV==='production'?'https':'http';

    static get submitSignupForm(){ return `${this.httpsOrNot}://${this.apiDomain}/api/signup-req`}
}
export default function SignupPage (){
    const router = useRouter();
    
    /* Contexts */
    //auth context
    const {updateAuth} = useAuthContext();

    /* States */
    const [showPwd, setShowPwd] = useState<boolean>(false);
    const [pageState, setPageState] = useState<'working'|'rest'>('rest')
    
    /* Elements */
    const elements = {
        passWDEye: useRef<SVGSVGElement|null>(null)
    }

    /* Form Data and Handler */
    const formData = {
        username: useRef<HTMLInputElement>(null),
        email: useRef<HTMLInputElement>(null),
        password: useRef<HTMLInputElement>(null)
    }
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        let signupData: signupDataType = {
            username: formData.username.current?.value || '' ,
            email: formData.email.current?.value || '' ,
            password: formData.password.current?.value || '' ,
            admin: false
        }
        //POST fetch req
        //console.log(signupData)
        setPageState('working');
        let resData: status = await post(apiLinks.submitSignupForm,signupData);

        if(resData.token) /*Checks if token is present or not*/ {
            setCookie('authToken', resData.token);
            //force refreshes AuthContext
            updateAuth();
            setPageState('rest')
            router.replace('/home/dashboard')
            
        }
        else {setPageState('rest');alert(resData.message)}
        

    }
    return(
        <div className='page' id="signup-page">
            <div id='signup-box'>
                {pageState === 'working'?
                    <div id='login-process'>
                        <Loading width={100}/>
                    </div>: ''
                }
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    
                    <div className='fields-container'>
                        
                        <div className="fields">
                            <label>Username</label>
                            <input type='text' placeholder='Enter Username (UNIQUE)' ref={formData.username}/>
                        </div>
                        <div className="fields">
                            <label>Email</label>
                            <input type='email' placeholder='Enter Email' ref={formData.email}/>
                        </div>
                        <div className="fields">
                            <label>Password</label>
                            <input type={showPwd?'text':'password'} placeholder='Enter Password' ref={formData.password}/>
                            <svg
                            ref={elements.passWDEye}
                            width="60"
                            height="60"
                            viewBox="0 0 60 60"
                            id="eye-svg"
                            onClick={()=>setShowPwd(!showPwd)}>
                            
                            <g id="eye-svg-g" fill="rgb(182, 182, 182)">
                            <g id="iris">
                                <path
                                    fill="#44aa5d"
                                    fillOpacity="1"
                                    d="m 39.135712,26.723295 a 9.7232952,9.7232952 0 0 1 -9.708697,9.723284 9.7232952,9.7232952 0 0 1 -9.73785,-9.694087 9.7232952,9.7232952 0 0 1 9.679457,-9.752393 9.7232952,9.7232952 0 0 1 9.766914,9.664803"
                                />
                                <path
                                    fill='#ffffff'
                                    fillOpacity='0.4'
                                    d="m 34.991776,26.723295 a 5.5793595,5.5793595 0 0 1 -5.570983,5.579353 5.5793595,5.5793595 0 0 1 -5.587711,-5.562599 5.5793595,5.5793595 0 0 1 5.554204,-5.596057 5.5793595,5.5793595 0 0 1 5.604389,5.545797"
                                />
                            </g>
                            <g id="open-lid" display={showPwd?'none':'inline'}>
                                <path
                                    d="M 54.007812,23.300781 C 49.242911,19.304019 41.456569,15 30,15 18.116534,15 10.182148,19.628788 5.4726562,23.744141 a 24.636532,11.373937 0 0 0 -0.2675781,1.68164 24.636532,11.373937 0 0 0 1.6367188,3.962891 C 11.655428,24.971232 19.18769,20.507812 30,20.507812 c 10.677745,0 18.151975,4.3539 22.972656,8.716797 1.670491,1.511858 3.028004,3.023845 4.082031,4.357422 C 59.025831,31.516872 60,30 60,30 60,30 58.138951,26.765947 54.007812,23.300781 Z M 6.8417969,29.388672 A 24.636532,11.373937 0 0 1 5.2050781,25.425781 24.636532,11.373937 0 0 1 5.4726562,23.744141 C 1.7054196,27.03611 0,30 0,30 c 0,0 0.97416914,1.516872 2.9453125,3.582031 1.0156945,-1.285077 2.3091045,-2.73663 3.8964844,-4.193359 z"
                                />
                                <g id="lashes" >
                                    <rect
                                        width="5.5793595"
                                        height="9.0219431"
                                        x="-0.52897871"
                                        y="13.111699"
                                        rx="3"
                                        transform="rotate(-29.244803)"
                                    />
                                    <rect
                                        id="rect11"
                                        width="5.5793595"
                                        height="9.0219431"
                                        x="26.698616"
                                        y="5.1045208"
                                        rx="3"
                                    />
                                    <rect
                                        id="rect12"
                                        width="5.5793595"
                                        height="9.0219431"
                                        x="-52.881344"
                                        y="-16.200796"
                                        rx="3"
                                        transform="matrix(-0.87254032,-0.4885421,-0.4885421,0.87254032,0,0)"
                                    />
                                </g>
                                <path
                                    d="M 4.2809649,34.33166 7.051001,31.477683 c 0,0 7.340669,7.060227 22.41211,7.134941 15.071441,0.07471 23.839099,-7.386762 23.839099,-7.386762 l 3.273679,3.273679 c 0,0 -8.580178,8.226167 -26.944897,8.226167 -18.364719,0 -25.3500271,-8.394048 -25.3500271,-8.394048 z"
                                />
                            </g>
                            <g id="close-lid" display={showPwd?'inline':'none'}>
                                <path
                                    d="M 54.007812,23.300781 C 49.242911,19.304019 41.456569,15 30,15 18.116534,15 10.182148,19.628788 5.4726562,23.744141 a 24.636532,11.373937 0 0 0 -0.2675781,1.68164 24.636532,11.373937 0 0 0 1.6367188,3.962891 C 11.655428,24.971232 19.18769,20.507812 30,20.507812 c 10.677745,0 18.151975,4.3539 22.972656,8.716797 1.670491,1.511858 3.028004,3.023845 4.082031,4.357422 C 59.025831,31.516872 60,30 60,30 60,30 58.138951,26.765947 54.007812,23.300781 Z M 6.8417969,29.388672 A 24.636532,11.373937 0 0 1 5.2050781,25.425781 24.636532,11.373937 0 0 1 5.4726562,23.744141 C 1.7054196,27.03611 0,30 0,30 0,30 0.97416914,31.516872 2.9453125,33.582031 3.961007,32.296954 5.254417,30.845401 6.8417969,29.388672 Z M 52.972656,29.224609 C 48.151975,24.861712 40.677745,20.507812 30,20.507812 c -10.81231,0 -18.344572,4.46342 -23.1582031,8.88086 a 24.636532,11.373937 0 0 0 23.0351561,7.376953 24.636532,11.373937 0 0 0 23.095703,-7.541016 z"
                                />
                                <g transform="matrix(1,0,0,-1,0,52.859897)">
                                    <rect
                                        width="5.5793595"
                                        height="9.0219431"
                                        x="-0.52897871"
                                        y="13.111699"
                                        rx="3"
                                        transform="rotate(-29.244803)" />
                                    <rect
                                        width="5.5793595"
                                        height="9.0219431"
                                        x="26.698616"
                                        y="5.1045208"
                                        rx="3" />
                                    <rect
                                        width="5.5793595"
                                        height="9.0219431"
                                        x="-52.881344"
                                        y="-16.200796"
                                        rx="3"
                                        transform="matrix(-0.87254032,-0.4885421,-0.4885421,0.87254032,0,0)" />
                                </g>
                            </g>
                            </g>
                            </svg>
                        </div>
                        
                    </div>
                    <input className= 'signup-submit' type='submit' value='Submit'/>
                </form>
            </div>
        </div>
    )
}