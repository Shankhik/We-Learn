"use client";

import { Heading } from "@/components/htmlElements/Texts";
import { Hr, SettingsField } from "../Components";
import { useAuthContext } from "@/context/authContext";
import HideIf from "@/components/HideIf";

type DeleteTypes = 'account'|'purchases'
export default function PageClient () {
    const {admin} = useAuthContext();
    return<>
    <title>Account</title>
    <SettingsField label={`Delete your account`}
    type={'button'} value="Delete" href="account/delete?delete=account"/>
    <Hr/>
    <SettingsField label={`Change your password`}
    type={'button'} value="Change" href="account/update?edit=password"/>
    
    <HideIf
        // Won't be available if the user isn't an admin
        hideIf={!admin}
    >
        <Heading style={{fontSize:'0.9rem', margin:"10px 0 10px 10px"}}>
            For Admin
        </Heading>
        <SettingsField label="Add Courses" type="button"
        buttonStyle={{
            textOverflow:'ellipsis',
            overflow:'hidden',
            whiteSpace:'nowrap'
        }}
            value="Make a course"
            href="/add-course"
        />
    </HideIf>
    
    </>
}