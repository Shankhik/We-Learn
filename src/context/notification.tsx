'use client';

import { v4 as uuid} from 'uuid';
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Options = {
    duration?: number,
    color?: 'red'|'green'|'violet'|'blue'|'yellow'
}
type NotificationContextType = {
    notifications: Array<Options & {id: string, text: string}>,
    push: (text: string|undefined, options?:Options)=> void,
    pop: (id?: string)=> void,
    clear: ()=> void
}

const notificationContext = createContext<NotificationContextType>({
    notifications: [],
    push: (text: string|undefined, options?: Options) => {},
    pop: (id?: string)=> {},
    clear: ()=> {}
});

export const NotificationProvider = ({children}:{
    children: React.ReactNode
})=>{
    const [notifications, setNotifications] = useState<NotificationContextType['notifications']>([]);
    const getDuration = (length: number)=>{
        return length>50? (length/3)*200 : 3300
    }
    const defaults: Options = {
        duration: 700,
        color: 'violet'
    }
    const push = useCallback<NotificationContextType['push']>((text, options)=>{
        setNotifications(prev=>{
            return [
                ...prev,
                {
                    id: uuid(),
                    text: text||"",
                    duration: options?.duration || getDuration(text?.length||0),
                    color: options?.color || defaults.color
                }
            ]
        })
    },[]);
    const pop = useCallback<NotificationContextType['pop']>((id?: string)=>{
        setNotifications(prev => prev.filter((n,i) => {
            // Filters by id
            if (id) return n.id !== id
            // Filters by index (removes the first/oldest notification)
            return i !== 0
        }));
    },[]);
    const clear = useCallback(()=>{
        setNotifications([]);
    },[])

    return <notificationContext.Provider value={{ notifications, push, pop, clear}}>
        {children}
    </notificationContext.Provider>
}

export const useNotification = ()=>{
    const {
        notifications,
        push: pushNotification,
        pop: popNotification,
        clear: clearNotifications
    } = useContext(notificationContext);
    return { notifications, pushNotification, popNotification, clearNotifications }
}