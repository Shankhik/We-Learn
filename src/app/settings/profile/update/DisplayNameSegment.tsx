import { useAuthContext } from "@/context/authContext";
import { TextField } from "../../Components";
import { useRef, useState } from "react";
import Button from "@/components/buttons/NewButton";
import { useColorContext } from "@/context/colorScheme";
import { appfetch } from "@/lib/fetchReq";
import { ReqDataType } from "@/lib/apiReqDataType";
import { useRouter } from "next/navigation";
import { useNotification } from "@/context/notification";

export default function DisplayNameSegment (){

    const {replace} = useRouter();
    const {pushNotification} = useNotification();
    const {effectiveTheme} = useColorContext();
    const {displayName, username, updateAuth} = useAuthContext();
    const [changesMade, setChangesMade] = useState<boolean>(false);
    
    const inputFieldRef = useRef<HTMLInputElement>(null);

    const disabledStyle: React.CSSProperties = {
        backgroundColor: effectiveTheme==='light'?
        "rgba(90, 88, 109, 1)":"rgba(42, 42, 54, 1)",
        color: "rgba(170, 170, 170, 1)"
    }
    const onClick = async ()=>{
        if(!displayName || !username) {
            pushNotification("User details invalid",{
                color:'red'
            });
            return;
        }
        if(!inputFieldRef.current) {
            pushNotification("Something went wrong!",{
                color:'red'
            });
            return;
        }
        let updateRes:Status|undefined; 
        
        // Updating in DB
        updateRes = await appfetch<Status, ReqDataType['update-user-details']>(
            "/api/update-user-details",{
            username: username,
            fields:{
                displayName: inputFieldRef.current.value
            }
        })

        if(!updateRes || !updateRes.status) {
            pushNotification(updateRes?.error || updateRes?.message || "Update Failed!",{
                color:'red'
            });
            return;
        }

        pushNotification("Display name updated!",{
            color:'green'
        });

        // Update the cache
        updateAuth({force: true});
        replace("../")
}
    return <>
    <TextField label={"Display name"}
    type={"text"} defaultValue={displayName||""}
    onChange={(e: React.ChangeEvent<HTMLInputElement>)=>
        setChangesMade(prev=>{
            const isSame = e.target.value === displayName;
            if(prev === !isSame) return prev;
            return !isSame;
        })
    } ref={inputFieldRef}/>

    <Button onClick={onClick} showLoading style={{
        width:"fit-content", alignSelf:'center',
        margin:'14px 0', backgroundColor:'rgba(86, 85, 185, 1)',
        color:"rgba(255, 255, 255, 0.8)"
    }} disabled={!changesMade} disabledStyle={disabledStyle}
    >Update Display Name</Button>
    
    </>
}