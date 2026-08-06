"use client";

import { useNotification } from "@/context/notification";
import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
//import WebSocket from "ws";
type UrlInput = string | (() => string);
function resolveUrl(url: UrlInput): string {
    return typeof url === "function" ? url() : url;
}

type NextWebSocket = Omit<
    WebSocket,
    "close"|"send"|
    "onopen"|"onclose"|"onerror"|"onmessage"
>
export const useWebSocket = (socketUrl: UrlInput, options?:{
    connectOnMount?:boolean,
})=>{

    const [enabled, setEnabled] = useState<boolean>(options?.connectOnMount??false);
    // First Connect
    const [initialized, setInitialized] = useState(false);
    const [readyState, setReadyState] = useState<ReturnType<typeof getReadyStatus>>("closed");
    const socket = useRef<WebSocket|null>(null);
    const url = resolveUrl(socketUrl);

    const connect = useCallback(()=> {
        socket.current = new WebSocket(url);
        setReadyState(getReadyStatus(socket));
        socket.current.onopen = (e)=>{
            setReadyState("open");
            setInitialized(true);
            setEnabled(true);
        }
        socket.current.onclose = (e)=>{
            setReadyState("closed");
            setEnabled(false);
        }
        socket.current.onerror = (e)=>{
            setReadyState(getReadyStatus(socket));
            setEnabled(false);
        }
    },[]);

    // const connect = ()=> {
    //     socket.current = new WebSocket(url);

    //     socket.current.onopen = (e)=>{
    //         setInitialized(true);
    //         setEnabled(true);
    //     }
    //     socket.current.onclose = (e)=>{
    //         setEnabled(false);
    //     }
    // }

    const disconnect = useCallback(()=>{
        if(socket.current)
            socket.current.close();
        setReadyState(getReadyStatus(socket))
        socket.current = null;
    },[]);

    // const disconnect = ()=>{
    //     if(socket.current)
    //         socket.current.close();
    //     socket.current = null;
    // }

    const send = <T extends unknown>(data: T | string | ArrayBufferLike | Blob | ArrayBufferView)=>{
        let message;
        try {
            //console.log(typeof data)
            if (
                typeof data==='string'||
                data instanceof Blob ||
                data instanceof ArrayBuffer ||
                //data instanceof SharedArrayBuffer||
                ArrayBuffer.isView(data)
            ){
                //console.log("triggered")
                message = data;
            }
            
            else if(
                typeof data==='object' ||
                typeof data === 'number'
            ){
                message = JSON.stringify(data);
            }
            
            if(!message)
                throw new Error("invalid message type")
            if(socket.current)
                socket.current.send(message as string | Blob | BufferSource);
        } catch (error:any) {
            console.log(error.message)
        }
        
    }

    useEffect(()=>{
        // Closes the socket if disabled
        if (!enabled && socket.current){
            disconnect();
            // socket.current.close();
            // socket.current = null;
        }
        // If enabled but not socket found
        // If the socket is created on mount
        if (enabled && socket.current===null){
            connect();
        }
    },[enabled, url]);

    useEffect(()=>{
        // Closes the socket on unmount
        return ()=>{
            if(socket.current)
                socket.current.close();
            socket.current = null;
            setReadyState("closed");
            setEnabled(false);
        }
    },[]);

    return {
        socket: socket as React.RefObject<NextWebSocket|null>,
        send,
        connect,
        disconnect,
        initialized,
        readyState: readyState as typeof readyState//getReadyStatus(socket) as ReturnType<typeof getReadyStatus>,
    }
}

const getReadyStatus = (socket: React.RefObject<WebSocket|null>)=>{
    if (!socket.current) return "closed";
    
    switch(socket.current.readyState){
        case 0:
            return "connecting";
        case 1:
            return "open";
        case 2:
            return "closing"
        default:
            return "closed"
    }
}