import WebSocket from "ws";
import { WithIdWebSocket, WSMessage } from "@/types/websocket";
import serverLog from "@/lib/serverUtils/log";

type DataType = number|string|Object|Buffer<ArrayBufferLike>|undefined

export const getMessage = (
    data: WebSocket.RawData,
    isBinary: boolean
):{
    data?: DataType,
    error?: Error
} =>{
    try {
        if (isBinary) return {
            data: data.valueOf()
        }
        const stringData = data.toString();
        let newData;
        try {
            newData = JSON.parse(stringData)
        } catch (error:any) {
            newData = stringData
        }
        return {
            data: newData
        }
    } catch (error:any) {
        return {
            error: error
        }
    }
}

export const handleStrNum = (socket: WithIdWebSocket | WebSocket,data: string|number)=>{
try {
    if(typeof data !== "string" && typeof data !== 'number')
        return;
    if("_id" in socket && socket._id)
        serverLog("message","ws",null,`[${socket._id}] sent -> ${data}`);
} catch (error:any) {
    
}}

export const handleObject = <T extends WSMessage>(socket: WithIdWebSocket | WebSocket, data: T)=>{
try {
    if (!("type" in data) || typeof data!=='object') return;
    
    if (Array.isArray(data) ||
        data instanceof Set ||
        data instanceof Map
    ) return;

    if(data.type === 'hello'){
        serverLog("message", "ws", null, `${data.username} sent Hello!`)
        socket.send(JSON.stringify({
            type: "hello",
            username: "Next Server"
        } as WSMessage));
    }
    else if( data.type === 'user-track'){

    }
} catch (error:any) {
    
}}
