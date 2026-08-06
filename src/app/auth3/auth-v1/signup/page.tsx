'use client'

import ModuleClassname from "@/lib/cssUtil";
import moduleStyle from "../global.module.css";
import { useRef, useState } from "react";

import { FormField, SubmitButton } from "../Components";
import { signupDataType } from "@/types/authType";
import { appfetch } from "@/lib/fetchReq";
import { useAuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useNotification } from "@/context/notification";
import { purifyRegex, purifyString } from "@/lib/purify/purifyFields";

export default function SignupPage () {
    const css = new ModuleClassname(moduleStyle);
    const { pushNotification } = useNotification()
    const { updateAuth } = useAuthContext();
    const { replace } = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const refUsername = useRef<HTMLInputElement>(null);
    const refEmail = useRef<HTMLInputElement>(null);
    const refPassword = useRef<HTMLInputElement>(null);

    const purify = {
        username: {
            regex: purifyRegex("username"),
            hint: "Only alphanumeric values with { - _ @ # $ % & * } are allowed."
        },
        password: {
            regex:purifyRegex("password"),
            hint: "Only alphanumeric values with { - _ @ # $ % & * } are allowed."
        },
        email: {
            regex: purifyRegex("email-format"),
            hint: "Invalid email format"
        }
    }
    const onSubmit = async ()=>{
        if(!refEmail.current || !refUsername.current || !refPassword.current) return;

        // Empty Fields check.
        if (!refUsername.current.value || !refPassword.current.value || !refEmail.current.value){
            pushNotification("Please fill out Username, Email and Password",{color:"yellow"});
            return;
        }

        const formData:signupDataType = {
            // Purifying Username
            username: purifyString(refUsername.current.value, purify.username.regex),
            email: refEmail.current.value,
            password: purifyString(refPassword.current.value, purify.password.regex),
            admin: false
        }

        // If purified string is different than original
        // -> Can't send request
        if (
            refPassword.current.value !== formData.password ||
            refUsername.current.value !== formData.username
        ) {
            pushNotification("Please enter valid characters in the input field.",{
                color:"red"
            }); return;
        }

        // Checking Email format
        if(!purify.email.regex.test(refEmail.current.value)){
            pushNotification(purify.email.hint, {color:"red"});
            return;
        }

        // const response = await appfetch<Status, signupDataType>("/api/signup-req", formData)
        const response = undefined as Status|undefined;
        // If signup fails
        if(!response || !response.status) {
            pushNotification(
                response?.error||response?.message||"Signup Failed",{
                color:'red'
            })
            return;
        };
        
        updateAuth();
        replace('/home/dashboard')
    }
    
    return <>
    <form>
        <FormField label="Username" type="text" ref={refUsername}
            hint={purify.username.hint} purifyRegex={purify.username.regex}
        />
        <FormField label="Email" type="email" ref={refEmail}/>
        <FormField label="Password" type="password" ref={refPassword}
            showPassword={showPassword} togglePassword={setShowPassword}
            hint={purify.password.hint} purifyRegex={purify.password.regex}
        />
        <SubmitButton onSubmit={onSubmit}>
            Signup
        </SubmitButton>
    </form>
    </>
}