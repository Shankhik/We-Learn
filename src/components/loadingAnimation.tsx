import logo from "@/images/logo/logo";
import './loadingAnimation.css'
import { FC } from "react";
type Props = {
    width?: number;
}
const Loading: FC<Props>=({width}):JSX.Element =>{
    return(
        logo.loading(width? width: undefined)
    )
}
export default Loading;