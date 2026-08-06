import WebSocket from "ws"

export type WithIdWebSocket<T extends Object = {}> = WebSocket & T &{
    _id: string|number//`${string}-${string}-${string}-${string}-${string}`
}

export type WSMessageType = {
    "hello": {
        username: string
    },
    "user-track":{
        message: string,
        date: Date
    }
}


export type WSMessage<T extends keyof WSMessageType = keyof WSMessageType> = {
    [K in keyof WSMessageType]: WSMessageType[K] & {
        type: K,
    }
}[T]

// export type WSMessage<K extends keyof WSMessageType = keyof WSMessageType> = 
// keyof WSMessageType &{
//     type: K
// }