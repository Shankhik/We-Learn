import { FC } from "react";
import Loading from "./loadingAnimation";
import './LoadingPage.css';

type Props ={
    zIndex?: number;
    show:boolean;
}
const LoadingPage:FC<Props> = ({show,zIndex})=>{
    return(
        <div className='loading-page' style={{zIndex: `${zIndex||100}`,display:`${!show?'none':''}`}}>
            <Loading/>
        </div>
    )
}
export default LoadingPage;