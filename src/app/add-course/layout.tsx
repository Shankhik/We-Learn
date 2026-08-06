'use client';

import moduleStyle from "./page.module.css"
import { useAuthContext } from "@/context/authContext";
import { useColorContext } from "@/context/colorScheme";
import ModuleClassname from "@/lib/cssUtil";
import Redirect from "./Redirect";

export default function AddCourse (props:{children:React.ReactNode}){
    const css = new ModuleClassname(moduleStyle)
    const inDev = process.env.NODE_ENV==='development'
    const {admin, verified} = useAuthContext()
    const {effectiveTheme} = useColorContext()
    return !verified? null: admin? <>
    <div className={css.names(`page ${effectiveTheme}`)}>
        <div className={moduleStyle['children']}>
            {props.children}
        </div>
    </div>
    </>: <Redirect/>
}