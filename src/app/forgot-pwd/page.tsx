import './style.css'
import Image from 'next/image'
import sorry from './apology.png'
export default function ForgotPassword (){
    return(
    <div id="forgot-pwd-page">
        <h1>Working on this Section</h1>
        <h3>This Page will be available soon</h3>
        <Image src={sorry} alt='sorry'></Image>
    </div>
    )
}