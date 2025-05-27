'use client';

import './style.css'
import { colorScheme, useColorContext } from "@/context/colorScheme";
import { useUserDetailsContext } from "@/context/userDetailsContext";
import ApiLinks from "@/lib/apiLinks";
import { post } from "@/lib/fetchReq";
import React, {
    ChangeEvent,CSSProperties,Dispatch,JSX,
    SetStateAction,useEffect,useRef,useState
} from "react";
import Image from "next/image";
import {getCookie} from "@/lib/cookies";
import {status} from "@/types/statusType";

export default function Profile() {
    const {username, displayName, email, profilePicture, updateUserDetails} = useUserDetailsContext()
    const {accentColor, effectiveTheme} = useColorContext();
    const [pageWidth,setPageWidth] = useState<number>(0);

    const [pageDisplayName, setPageDisplayName] = useState(displayName)
    const [showPicActions, setShowPicActions] = useState<boolean>(false);
    const [showFileSelector, setShowFileSelector] = useState<boolean>(false);

    const picLink = `https://res.cloudinary.com/${ process.env.NEXT_PUBLIC_CLD_NAME }/image/upload/c_fill,ar_1:1/v${profilePicture}/WeLearn/profile-picture/${username}`
    // Update the display name if not rendered at first
    useEffect(()=>{setPageDisplayName(displayName)},[displayName])

    // Screen Width event-list.
    useEffect(()=>{
        const updateWidth = ()=>{
            setPageWidth(window.innerWidth)
        }

        updateWidth();

        window.addEventListener("resize", updateWidth);
        return () => {
            window.removeEventListener("resize", updateWidth);
        }
    },[])

    //Page Elements
    const elements = {
        displayName : useRef<HTMLInputElement|null>(null),
        file: useRef<HTMLInputElement|null>(null)
    }
    
    const colors = {
        red: ['rgb(255, 202, 202)','rgb(236, 148, 148)','rgb(241, 132, 132)'],
        green: ['rgb(177, 235, 171)','rgb(131, 194, 124)','rgb(115, 180, 108)'],
        blue: ['rgb(183, 217, 248)','rgb(125, 172, 216)', 'rgb(108, 157, 202)']
    }

    //For fields blur and hover effect
    const fieldsHandler = {
        onFocus: (e: React.FocusEvent)=>{
            const element = e.target as HTMLInputElement
            let color = effectiveTheme==='light'?colors[accentColor][1]:'rgba(255, 255, 255, 0.41)'
            element.style.boxShadow = `0px 0px 0px 2px ${color}`
        },
        onBlur: (e: React.FocusEvent)=>{
            const element = e.target as HTMLInputElement
            element.style.boxShadow = `none`
        },
    }

    // Button actions
    const onClick = {
        displayName:{
            saveChanges: async ()=>{
                const name = elements.displayName.current
            
                if(!name) return

                const res = await post(ApiLinks.updateUserDetails.this,{
                    username: username,
                    fields: {
                        displayName: pageDisplayName
                    }
                })

                if(!res.status) return
                updateUserDetails();
            }
        }
    }

    // Field styles
    const styles:{ [keys in any]: CSSProperties} ={
        editableField :{
            backgroundColor: effectiveTheme==='light'? colors[accentColor][0]:'rgba(255, 255, 255, 0.14)',
            color: effectiveTheme==='light'? 'rgba(0, 0, 0, 0.7)':'rgb(255, 255, 255)'
        },
        disabledFields: {
            backgroundColor: effectiveTheme==='light'?'rgba(0, 0, 0, 0.1)': 'rgba(255, 255, 255, 0.14)',
            color: effectiveTheme==='light'? 'rgba(0, 0, 0, 0.4)':'rgba(255, 255, 255, 0.4)'
        }
    }

    const removeOnClick = async ()=>{
        let res: Response|status;
        let token = getCookie("authToken").cookie;

        if(!token){
            console.error('No token Found!')
            return;
        }
        try{
            res = await fetch("/api/upload/del-profile-picture",{
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            res = (await res.json()) as status;
        }catch(e:any){
            console.error(e);
            return;
        }

        if(res.status){
            updateUserDetails();
        }
    }
    return(
        <>
            <FileChoseOption show={showFileSelector} setShow={setShowFileSelector} />
            <div className="settings-content-pages">

                <div className="display-picture"
                     style={{
                         backgroundColor: effectiveTheme==='light'? colors[accentColor][0]:'rgba(255, 255, 255, 0.2)',
                         border:`${pageWidth<=400?10:20}px solid ${effectiveTheme==='light'?colors[accentColor][2]:colors[accentColor][1]}`
                     }}
                     onMouseEnter={()=>{setShowPicActions(true)}}
                     onMouseLeave={()=>{setShowPicActions(false)}}
                >
                    <svg width={700} height={700} viewBox="0 0 700 700">
                        <g
                            style={{
                                display: "inline",
                                fill: "#fff",
                                fillOpacity: 1,
                            }}
                            transform="matrix(1.37944 0 0 1.37944 -132.88 -138.959)"
                        >
                            <path
                                d="M144.877 485.9A246.916 246.916 0 0 0 350 596.916a246.916 246.916 0 0 0 205.639-111.754A245.967 264.01 0 0 0 350 365.99 245.967 264.01 0 0 0 144.877 485.9Z"
                                style={{
                                    fill: "#fff",
                                    fillOpacity: 0.998148,
                                    strokeWidth: 0,
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    paintOrder: "markers fill stroke",
                                }}
                            />
                            <circle
                                cx={350}
                                cy={238}
                                r={93.068}
                                style={{
                                    fill: "#fff",
                                    fillOpacity: 0.998148,
                                    stroke: "none",
                                    strokeWidth: 0,
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeDasharray: "none",
                                    strokeOpacity: 1,
                                    paintOrder: "markers fill stroke",
                                }}
                            />
                        </g>
                    </svg>
                    {
                    !profilePicture? null :
                    <Image src={picLink} alt={'profile-picture'}
                        width={400} height={400}
                        style={{
                            width: '107%',
                            height:'auto'
                        }}
                    />
                    }
                    
                    
                    <ActionsOverlay
                        show={showPicActions}
                        pictureAvailable={!!profilePicture}
                        setShowSelector={setShowFileSelector}
                        removeOnCLick={removeOnClick}
                    />
                </div>

                <div className="field">

                    <label>Display Name</label>
                    <div>
                        <input type="text" value={pageDisplayName||''}
                               ref={elements.displayName}
                               style={styles.editableField}
                               onFocus={fieldsHandler.onFocus}
                               onBlur={fieldsHandler.onBlur}
                               onChange={(e:ChangeEvent<HTMLInputElement>)=>{
                                   setPageDisplayName(e.target.value)
                               }}
                        />
                        <button hidden={pageDisplayName===displayName}
                                style={{
                                    backgroundColor: colorScheme.sidebar[accentColor].active[effectiveTheme]
                                }}
                                onClick={onClick.displayName.saveChanges}
                        >Save Changes</button>
                    </div>

                </div>
                <div className="field">
                    <label>Username</label>
                    <div>
                        <input type="text" value={username||''} disabled style={styles.disabledFields}/>
                    </div>
                </div>
                <div className="field">
                    <label>Email</label>
                    <div>
                        <input type="text" value={email||''} disabled style={styles.disabledFields}/>
                    </div>
                </div>
            </div>
        </>

    )
}
const delay =(time:number)=> new Promise(resolve => setTimeout(resolve, time))

const  ActionsOverlay = ({show ,pictureAvailable, setShowSelector, removeOnCLick}:{
    show: boolean;
    pictureAvailable: boolean;
    setShowSelector: Dispatch<SetStateAction<boolean>>;
    removeOnCLick: ()=> void
})=>{
    const mainElement = useRef<HTMLDivElement>(null)

    //For handling the hover on/off effect
    useEffect(() => {
        const handle = async ()=>{
            const main = mainElement.current
            if(!main) return;

            if(show){
                main.style.display="flex";
                await delay(20)
                main.style.opacity='1';
            }else{
                main.style.opacity='0';
                await delay(200);
                main.style.display="none";
            }
        }
        handle().then(r => null).catch(e=> null)
    }, [show]);

    return(
        <div ref={mainElement} style={{
            position:'absolute', left:'50%',top:'50%', borderRadius:'50%',
            width:'100%',height:'100%', translate:'-50% -50%',
            display:'flex', opacity:0, justifyContent:'center',
            alignItems:'center', gap:'5px', transition: 'opacity 0.2s ease',
            backdropFilter:'blur(20px)', background:'rgba(0,0,0,0.4)'
        }} className='actions'/* Picture Controls */>
            <ActionBtn type={"Add"} pictureAvailable={pictureAvailable} onCLick={()=> setShowSelector(true)}/>
            <ActionBtn type={'Update'} pictureAvailable={pictureAvailable} onCLick={()=> setShowSelector(true)}/>
            <ActionBtn type={'Remove'} pictureAvailable={pictureAvailable} onCLick={removeOnCLick}/>
        </div>
    )
}
const ActionBtn = ({width,type,pictureAvailable,onCLick}:{
    width?: number,
    type:'Add'|'Remove'|'Update',
    pictureAvailable: boolean,
    onCLick: ()=>void
}) =>{
    const mainElement = useRef<HTMLDivElement>(null)
    const hoverEffect = (mode: 'on'|'off') => {
        const main = mainElement.current
        if(!main) return;

        if(mode === 'on'){
            main.style.backgroundColor='rgba(255,255,255,0.1)';
        }else{
            main.style.backgroundColor='';
        }
    }
    const variableIcon = {
        add: (
            <path
                d="M35.66 25H14.34M25 14.34v21.32M44.943 25A19.943 19.943 0 0 1 25 44.943 19.943 19.943 0 0 1 5.057 25 19.943 19.943 0 0 1 25 5.057 19.943 19.943 0 0 1 44.943 25Z"
                style={{
                    display: "inline",
                    fill: "none",
                    fillOpacity: 1,
                    strokeWidth: 6,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: "none",
                    paintOrder: "markers fill stroke",
                }}
            />
        ),
        remove: (
            <path
                d="M32.538 32.538 17.462 17.462m15.076 0L17.462 32.538M44.943 25A19.943 19.943 0 0 1 25 44.943 19.943 19.943 0 0 1 5.057 25 19.943 19.943 0 0 1 25 5.057 19.943 19.943 0 0 1 44.943 25Z"
                style={{
                    display: "inline",
                    fill: "none",
                    fillOpacity: 1,
                    strokeWidth: 6,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: "none",
                    paintOrder: "markers fill stroke",
                }}
            />
        ),
        update: (
            <path
                d="M18.2 32.13s4.85-4.34 5.677-4.591c.754-.23 1.534-.297 2.365 0 .83.296 5.557 4.592 5.557 4.592M13.5 25s6.293-5.632 8.585-6.594c2.29-.961 3.391-1.002 5.712 0C30.117 19.41 36.5 25 36.5 25m8.443 0A19.943 19.943 0 0 1 25 44.943 19.943 19.943 0 0 1 5.057 25 19.943 19.943 0 0 1 25 5.057 19.943 19.943 0 0 1 44.943 25Z"
                style={{
                    fill: "none",
                    fillOpacity: 1,
                    strokeWidth: 5,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: "none",
                    paintOrder: "markers fill stroke",
                }}
            />
        )
    }

    const main = (
        <div style={{
            width: window.innerWidth<=710? '35%':'25%',
            padding:'10px 0px',
            display: 'flex',flexDirection: 'column',
            borderRadius:'15px',
            cursor:'default',
        }}  onMouseEnter={()=>{hoverEffect('on')}}
            onMouseLeave={()=>{hoverEffect('off')}}
            onClick={onCLick}
            ref={mainElement}
        >
            <svg width={width||30} height={width||30} viewBox='0 0 50 50'
                 style={{
                     width:`${width||30}px`,
                     stroke: type==='Add'?'#86e071':type==='Update'? '#71b2e8':'#e77474',
                 }}
            >
                <g
                    style={{
                        display: "block",
                    }}
                >
                    {variableIcon[type.charAt(0).toLowerCase()+ type.slice(1) as 'add'|'remove'|'update']}
                </g>
            </svg>
            <h5 style={{color:'rgb(255,255,255)',marginTop:'7px',textAlign:'center'}}>{type}</h5>
        </div>
    )
    return pictureAvailable? type==='Add'? null:main : type==='Add'? main:null
}

type CropDimensions = {
    top: number; left: number; width: number; height: number;
}
const FileChoseOption = ({show,setShow}:{
    show:boolean,
    setShow: Dispatch<SetStateAction<boolean>>,
}):JSX.Element|null=>{
    const {updateUserDetails} = useUserDetailsContext()
    const {effectiveTheme} = useColorContext();
    const [isWorking, setIsWorking] = useState<boolean>(false);
    const [popupText, setPopupText] = useState<'Updating ...'|"Couldn't Upload"|"Changes Saved">("Updating ...");
    const main = useRef<HTMLDivElement>(null)
    const dialog = useRef<HTMLDivElement>(null)
    const hiddenFileSelector = useRef<HTMLInputElement>(null);
    const [cropDimensions, setCropDimensions] = useState<CropDimensions|null>(null);

    const [img, setImg] = useState<{
        image: File, url: string, style: 'square'|'portrait'|'landscape',
        width: number, height: number
    }|null>(null);

    // Uploading Function
    const setImage = async ()=>{
        const authCookie = getCookie('authToken').cookie;
        if(img === null || cropDimensions === null || !authCookie) return;

        const data = new FormData();
        data.append('file',img.image)
        data.append('top', cropDimensions.top.toString()||'0')
        data.append('left', cropDimensions.left.toString()||'0')
        data.append('width', cropDimensions.width.toString()|| img.width.toString())
        data.append('height', cropDimensions.height.toString()|| img.height.toString())

        try{
            setPopupText('Updating ...')
            setIsWorking(true);
            let response:Response|status = await fetch('/api/upload/profile-picture',{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authCookie}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: data,
            })
            response = (await response.json()) as status;
            //console.log(response)

            if(response.status){
                updateUserDetails();
                setPopupText("Changes Saved");
                await delay(1000);
                setIsWorking(false);
                setShow(false);
                setImg(null);
            }else{
                setPopupText("Couldn't Upload");
                await delay(1000);
                setIsWorking(false);
            }
        } catch (e:any) {
            console.log(e.message)
        }
    }

    const handleFileChange = () => {
        const file = hiddenFileSelector.current

        const reader = new FileReader();
        if(!file) return; if(file.files===null) return;
        reader.onload= (event) => {
            const image = new window.Image()
            let imageStyle : 'square'|'portrait'|'landscape'|null = null;
            let imageWidth : number|null = null;
            let imageHeight : number|null = null;

            image.src = event.target?.result as string;

            image.onload = () => {
                imageStyle = (
                    image.width>image.height? 'landscape':
                        image.width === image.height? 'square':'portrait'
                )
                imageWidth = image.width; imageHeight = image.height;

                if(file.files === null) return;
                setImg({
                    image: file.files[0],
                    url: URL.createObjectURL(file.files[0]),
                    style: imageStyle ||'square',
                    width: imageWidth, height: imageHeight
                })
            }

        }
        if(file.files[0]){
            reader.readAsDataURL(file.files[0])
        }

    }

    // Outside click handler
    useEffect(()=>{
        const handleOutsideClick = (e:globalThis.MouseEvent)=>{
            if(show && !dialog.current?.contains(e.target as Node)) {
                setShow(false); setImg(null);
            }
        }
        document.addEventListener('click',handleOutsideClick);
        return ()=>{
            document.removeEventListener('click',handleOutsideClick);
        }
    },[show, setShow])

    const styleImage:CSSProperties ={
        height:img?.style==='landscape'?'auto':'100%',
        width:img?.style==='landscape'?'100%':'auto',
        maxWidth: window.innerWidth<=400 && (img?.style!=='landscape')?'80dvw':'',
        borderRadius:'20px', objectFit:'contain'
    }
    const styleImageMobile:CSSProperties = {
        height:img?.style==='landscape'?'auto':'100%',
        width:img?.style==='landscape'?'100%':'auto',
        maxWidth:'80dvw',
        borderRadius:'20px', objectFit:'contain'
    }
    const styleImageContainer:CSSProperties = {
        display:"flex",backgroundColor:'rgba(138, 208, 115, 0.0)',
        height:'auto',width:'auto',
        maxHeight:'100%',position:'relative',overflow:'hidden',
    }

    const styleSelectImage:CSSProperties = {
        border: 'none', padding:'5px 15px', borderRadius:'15px',
        backgroundColor:'rgb(104,123,231)', color:'white'
    }


    return !show? null:
        <div className={'file-chose'} ref={main} /*Full Page Alert*/>
            <div className='dialog' ref={dialog} style={{
                backgroundColor: effectiveTheme==='dark'? 'rgb(54,54,54)':'',
                color:effectiveTheme==='dark'?'rgb(232,232,232)':"",
            }}
            >
                <input // Hidden input field
                    type={"file"} style={{display:'none'}}
                    ref={hiddenFileSelector} onChange={handleFileChange}
                />
                <h3>Chose File</h3>
                <div style={{margin:'15px 0px', position:'relative'}}>
                    {!img?null:
                        <div style={styleImageContainer}>
                            <Image
                                src={img.url} alt={'selected'}
                                width={200} height={200}
                                style={styleImage}
                                className={'profile-image'}
                            />
                            <CropOverlay img={{
                                style: img.style,
                                width: img.width,
                                height: img.height,
                            }} setCropDimensions={setCropDimensions}/>
                            <h2 style={{
                                position:'absolute', borderRadius:'15px',
                                bottom:'10%', left:'50%', fontSize:'1rem',
                                padding:'10px 15px', backgroundColor:'rgb(104,123,231)',
                                color:'white', display: isWorking?'block':'none',
                                transform: 'translateX(-50%)',boxShadow:'1px 1px 10px rgb(0,0,0)',
                                width:'fit-content'
                            }}>
                                {popupText}
                            </h2>
                        </div>
                    }
                    <button
                        hidden={img!==null}
                        onClick={()=> {
                            if (hiddenFileSelector.current) {
                                hiddenFileSelector.current.click()
                            }
                        }} style={styleSelectImage}
                    >Select File</button>
                </div>
                <div>
                    <button
                        onClick={setImage}
                    >Set</button>
                    <button onClick={()=>{setImg(null)}}>Remove</button>
                    <button onClick={()=> {
                        setImg(null); setShow(false)
                    }} >Cancel</button>
                </div>
            </div>

        </div>
}
/**
 * For CLoudinary Image URL generation using
 * PublicID and optimization
 * option
 * @param publicId - Public ID of the media
 * @param folder - Folder of the Media
 * @param opts - Optimization Options like in a link (e.g. f_auto,c_fill) separated by ","
 */
const CldPicture = (
    publicId: string|null,
    folder: string|null,
    opts: string|null
):string =>{
    //const domain = `https://res.cloudinary.com/${ process.env.NEXT_PUBLIC_CLD_NAME }/image/upload/c_fill,ar_1:1,w_500/v1/Portfolio/profile-picture`
    //console.log(`https://res.cloudinary.com/${ process.env.NEXT_PUBLIC_CLD_NAME }/image/upload/${opts}/v1/${publicId}`)
    return `https://res.cloudinary.com/${ process.env.NEXT_PUBLIC_CLD_NAME }/image/upload/${opts}/v1/${folder}/${publicId}`
}

type CropOverlayType = {
    img: { style: 'landscape' | 'square' | 'portrait', width: number, height: number },
    setCropDimensions: Dispatch<SetStateAction<CropDimensions|null>>
}
const CropOverlay = ({img, setCropDimensions}: CropOverlayType)=>{

    const [size,setSize] = useState(0);
    const [boxCoordinates,setBoxCoordinates] = useState<number[]>([0,0]);

    const elementMain = useRef<HTMLDivElement>(null);
    const elementInnerCircle = useRef<HTMLDivElement>(null);
    const elementReset = useRef<HTMLDivElement>(null);

    // Better "getBoundingClientRect"
    const getRect = (rect:HTMLDivElement)=>{
        let box = rect.getBoundingClientRect();
        return {
            left: box.left, top: box.top, right: box.right, bottom:box.bottom,
            width: box.width, height: box.height,
            centerX: box.x+box.width/2, centerY: box.y+box.height/2
        }
    }
    
    const getDragDirection = (
        x:number, startX:number, y:number, startY:number
    )=>{
        if (x - startX <= 0 && y - startY <= 0){
            return 'topLeft'
        }
        else if (x - startX >= 0 && y - startY <= 0){
            return 'topRight'
        }
        else if (x - startX >= 0 && y - startY >= 0){
            return 'bottomRight'
        }
        else{
            return 'bottomLeft'
        }

    }

    const updateCropDimensions = ()=> {
        if(elementMain.current){
            const main = getRect(elementMain.current)
            const parent = getRect(elementMain.current.parentElement as HTMLDivElement)

            let ratioX = img.width/parent.width
            let ratioY = img.height/parent.height

            ratioX = Number(ratioX.toFixed(6));
            ratioY = Number(ratioY.toFixed(6));

            let top = (main?.top - parent?.top)*ratioY || 0;
            let left = (main?.left - parent?.left)*ratioX || 0;
            let width = main?.width * ratioX;
            let height = main?.height * ratioY;

            // getting the proper int pixel values
            top = Math.max(0, Math.round(top))
            left = Math.max(0, Math.round(left))
            width = Math.min(img.width, Math.round(width))
            height = Math.min(img.height, Math.round(height))

            setCropDimensions({top, left, width, height})
        }
    }

    // Update the crop dimensions on 1st render
    useEffect(() => {
        const main = elementMain.current
        if(!main) return;
        requestAnimationFrame(()=>{
            updateCropDimensions();
        })
    },[]);

    const resize = (e:React.MouseEvent | React.TouchEvent)=>{
        if(!('touches' in e)) {
            e.preventDefault()
        }
        if( !elementReset.current || !elementMain.current || !elementInnerCircle.current) return;

        const isTouch = 'touches' in e

        // Gets the rect properties
        const mainBox = getRect(elementMain.current);
        const parentBox = getRect(elementMain.current.parentElement as HTMLDivElement);

        // wont resize if u r dragging inner circle
        if(
            elementInnerCircle.current.contains(e.target as Node) ||
            elementReset.current.contains(e.target as Node)
        ) return;

        const startX = isTouch?e.touches[0].clientX:e.clientX;
        const startY = isTouch?e.touches[0].clientY:e.clientY;
        const startSize = size;

        // finds the closest edge distance
        let maxDelta = Math.min(
            mainBox.centerX - parentBox.left - mainBox.width/2,
            mainBox.centerY - parentBox.top - mainBox.height/2,
            parentBox.bottom - mainBox.centerY - mainBox.height/2,
            parentBox.right - mainBox.centerX - mainBox.height/2
        )

        const onMouseMove = (e:MouseEvent|TouchEvent) => {
            const isTouch = 'touches' in e

            const clientX = isTouch? e.touches[0].clientX: e.clientX
            const clientY = isTouch? e.touches[0].clientY: e.clientY
            let delta = 0;
            //console.log(mainProps?.top)
            const direction = getDragDirection(
               clientX, startX, clientY, startY
            )
            // left half
            if (startX < mainBox.centerX){
                // top-left Quadrant
                if (startY < mainBox.centerY) {
                    if (direction === 'bottomRight'){
                        delta = - Math.abs(Math.max(clientX-startX, clientY-startY));
                    }else {
                        delta = Math.abs(Math.max(clientX-startX, clientY-startY));
                    }
                }
                // bottom-left Quadrant
                else {
                    if (direction === 'topRight'){
                        delta = - Math.abs(Math.max(clientX-startX, clientY-startY));
                    }else {
                        delta = Math.abs(Math.max(clientX-startX, clientY-startY));
                    }
                }
            }
            // right half
            else{
                // top-right Quadrant
                if (startY < mainBox.centerY) {
                    if (direction === 'bottomLeft'){
                        delta = - Math.abs(Math.max(clientX-startX, clientY-startY));
                    }else {
                        delta = Math.abs(Math.max(clientX-startX, clientY-startY));
                    }
                }
                // bottom-right Quadrant
                else {
                    if (direction === 'topLeft'){
                        delta = - Math.abs(Math.max(clientX-startX, clientY-startY));
                    }else {
                        delta = Math.abs(Math.max(clientX-startX, clientY-startY));
                    }
                }
            }

            if(delta>=0){
                delta = Math.min(delta,maxDelta);
            }
            delta*=2;
            setSize(Math.min(0, (startSize + delta)));
        };

        const onMouseUp = () => {
            updateCropDimensions();
            window.removeEventListener('touchmove',onMouseMove);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchend', onMouseUp);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('touchmove',onMouseMove);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchend', onMouseUp);
        window.addEventListener('mouseup', onMouseUp);
        
    }
    const move = (e: React.MouseEvent|React.TouchEvent)=>{
        if(!('touches' in e)) {
            e.preventDefault()
        }
        const isTouch = 'touches' in e
        
        if(!elementMain.current || !elementReset.current) return;

        // won't move if drag reset button
        if(elementReset.current.contains(e.target as Node)) return;

        const mainBox = getRect(elementMain.current);
        const parentBox = getRect(elementMain.current.parentElement as HTMLDivElement);

        // Mouse Down Coordinate
        const start = [
            isTouch? e.touches[0].clientX: e.clientX,
            isTouch? e.touches[0].clientY: e.clientY
        ];

        // Max Value of Coordinate (wrt. the size of crop box)
        let maxX = (parentBox.width/2) - (mainBox.width/2);
        let maxY = (parentBox.height/2) - (mainBox.height/2);

        const onMouseMove = (e:MouseEvent|TouchEvent)=>{
            if(!('touches' in e)) {
                e.preventDefault()
            }
            const isTouch = 'touches' in e
            let delta = [
                isTouch?e.touches[0].clientX-start[0]:e.clientX-start[0],
                isTouch?e.touches[0].clientY-start[1]:e.clientY-start[1]
            ];

            let x = boxCoordinates[0]+delta[0];
            x = Math.abs(x)>maxX ? (x<0 ? -maxX : maxX): x
            let y = boxCoordinates[1]+delta[1];
            y = Math.abs(y)>maxY ? (y<0 ? -maxY : maxY): y

            setBoxCoordinates([x,y]);
        }

        const onMouseUp = ()=>{
            updateCropDimensions();
            window.removeEventListener('touchmove', onMouseMove);
            window.removeEventListener('mousemove',onMouseMove);
            window.removeEventListener('touchend', onMouseUp);
            window.removeEventListener('mouseup',onMouseUp);
        }
        window.addEventListener('touchmove', onMouseMove);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchend', onMouseUp);
        window.addEventListener('mouseup', onMouseUp);
    }

    return <div
        style={{
            height:img.style==='landscape'?`calc(100% + ${size}px)`:'auto',
            width:img.style==='landscape'?'auto':`calc(100% + ${size}px)`,
            aspectRatio:'1/1',display:'flex',
            position: 'absolute',
            top: '50%',left:'50%', borderRadius:'20px',
            translate:`calc(-50% + ${boxCoordinates[0]}px) calc(-50% + ${boxCoordinates[1]}px)`,
            background:'rgba(0,0,0,0.5)',
        }}
        onMouseDown={resize} onTouchStart={resize} ref={elementMain}
    >
        <div
            ref={elementInnerCircle}
            style={{
                aspectRatio:"1/1",flex:'1 1',
                borderRadius:'50%',maxWidth:'96%',height:'auto',
                backdropFilter:'brightness(200%)',alignSelf:"center",
                margin:'0 auto',border:`2px solid white`
            }} onMouseDown={move} onTouchStart={move}
        ></div>
        <div style={{
            position:'absolute', bottom: '15%', left: '15%',
            width:'30px', height:"auto", aspectRatio:'1/1',
            display:"flex", alignItems:'center',justifyContent:'center',
            borderRadius:'50%', backgroundColor:'rgba(0,0,0,0.5)',
            scale: size< -170 ? 0.8: 1
        }} onClick= {()=>{
            setSize(0); setBoxCoordinates([0,0]); updateCropDimensions();
        }} ref={elementReset}
        >
            <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                <path d="M120-120v-240h80v104l124-124 56 56-124 124h104v80H120Zm480 0v-80h104L580-324l56-56 124 124v-104h80v240H600ZM324-580 200-704v104h-80v-240h240v80H256l124 124-56 56Zm312 0-56-56 124-124H600v-80h240v240h-80v-104L636-580Z"/>
            </svg>
        </div>
    </div>
}