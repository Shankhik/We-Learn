'use client';

import moduleStyle from "./NavbarLogo.module.css";
import ModuleClassname from "@/lib/cssUtil";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useColorContext } from "@/context/colorScheme";

type Props = {
    style?: React.CSSProperties,
    ref?: React.RefObject<HTMLImageElement|null>
}
const Logo = ({
    style, ref
}:Props)=>{
    const { effectiveTheme } = useColorContext();
    const css = new ModuleClassname(moduleStyle);
    const {push} = useRouter();
    return <NextImage
        loading="eager" draggable={false}
        onClick={()=> push("/")}
        width={700} height={300} style={style} ref={ref}
        className={css.names(`logo ${effectiveTheme}`)}
        src={"/WeLearnLogo.svg"} // From pblic folder
        alt="We-Learn"
    />
}

export default Logo;