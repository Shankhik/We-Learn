import WaitingAnimation from "@/components/loading/WaitingAnimation";
import moduleStyle from "../page.module.css"

export default function Update() {
    return <>
    <WaitingAnimation className={moduleStyle['next-patch']}/>
    <h1 style={{
        fontSize:'1.4rem',marginTop:'20px',
        width:'min(86%, 700px)', alignSelf:'center',
        textAlign:'center',}}
    >This feature will be available soon!</h1>
    </>
}