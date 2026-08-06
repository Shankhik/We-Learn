'use client';

import Image from "next/image";
import moduleStyle from "./ProfileComponents.module.css";
import { RefObject, useRef, useState } from "react";


export type CropDimensions = {
    top: number; left: number; width: number; height: number;
}
type Props = {
    Container: {
        imageUrl: string|null,
        width: number|null, height: number|null,
        containerRef: RefObject<HTMLDivElement|null>,
        cropBoxRef: RefObject<HTMLDivElement|null>,
    },Box:{
        isProtrait: boolean,
        parent: RefObject<HTMLDivElement|null>,
        ref: RefObject<HTMLDivElement|null>,
    }
}

// Image Preview + Crop Box container
export const CroppingContainer = ({
    imageUrl, width, height, containerRef, cropBoxRef
}:Props['Container']) => {
    const main = containerRef;
    return imageUrl && width && height? <>
    <div className={moduleStyle["cropping-container"]} ref={main}>
        
        <PreviewImage imageUrl={imageUrl} width={width} height={height}/>
        
        <Overlay parent={main} ref={cropBoxRef}
        isProtrait={height>width}/>
    
    </div>
    </> :null
}

// Crop Box Overlay
const Overlay = ({
    parent, isProtrait, ref 
}:Props['Box'])=>{
    
    const main = ref;
    const innerCicle = useRef<HTMLDivElement>(null);

    const [boxCoordinates, setBoxCoordinates] = useState<number[]>([0,0])
    const [size,setSize] = useState<number>(0);
    
    // For getting Crop box style
    const getBoxStyle = ():React.CSSProperties => ({
        ...(isProtrait !==undefined ? {
            width: isProtrait? `calc(100% + ${size}px)`:'auto',
            height:isProtrait? 'auto':`calc(100% + ${size}px)`,
        }: undefined),
        translate: `calc(-50% + ${boxCoordinates[0]}px) calc(-50% + ${boxCoordinates[1]}px)`
    })

    // For Resize Event
    const onResize = (e: React.TouchEvent | React.MouseEvent )=>{
        e.stopPropagation();

        if(!parent.current || !main.current ||!innerCicle.current) return;

        // -> wont tigger if inner circle is clicked
        if( innerCicle.current.contains(e.target as Node) ) return;

        const isTouch = 'touches' in e;

        const mainBox = getRect(main.current);
        const parentBox = getRect(parent.current);
        
        const start = {
            size: size,
            x: isTouch? e.touches[0].clientX : e.clientX,
            y: isTouch? e.touches[0].clientY : e.clientY,
        }

        let maxDelta = Math.min(
            mainBox.centerX - parentBox.left - mainBox.width/2,
            mainBox.centerY - parentBox.top - mainBox.height/2,
            parentBox.bottom - mainBox.centerY - mainBox.height/2,
            parentBox.right - mainBox.centerX - mainBox.height/2
        )

        const onMove = (e: TouchEvent | MouseEvent )=>{
            
            const isTouch = 'touches' in e;

            let delta = 0;
            
            const client = {
                x: isTouch? e.touches[0].clientX: e.clientX,
                y: isTouch? e.touches[0].clientY: e.clientY,
            }

            // -> Getting drag direction [imp]
            const direction = getDragDirection(client.x, start.x, client.y, start.y);

            // left half
            if (start.x < mainBox.centerX){
                // top-left Quadrant
                if (start.y < mainBox.centerY) {
                    if (direction === 'bottomRight')
                    delta = - Math.abs(Math.max(client.x-start.x, client.y-start.y));
                    else delta = Math.abs(Math.max(client.x-start.x, client.y-start.y));
                }
                // bottom-left Quadrant
                else {
                    if (direction === 'topRight')
                    delta = - Math.abs(Math.max(client.x-start.x, client.y-start.y));
                    else delta = Math.abs(Math.max(client.x-start.x, client.y-start.y));   
                }
            }
            // right half
            else{
                // top-right Quadrant
                if (start.y < mainBox.centerY) {
                    if (direction === 'bottomLeft')
                    delta = - Math.abs(Math.max(client.x-start.x, client.y-start.y));
                    else delta = Math.abs(Math.max(client.x-start.x, client.y-start.y))
                }
                // bottom-right Quadrant
                else {
                    if (direction === 'topLeft')
                    delta = - Math.abs(Math.max(client.x-start.x, client.y-start.y));
                    else delta = Math.abs(Math.max(client.x-start.x, client.y-start.y));
                }
            }

            if(delta>=0){
                delta = Math.min(delta,maxDelta);
            }
            delta*=2;
            setSize(prev => {
                if( Math.min(0, (start.size + delta)) === prev) return prev
                return Math.min(0, (start.size + delta))
            });
        }

        const onUp = ()=>{
            window.removeEventListener('touchmove',onMove);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('touchend', onUp);
            window.removeEventListener('mouseup', onUp);
        }

        window.addEventListener('touchmove',onMove);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchend', onUp);
        window.addEventListener('mouseup', onUp);
    }

    // For Move Event
    const onDrag = (e: React.TouchEvent | React.MouseEvent )=>{
        e.stopPropagation();
        
        if(!parent.current || !main.current) return;

        const isTouch = 'touches' in e;

        const parentBox = getRect(parent.current);
        const overlayBox = getRect(main.current);

        const start = [
            isTouch? e.touches[0].clientX: e.clientX,
            isTouch? e.touches[0].clientY: e.clientY,
        ]
        let maxDelta = {
            x: (parentBox.width/2) - (overlayBox.width/2),
            y: (parentBox.height/2) - (overlayBox.height/2)
        }

        const onMove = (e: MouseEvent|TouchEvent) => {
            const isTouch = 'touches' in e;

            const delta = {
                x: isTouch? e.touches[0].clientX- start[0]:e.clientX- start[0],
                y: isTouch? e.touches[0].clientY- start[1]:e.clientY- start[1],
            }
            
            let x = boxCoordinates[0]+delta.x;
            let y = boxCoordinates[1]+delta.y;
            
            x = Math.abs(x)>maxDelta.x? (x<0 ? -maxDelta.x: maxDelta.x ): x
            y = Math.abs(y)>maxDelta.y? (y<0 ? -maxDelta.y: maxDelta.y ): y
            
            setBoxCoordinates(prev =>{
                // stops unnecessary re-renders
                if(prev[0]===x && prev[1]===y) return prev;
                
                return [prev[0]===x? prev[0]:x, prev[1]===y? prev[1]:y]
            })
        }
        const onUp = () => {
            window.removeEventListener('touchmove',onMove);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('touchend',onUp);
            window.removeEventListener('mouseup', onUp);
        }
        window.addEventListener('touchmove',onMove);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchend',onUp);
        window.addEventListener('mouseup', onUp);
    }

    return <>
    <div className={moduleStyle['overlay']} style={getBoxStyle()} ref={main}
        onMouseDown={onResize} onTouchStart={onResize}
    >
        <div className={moduleStyle['inner-circle']} ref={innerCicle}
            onMouseDown={onDrag} onTouchStart={onDrag}
        ></div>
    </div>
    </>
}

// Selected Image Preview
const PreviewImage = ({imageUrl, width, height}:{
    imageUrl: string|null,
    width: number, height: number
})=>{
    const rWidth = width>1000? width*0.4: width>500? width*0.8: width;
    const rHeight = rWidth/(width/height);

    return imageUrl && width && height?
    <Image src={imageUrl} alt={"Image"} width={rWidth} height={rHeight}
        draggable={false}
        className={moduleStyle[rHeight>rWidth? 'portrait':'landscape']}
    />:null
}

/* Util Functions */

// -> Getting Drag direction for resize
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
// -> For Client Rectangle dimentions
const getRect = (rect:HTMLDivElement)=>{
    let box = rect.getBoundingClientRect();
    return {
        left: box.left, top: box.top, right: box.right, bottom:box.bottom,
        width: box.width, height: box.height,
        centerX: box.x+box.width/2, centerY: box.y+box.height/2
    }
}