"use client";

import { ProfileActionsIcon, UserIcon } from "@/components/icons/Icons";
import globalStyle from "../global.module.css"
import { useColorContext } from "@/context/colorScheme";
import ModuleClassname from "@/lib/cssUtil";
import NextImage from "next/image";

import { useAuthContext } from "@/context/authContext";
import HideIf from "@/components/HideIf";
import FullPagePopUp from "@/components/popup/FullPagePopup";
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { CroppingContainer } from "./ProfileComponents";
import { FullPagePrompt, Hr, PromptHeading, PromptParagraph, SettingsField } from '../Components'
import { appfetch } from "@/lib/fetchReq";
import { ReqDataType } from "@/lib/apiReqDataType";
import Button from "@/components/buttons/NewButton";
import UserProfilePicture from "@/components/misc/UserProfilePicture";

/* Types */

// Image Details [ for selected image/file ]
type ImageDetails = {
    width: null|number;
    height: null|number;
    file: null|File;
    url: null|string;
}

// File Selection Popup/Prompt Props
type FileSelectPopupProps= {
    show: boolean, toggleShow: Dispatch<SetStateAction<boolean>>,
    // For Image Details
    imageDetails: ImageDetails, setImageDetails: Dispatch<SetStateAction<ImageDetails>>,
    // Upload Image function
    addImageOnClick: ()=> Promise<any>
    // References
    ref: {
        imageContainerRef : RefObject<HTMLDivElement|null>;
        cropBoxRef : RefObject<HTMLDivElement|null>;
    }
}

// For getting element's colors
const getColor = (index: number, effectiveTheme: 'light'|'dark')=>{
    const colors = [
        // For User Icon
        {light: 'rgba(238, 236, 255, 1)', dark: 'rgba(197, 198, 255, 1)'},
        // For File Select
        {light: 'rgba(205, 210, 255, 0.7)', dark: 'rgba(35, 35, 59, 0.7)'},
    ]
    if(index>=colors.length) return;
    return colors[index][effectiveTheme]
}

// Main Component [ Page ]
export default function PageClient () {
    const {updateAuth, username, displayName, email} = useAuthContext();

    // -> Popup toggles
    const [showFileSelect, setShowFileSelect] = useState<boolean>(false);
    const [showDeletePrompt, setShowDeletePrompt] = useState<boolean>(false);
    
    // -> File Upload Pop-up > Crop Overlay Refs
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const cropBoxRef = useRef<HTMLDivElement>(null);

    // -> File Upload Pop-up > Image Details [null => no image selected]
    const [imageDetails, setImageDetails] = useState<ImageDetails>({
        file: null, width: null, height: null, url: null
    })

    // Upload image onClick
    const addImageOnClick = async() =>{
        // -> Return if No file is found
        if(!imageDetails.file || !imageDetails.width || !imageDetails.height) {
            alert("Couldn't handle the file!"); return;
        }
        
        const dimensions = updateCropDimension(imageDetails, imageContainerRef, cropBoxRef);
        if(!dimensions) { alert("Couldn't crop the image!"); return;}

        const data = new FormData();
        data.append('file',imageDetails.file);
        data.append('top', dimensions.top.toString()||'0')
        data.append('left', dimensions.left.toString()||'0')
        data.append('width', dimensions.width.toString()|| imageDetails.width.toString())
        data.append('height', dimensions.height.toString()|| imageDetails.height.toString())

        try{
            let response = await appfetch<
                Status,
                ReqDataType['upload']['add-profile-picture']
            >('/api/upload/add-profile-picture',data)

            if(!response || !response.status){
                alert("Couldn't upload file!")
                return;
            }
            
            // Updates Auth + cache
            updateAuth({force: true});
            // Closes File Sectect Pop-up
            setShowFileSelect(false);
            // Resets Image Details to {null, null, null, null}
            resetImageDetails(imageDetails, setImageDetails);
        } catch (e:any) {
            console.log(e.message)
        }
    }

    // Delete image onClick
    const deleteImageOnClick = async() =>{
        let res:Status|undefined;
                
        try{
            // Deleting Cloudinary Image
            res = await appfetch("/api/upload/del-profile-picture");
            
            // if Deletion failed
            if(!res || !res.status) {
                alert("Couldnt delete your picture");
                return;
            }

            // Updating Token
            // let tokenRes = await appfetch<status,ReqDataType['jwt']['update']>("/api/jwt/update",{
            //     cookieName: 'AUTH_TOKEN',
            //     token: undefined,
            //     updateFields: {
            //         profilePicture: null
            //     }
            // })
            // if(!tokenRes.status) {
            //     alert("Couldnt modify the token");
            //     return;
            // }
            
            // Updates Cache
            updateAuth({force:true});
            setShowDeletePrompt(false);

        }catch(e:any){
            console.error(e);
            return;
        }        
    }

    return <>
    <title>Profile</title>
    
    <ProfilePicture
        toggleFileSelectPopup={setShowFileSelect}
        toggleDeletePopup={setShowDeletePrompt}
    />
    
    <SettingsField // For Display Name
        label={"Display name"} type={"text"} showEditButton
        value={displayName||''} href="profile/update?edit=display-name"
    />
    <Hr/>
    <SettingsField // For Username
        label={"Username"} type={"text"}
        value={username||''}
    />
    <Hr/>
    <SettingsField // For Email
        label={"Email"} type={"email"} showEditButton
        value={email||''} href="profile/update?edit=email"
    />

    <FileSelectPopup
        // show + toggle
        show={showFileSelect} toggleShow={setShowFileSelect}
        // upload image onclick
        addImageOnClick = {addImageOnClick}
        // image details
        imageDetails={imageDetails} setImageDetails={setImageDetails}
        // ref for crop overlay
        ref={{imageContainerRef, cropBoxRef}}
    />
    <DeletePrompt
        // show + toggle
        show={showDeletePrompt} toggleShow={setShowDeletePrompt}
        // delete image onclick
        onClick={deleteImageOnClick}
    />
    </>
}

