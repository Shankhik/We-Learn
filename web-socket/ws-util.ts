export const getWsUrl = (pathname: `/api/ws`|`/api/ws/${string}`|undefined)=>{
    pathname = pathname||"/api/ws";
    const isDev = process.env.NODE_ENV !== "production";
    return isDev? `ws://localhost:${process.env.PORT}${pathname}`:
        `wss://${process.env.NEXT_PUBLIC_API_DOMAIN}${pathname}`
}