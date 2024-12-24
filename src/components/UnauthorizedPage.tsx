import './UnauthorizedPage.css'
import { FC } from "react";
import Image from "next/image";
import logo from "@/images/logo/logo";
type Props = {
    zIndex?:number;
    show: boolean;
}
const UnauthorizedPage: FC<Props> = ({show,zIndex}) =>{
    return(
        <div className="unauthorized-page" style={{zIndex: `${zIndex||100}`,display:`${!show?'none':''}`}}>
            <Image src={logo.unauthorized} alt="unauthorized" width={400}/>
        </div>
    )
}
export default UnauthorizedPage;