// Profile Picture Deletion Prompt
const DeletePrompt = ({show, toggleShow, onClick}:{
    show: boolean, toggleShow: Dispatch<SetStateAction<boolean>>,
    onClick: ()=> Promise<any>
})=>{
    const {effectiveTheme} = useColorContext();
    const buttonStyle = {
        width:'40%', margin:'15px auto 0 auto',
        backgroundColor:'rgba(196, 74, 74, 1)', color:"white"
    }
    return <>
    <FullPagePrompt show={show} toggleShow={toggleShow}
        backgroundColor={getColor(1, effectiveTheme)}
    >   
        <PromptHeading style={{alignSelf:'center'}}>
            Delete?
        </PromptHeading>
        <PromptParagraph style={{margin:'10px 0'}}>
            Do you want to remove your Profile picture?<br/>
            This action can&apos;t be <span style={{fontWeight:800}}>UNDONE</span> !
        </PromptParagraph>
        <Button style={buttonStyle} onClick={onClick} showLoading
            loadingStyle={{backgroundColor:'rgba(145, 55, 55, 1)'}}
        >Delete</Button>
        
    </FullPagePrompt>
    </> 
}

/* Profile Picture Change Section */
const ProfilePicture = ({toggleFileSelectPopup, toggleDeletePopup}:{
    toggleFileSelectPopup: Dispatch<SetStateAction<boolean>>,
    toggleDeletePopup: Dispatch<SetStateAction<boolean>>,
})=>{
    const css = new ModuleClassname(globalStyle);
    const {effectiveTheme} = useColorContext();
    const { profilePicture, username, displayName, verified } = useAuthContext();

    return <>
    <div className={css.names(`profile section-one ${effectiveTheme}`)}>
        <div className={globalStyle['picture-container']}>
            <UserIcon fill={getColor(0,effectiveTheme)} hidden={ !!profilePicture }/>
            <HideIf hideIf={ !profilePicture || !verified }>
            
            <UserProfilePicture width={500} height={500}
            alt={displayName||'UNKNOWN'} className={globalStyle['picture']}
            username={username} profilePicture={profilePicture}
            draggable={false}
            />
            </HideIf>
        </div>
        <div className={css.names(`actions`)}>
            <ActionButtons mode={!profilePicture?'add':'update'}
                effectiveTheme={effectiveTheme}
                onClick={()=> toggleFileSelectPopup(prev => !prev)}
            />
            <ActionButtons mode={"delete"} effectiveTheme={effectiveTheme}
                onClick={()=> toggleDeletePopup(prev => !prev)}
                // Hides if there is no profile picture to delete
                hidden={!profilePicture}
            />
        </div>
    </div>
    </>
}

