import { Heading } from "@/components/htmlElements/Texts";
import Button from "@/components/buttons/NewButton";

export default function Auth (){
    return <>
    <Heading>Authorize</Heading>
    <div style={{display:"flex", gap:"10px"}}>
        <Button href="auth2/login">Login</Button>
        <Button href="auth2/signup">Signup</Button>
    </div>
    </>
}