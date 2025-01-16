'use client'

import Link from 'next/link';
import './style.css'

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import Alert from '@/components/Alert';
import { post } from '@/lib/fetchReq';
import ApiLinks from '@/lib/apiLinks';
import { forgotPwdDataType } from '@/types/authType';
import { status } from '@/types/statusType';
import { bcryptCompare, bcryptHash } from '@/lib/bcrypt';
import { delCookie, getCookie, setCookie } from '@/lib/cookies';
import { useRouter } from 'next/navigation';
import { signToken } from '@/lib/jwt';
import LoadingPage from '@/components/Loading';
export default function ForgotPassword (){
    const router = useRouter();
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [idVerified, setIdVerified] = useState<boolean>(false);
    const [otpVerified, setOtpVerified] = useState<boolean>(false);
    const [showPwd,setShowPwd] = useState<boolean>(false);
    const [username,setUsername] = useState<string>('');
    const [emailAdrress, setEmailAddress]= useState<string>('');
    const [otpField, setOtpFields] = useState<Array<string>>(['','','',''])
    
    const verifyForm = useRef<HTMLFormElement|null>(null)
    const otpForm = useRef<HTMLFormElement|null>(null)
    const changePwdForm = useRef<HTMLFormElement|null>(null)
    const lastOtp = useRef<HTMLInputElement|null>(null)
    
    //Label Focus Style
    const onFocus = (e:React.FocusEvent<HTMLInputElement>)=>{
        const parent = e.target.parentElement
        let label = parent?.previousSibling as HTMLLabelElement
        label.style.color='rgb(71, 146, 121)'
    }
    const onBlur = (e:React.FocusEvent<HTMLInputElement>)=>{
        const parent = e.target.parentElement
        let label = parent?.previousSibling as HTMLLabelElement
        label.style.color=''
    }

    // Submit Handlers
    const checkUser = async (e:FormEvent)=>{
        e.preventDefault(); 

        setShowLoading(true);
        //Add check Logic here
        let username = ((verifyForm.current?.children[1])?.children[0] as HTMLInputElement).value
        let email = ((verifyForm.current?.children[3])?.children[0] as HTMLInputElement).value
        const data:forgotPwdDataType = {
            username: username,
            email: email as `${string}@${string}`
        }
        const res = await post(ApiLinks.forgotPwd.verifyUser.this,data) as status

        setShowLoading(false);

        if(res.status){
            setCookie('Otp', res.hashed||'', 10);
            setEmailAddress(email);
            setUsername(username);
            setIdVerified(true);
        }else{
            setShowAlert(true);
        }
        
    }
    useEffect(()=>{
        if (otpField.join("").length===otpField.length){
            otpForm.current?.requestSubmit();
        }
    },[otpField])
    const submitOtp = async (e:FormEvent)=>{
        e.preventDefault();

        const hashed = getCookie('Otp').cookie||'';
        // Needed to join the last digit manually :)
        const otp = otpField.join("");

        //Add Logic here
        
        if (!hashed){
            setMessageType('Expired')
            setShowAlert(true);
            setIdVerified(false);
            return
        }

        let isSame = (await bcryptCompare(otp,hashed)).status
        
        if(isSame) {
            delCookie('Otp');
            setOtpVerified(true);
        }
        else{
            setMessageType('Wrong OTP');
            setShowAlert(true);
        }
    }
    const submitPwdChange = async(e: FormEvent)=>{
        e.preventDefault();

        let pwd = ((changePwdForm.current?.children[1])?.children[0] as HTMLInputElement).value
        let confirmPwd = ((changePwdForm.current?.children[3])?.children[0] as HTMLInputElement).value
        
        if(pwd === confirmPwd){
            const data:forgotPwdDataType = {
                username: username,
                email: emailAdrress as `${string}@${string}`
            }
            let token = signToken({
                username: username,
                password: pwd
            },10).token
            
            let res = await post(ApiLinks.forgotPwd.changePwd.this, data,{
                'Authorization':`Bearer ${token}`,
                'Content-Type': 'application/json'
            }) as status
            
            if (res.status){
                router.replace('/login')
            }else{
                alert('something went wrong!')
                setShowAlert(true);
            }
        }else {
            alert("Both are not the same!")
        }
        

        
    }
    // Box Contents
    const verifyPrompt:JSX.Element =(
        <div className='verify-content'>
            <p>Please enter the required fields.</p>
            <form ref={verifyForm} onSubmit={checkUser}>
                <label>Username</label>
                <div>
                    <input type='text' autoComplete='off'
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                </div>
                <label>Email</label>
                <div>
                    <input type='email' autoComplete='off'
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                </div>
                <input type='submit' value={'Check'}/>
            </form>
        </div>
    )
    const otpPrompt:JSX.Element =(
        <div className='otp-content'>
            <p style={{textWrap:'wrap'}}>
                We have sent an OTP to: <strong>{emailAdrress}</strong>
            </p>
            <p style={{marginTop:'20px'}}>Do <strong>Not</strong> close this window</p>
            
            <form ref={otpForm} onSubmit={submitOtp}>
                <div className='otp-field'>
                {otpField.map((value,index)=>{
                    return <input key={`otp-${index}`} type='text'
                        id={`otp-${index}`}
                        autoComplete='off'
                        value={value}
                        maxLength={1}
                        onChange={(e)=> handleOtpChange(e,index)}
                    />
                })}
                </div>
            </form>
            <p>{`Didn't`} get OTP? <Link href={'ad'}>Resend</Link></p>
        </div>
    )
    
    const changePwdPrompt:JSX.Element =(
        <div className='change-pwd-content'>
            <p>Create your new password.</p>
            <form id='test-form' ref={changePwdForm} onSubmit={submitPwdChange}>
                <label>New Password</label>
                <div>
                    <input type={showPwd?'text':'password'} autoComplete='off'
                        onCopy={(e)=> {e.preventDefault(); return false}}
                        onCut={(e)=> {e.preventDefault(); return false}}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                    <svg
                        style={{
                            position:"absolute",
                            right:'10px',
                            top:'0px',
                        }}
                        width="20"
                        height="100%"
                        viewBox="0 0 60 60"
                        id="eye-svg"
                        onClick={()=>setShowPwd(!showPwd)}>        
                        <g id="eye-svg-g" fill="rgb(139, 139, 139)">
                        <g id="iris">
                            <path
                                fill="rgb(69, 133, 138)"
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
                <label>Confirm Password</label>
                <div>
                    <input type='password' autoComplete='off'
                        onCopy={(e)=> {e.preventDefault(); return false}}
                        onCut={(e)=> {e.preventDefault(); return false}}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                </div>
                <input type='submit' value={'Change'}/>
            </form>
        </div>
    )

    // OTP Effects
    const handleOtpChange = (e:ChangeEvent<HTMLInputElement>, index:number)=>{
        let data = [...otpField];
        //console.log(otpField);
        if(isNaN(parseInt(e.target.value)) && e.target.value!=='') return
        
        data[index] = e.target.value
        //console.log(data)
        setOtpFields(data)

        if(e.target.value==='' && index>0){
            (e.target.previousSibling as HTMLInputElement).focus()
        }
        //shifts to next input
        if(e.target.value && index<3){
            (e.target.nextSibling as HTMLInputElement).focus()
        }
        /*
        if(e.target.value && index===3){
            otpForm.current?.requestSubmit();
        }*/
        
    }
    
    
    const [messageType, setMessageType] = useState<`No Account`|`Wrong OTP`|`Expired`>('No Account')
    useEffect(()=>{
        setMessageType(!idVerified? 'No Account':'Wrong OTP')
    },[idVerified,otpVerified])

    const MessageBox = ({type}:{type: "No Account"|"Wrong OTP"|"Expired"}):JSX.Element=>{
        switch (type){
            case 'No Account':
                return <div className="fpwd alert-box">
                    <h2 className="fpwd alert-box-heading">No User Found</h2>
                    <p className="fpwd alert-box-message">
                        User with these credentials {`don't`} exists<br/>
                        Please <strong>RE-CHECK</strong> these Credentials.
                    </p>
                    <button className="fpwd alert-box-close"
                        onClick={()=>{setShowAlert(false)}}
                    >Close</button>
                </div>
            case 'Wrong OTP':
                return <div className="fpwd alert-box">
                    <h2 className="fpwd alert-box-heading">Wrong OTP</h2>
                    <p className="fpwd alert-box-message">
                        This OTP is <strong>Incorrect</strong>
                    </p>
                    <button className="fpwd alert-box-close"
                        onClick={()=>{setShowAlert(false)}}
                    >Close</button>
                </div>
            case 'Expired':
                return <div className="fpwd alert-box">
                    <h2 className="fpwd alert-box-heading">Expired!</h2>
                    <p className="fpwd alert-box-message">
                        The OTP has expired
                    </p>
                    <button className="fpwd alert-box-close"
                        onClick={()=>{setShowAlert(false)}}
                    >Close</button>
                </div>
        }
    }
    return(
    <div id="forgot-pwd-page">
        <LoadingPage show={showLoading}/>
        <Alert content={<MessageBox type={messageType}/>} show={showAlert} close={setShowAlert}/>
        <div className='forgot-pwd-box'>
            <h1>Forgot Password?</h1>
            {!idVerified?verifyPrompt:(!otpVerified?otpPrompt:changePwdPrompt)}
        </div>
    </div>
    )
}