// Profile Picture Action buttons
const ActionButtons = ({mode, hidden, effectiveTheme, onClick}:{
    mode: 'add'|'delete'|'update',
    effectiveTheme: 'light'|'dark',
    hidden?: boolean,
    onClick?: ()=> Promise<any>|any
})=>{
    const css = new ModuleClassname(globalStyle);
    const colors = {
        add: { light: 'rgba(21, 136, 82, 1)', dark: 'rgba(109, 197, 163, 1)' },
        delete: { light: 'rgba(185, 62, 62, 1)', dark: 'rgba(241, 128, 128, 1)' },
        update: { light: 'rgba(62, 79, 175, 1)', dark: 'rgba(110, 142, 231, 1)' },
    }
    return hidden? null :
    <Button style={{display:'flex', alignItems:'center', gap:'5px'}}
    onClick={async () => {
        if (onClick) await onClick();
    }}>
        <ProfileActionsIcon mode={mode} fill={colors[mode][effectiveTheme]}/>
        <h4>{mode.charAt(0).toUpperCase()+mode.slice(1)}</h4>
    </Button>
}


/* Profile Picture File Select Overlay */
const FileSelectPopup = ({
    show, toggleShow,
    imageDetails, setImageDetails,
    addImageOnClick,
    ref
}:FileSelectPopupProps)=>{
    const {profilePicture} = useAuthContext();
    const {effectiveTheme} = useColorContext();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // -> Container(Image Preview + Crop box) Reference
    const imageContainerRef = ref.imageContainerRef;
    // -> Crop Box Reference
    const cropBoxRef = ref.cropBoxRef;

    const [imageKey, setImageKey] = useState<number>(Date.now());

    // -> Select File button onClick
    const selectFile = ()=>{
        if(!fileInputRef.current) return;
        fileInputRef.current.click();
    }

    // Prevents Scrolling when Popup is ON
    // Really usefull for mobile devices
    useEffect(()=>{
        //const prev = document.body.style.overflow;
        const scrollbarWidth =
            window.innerWidth - document.documentElement.clientWidth;

        if (show) {
            document.body.style.overflow = "hidden";
            //document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
        else {
            document.body.style.overflow = "";
            //document.body.style.paddingRight = "";
        }
        return ()=>{
            document.body.style.overflow = "";
            //document.body.style.paddingRight = "";
        }
    },[show])

    // -> When File Loads
    const onFileChange = ()=>{
        if(!fileInputRef.current || !fileInputRef.current.files) return;
        const file = fileInputRef.current.files[0];
        
        if (
            !file.type.startsWith("image/")|| !file
        ){
            alert(" Please Select an Image!");
            resetImageDetails(imageDetails, setImageDetails);
            return;
        }

        const url = URL.createObjectURL(file)
        const img = new Image();
        img.src = url;

        img.onload = ()=>{
            setImageDetails({
                width: img.width, height: img.height,
                file: file, url: url
            })
        }
        img.onerror = ()=>{
            alert("Couldn't load image!");
            resetImageDetails(imageDetails, setImageDetails);
        }
        setImageKey(Date.now()) // it resets the selected file
    }

    return <FullPagePopUp show={show} toggleShow={toggleShow}
        hideFromDom // Removes from DOM when its not shown   
        // Cleanup before closing
        cleanUp={()=> resetImageDetails(imageDetails, setImageDetails)}
        // Main box style
        boxStyle={{ backgroundColor: getColor(1,effectiveTheme),
            boxShadow:"0 0 20px -4px rgba(0, 0, 0, 0.5)",
        }}>
        
        <input onChange={onFileChange} // Hidden File Select
            type='file' key={imageKey} hidden ref={fileInputRef}
            accept=".png,.jpg,.jpeg"
        />

        <h1 style={{fontSize: '1.5rem'}}>Select File</h1>
        <div className={globalStyle['image-container']}>
            
            <PopUpButtons onClick={selectFile} hidden={!!imageDetails.url}
                backgroundColor="rgba(91, 90, 170, 1)"
            >Select image</PopUpButtons>

            <CroppingContainer // Cropping Element
                // image url
                imageUrl={imageDetails.url}
                // Div references [imp]
                containerRef={imageContainerRef} cropBoxRef={cropBoxRef}
                // Dimensions of the image/file
                width={imageDetails.width} height={imageDetails.height}
            />

        </div>
        <div style={{marginLeft:'auto', display:'flex', gap:"5px"}}>
            
            <PopUpButtons onClick={addImageOnClick} hidden={!imageDetails.url}
                showLoading backgroundColor="rgba(52, 145, 83, 1)"          
            >{!profilePicture?"Add":"Update"}</PopUpButtons>

            <PopUpButtons onClick={()=>{
                resetImageDetails(imageDetails, setImageDetails);
                selectFile();
            }} backgroundColor="rgba(59, 130, 163, 1)" hidden={!imageDetails.url}        
            >Repick</PopUpButtons>

            <PopUpButtons onClick={()=>{
                resetImageDetails(imageDetails, setImageDetails);
                toggleShow(false);
            }} backgroundColor="rgba(194, 102, 60, 1)"       
            >Cancel</PopUpButtons>
        </div>
    </FullPagePopUp>
}

const PopUpButtons = ({onClick,children, showLoading,backgroundColor, hidden}:{
    children: React.ReactNode,
    backgroundColor?: string,
    hidden?: boolean, showLoading?:boolean,
    onClick: ()=> Promise<any>|any
})=>{
    return <Button style={{
        backgroundColor: backgroundColor||'',
        fontSize:'0.9rem', color:'rgba(255, 255, 255, 0.75)'
    }}
        hidden={hidden||false}
        onClick={onClick} showLoading={showLoading||false}
    >
        {children}
    </Button>
}
/* Utils */

// -> For getting crop details
const updateCropDimension = (
    imageDetails: ImageDetails,
    imageContainerRef: RefObject<HTMLDivElement|null>,
    cropBoxRef: RefObject<HTMLDivElement|null>,
)=> {
    if(
        !cropBoxRef.current ||      // -> cropBoxRef: child
        !imageContainerRef.current  // -> imageContainerRef: parent
    ) return;

    const mainRect = getRect(cropBoxRef.current)
    const parentRect = getRect(imageContainerRef.current)

    if(!imageDetails.width || !imageDetails.height) return;
    let ratioX = imageDetails.width/parentRect.width;
    let ratioY = imageDetails.height/parentRect.height;

    ratioX = Number(ratioX.toFixed(6));
    ratioY = Number(ratioY.toFixed(6));

    let top = (mainRect.top - parentRect.top)*ratioY || 0;
    let left = (mainRect.left - parentRect.left)*ratioX || 0;
    let width = mainRect.width * ratioX;
    let height = mainRect.height * ratioY;
    
    // getting the proper int pixel values
    top = Math.max(0, Math.round(top))
    left = Math.max(0, Math.round(left))
    width = Math.min(imageDetails.width, Math.round(width))
    height = Math.min(imageDetails.height, Math.round(height))

    // if the any of the numbers are NaN
    if(
        Number.isNaN(top)||Number.isNaN(left)||
        Number.isNaN(width)||Number.isNaN(height)
    ) return;
    
    return {top, left, width, height}
}

// -> for getting Client div Box details
const getRect = (rect:HTMLDivElement)=>{
    let box = rect.getBoundingClientRect();
    return {
        left: box.left, top: box.top, right: box.right, bottom:box.bottom,
        width: box.width, height: box.height,
        centerX: box.x+box.width/2, centerY: box.y+box.height/2
    }
}

// -> For resetting ImageDetails
const resetImageDetails = (
    imageDetails: ImageDetails,
    setImageDetails: Dispatch<SetStateAction<ImageDetails>>
)=>{
    if (imageDetails.url) URL.revokeObjectURL(imageDetails.url);
    setImageDetails({ file: null, width: null, height: null, url: null});
}

const delay = (time: number)=> new Promise(res => setTimeout(res, time))