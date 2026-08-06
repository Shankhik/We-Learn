'use client'

import ModuleClassname from "@/lib/cssUtil";
import moduleStyle from "../global.module.css";
import { useRef, useState } from "react";
import Link from "next/link";
import { FormField, SubmitButton } from "../Components";
import { loginDataType } from "@/types/authType";
import { useAuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { appfetch } from "@/lib/fetchReq";
import { useNotification } from "@/context/notification";

import { purifyRegex, purifyString } from "@/lib/purify/purifyFields";

export default function LoginPage () {
    const css = new ModuleClassname(moduleStyle);
    const { pushNotification } = useNotification()
    const { updateAuth } = useAuthContext();
    const { replace } = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    
    const refUsername = useRef<HTMLInputElement>(null);
    const refPassword = useRef<HTMLInputElement>(null);

    const purify = {
        username: {
            regex: purifyRegex("username"),
            hint: "Only alphanumeric values with { - _ @ # $ % & * } are allowed."
        },
        password: {
            regex:purifyRegex("password"),
            hint: "Only alphanumeric values with { - _ @ # $ % & * } are allowed."
        }
    }

    const onSubmit = async ()=> {
        
        if (!refUsername.current || !refPassword.current) return;
        
        // Empty Fields check.
        if (!refUsername.current.value || !refPassword.current.value){
            pushNotification("Please fill out Username and Password",{color:"yellow"});
            return;
        }
        const formData:loginDataType = {
            username: purifyString(refUsername.current.value, purify.username.regex),
            password: purifyString(refPassword.current.value, purify.password.regex)
        }

        // If purified string is different than original
        // -> Can't send request
        if (
            refPassword.current.value !== formData.password ||
            refUsername.current.value !== formData.username
        ) {
            pushNotification("Please enter valid characters in input fields.",{
                color:"red"
            }); return;
        }

        // Sending Login request
        // const response = await appfetch<Status,loginDataType>("/api/login-req", formData )
        const response = undefined as Status | undefined;
        // If Login Failes
        if(!response || !response.status) {
            pushNotification(
                response?.error || response?.message || "Login Failed",{
                color: 'red'
            })
            return;
        };
        
        updateAuth();
        replace('/home/dashboard');
    }

    return <>
    <form>
        <FormField type={'text'} label="Username" ref={refUsername}
            purifyRegex={purify.username.regex} hint={purify.username.hint}
        />

        <FormField type={'password'} label="Password" ref={refPassword}
            showPassword={showPassword} togglePassword={setShowPassword}
            purifyRegex={purify.password.regex} hint={purify.password.hint}
        />
        <Link href={""} style={{margin: '30px auto 0px auto'}}>
            Forgot Password?
        </Link>
        <SubmitButton onSubmit={onSubmit}>
            Login
        </SubmitButton>
    </form>
    </>
}