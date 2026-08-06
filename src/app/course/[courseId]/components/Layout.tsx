"use client";

import moduleStyle from "./Layout.module.css";
import ModuleClassname from "@/lib/cssUtil";

import { Activity, SetStateAction, use, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ProfilePopup from "@/components/popup/ProfilePopup";
import { useColorContext } from "@/context/colorScheme";
import Button from "@/components/buttons/NewButton";
import Page from "@/components/ui-components/layout-structure/Page";
import Navbar from "@/components/navbar/Navbar2";

/* Floating Modules Navbar:
    -> Course Id
    -> Module Titles
    -> Completed Upto
*/

export default function Layout ({children, courseName}:{
    children: React.ReactNode,
    courseName: string|undefined
}) {
    const [show, setShow] = useState<boolean>(false);
    const onClick = ()=> setShow(true);
    return <>
    <ProfilePopup show={show} setShow={setShow}/>
    <Page>
        <Navbar title={courseName||""}
            onProfileClick={onClick}
        />
        {children}
    </Page>
    </> 
}
