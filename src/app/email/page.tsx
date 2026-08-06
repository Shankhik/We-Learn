/* This file is excluded from Git */
/* Used for email's layout testing */

import OTPEmail from "@/react-emails/_OTPEmail";

export default function Page (){
    return <OTPEmail purpose={'Email Update'} username={"PeaceKeeper"} otp={"27862783"}/>
}