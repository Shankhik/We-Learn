import { NextResponse } from "next/server";

const appDevPort = 3000;
export async function get(endPoint: string, header?: HeadersInit): Promise<any>{
    try{
        const response = await fetch(endPoint,{
            method: 'GET',
            headers: header || {}
        })
        const data = await response.json();
        return data;
    }catch(error:any){
        console.error('GET Fetch Error',error);
        return undefined;
    }
}
export async function post(endPoint: string, data:object, header?: HeadersInit){
    try{
        const response = await fetch(endPoint,{
            method: 'POST',
            headers: header || {},
            body: JSON.stringify(data)
        })
        const Resdata = await response.json()
        //console.log(Resdata);
        
        return Resdata;
    }catch(error:any){
        console.error('POST Fetch Error',error.message);
        return undefined;
    }
}

type Headers = {
    "Content-Type" ?:
        "application/json"|
        "text/plain"|
        "application/x-www-form-urlencoded"|
        "multipart/form-data",
    Accept ?:
        "application/json"|
        "text/html"|
        "text/plain"|
        "*/*";
  Authorization?: string; // usually "Bearer <token>"
  "User-Agent"?: string;
  "Cache-Control"?: "no-cache" | "no-store" | "max-age=0" | string;
}

export const appfetch = async <T,K extends unknown = unknown>(
    endPoint: string, body?:K, options?:{
        method: "POST"|"GET"|"PUT"|"DELETE"
        headers?: Headers,
        revalidate?: number // in seconds
    }
):Promise<T|undefined> => {
    let reqBody:BodyInit|undefined = undefined;
    let contentType: Headers['Content-Type']
    if(typeof body === 'undefined'){
        // No modification needed
    }
    else if (typeof body === "string"){
        contentType = "text/plain";
        reqBody = body;
    }else if (body instanceof FormData){
        contentType = "multipart/form-data";
        reqBody = body;
    }
    else if(typeof body === "number"){
        contentType = "text/plain"
        reqBody = body.toString();
    }
    else if ( typeof body === 'object'){
        contentType = "application/json"
        if(body) reqBody = JSON.stringify(body);
    }

    try {
        const res = await fetch(endPoint,{
            method: body===undefined ?"GET":(options?.method||"POST"),
            ...(body ? {
                body: reqBody
            }:{}),
            headers: {
                ...(body? {"Content-Type": contentType}:undefined),
                ...(options?.headers)
            },
            ...(options?.revalidate?{
                //cache:'force-cache',
                next: {revalidate: options.revalidate}
            }:undefined)
        });
        return await res.json()
    } catch (error:any) {
        return undefined;
    }
    
    
}

type ApiResponse <T extends unknown = unknown> = Response &{
    data: Exclude<T, TypeError>,
    typeError?: TypeError
}
export const apiFetch = async <
    B extends unknown = unknown,
    R extends unknown = Status
> (
    endpoint: string,
    body?: B, options?: {
        method?: "POST"|"GET"|"PUT"|"DELETE",
        headers?: Headers,
        revalidate?: number
    }
)=>{
    const properties : {
        body?: BodyInit|B|undefined,
        contentType?: Headers['Content-Type']
    } = {}

    if (typeof body === 'undefined'){
        // Nothing to do
    }
    else if (typeof body === "string"){
        properties.contentType = "text/plain"
        properties.body = body
    }
    else if (body instanceof FormData){
        // properties.contentType = "multipart/form-data"
        properties.body = body
    }
    else if (typeof body === "number"){
        properties.contentType = "text/plain"
        properties.body = String(body);
    }
    else if(typeof body === "object"){
        properties.contentType = "application/json"
        properties.body = JSON.stringify(body);
    }

    let jsonBody:R;

    try {
        const response = await fetch(endpoint,{
            method: options?.method || (properties.body? "POST":"GET"),
            body: properties.body as BodyInit,
            headers: {
                ...(properties.contentType?{
                    "Content-Type": properties.contentType
                }: undefined),
                ...options?.headers,
            },
            ...(options?.revalidate
                ? { next: {revalidate: options.revalidate} }
                : undefined
            )
        }) as ApiResponse<R>;

        try {
            response.data = await response.clone().json();

        } catch (error:any) {

        }
        
        return response;
    } catch (error:any) {
        const res = new Response(JSON.stringify(error)) as ApiResponse<R>
        if (error instanceof TypeError)
            Object.assign(res, {
                typeError: error
            });
        return res;
    }
}

// type FetchRequest = {
//     "/api/authenticate/": {
//         paranmsd
//     }
// }
// const testFetch = async()=>{

// }
export const httpStatusCode = {
    // The server cannot or will not process the request due to something that is perceived to be a client error
    // (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
    "bad-request": 400,

    // Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated".
    // That is, the client must authenticate itself to get the requested response.
    "unauthorized": 401,

    // The initial purpose of this code was for digital payment systems,
    // however this status code is rarely used and no standard convention exists.
    "payment-required": 402,

    // The client does not have access rights to the content;
    // that is, it is unauthorized, so the server is refusing to give the requested resource.
    // Unlike 401 Unauthorized, the client's identity is known to the server.
    "forbidden":403,

    // The server cannot find the requested resource. In the browser, this means the URL is not recognized.
    // In an API, this can also mean that the endpoint is valid but the resource itself does not exist.
    "not-found": 404,

    "method-not-allowed": 405,

    // This response code means the expectation indicated by the Expect request header field cannot be met by the server.
    "expectation-failed": 417,

    // The server has encountered a situation it does not know how to handle. This error is generic, indicating that the server cannot find a more appropriate 5XX status code to respond with.
    "internal-server-error": 500,
    
    // The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.
    "not-implemented": 501 ,
    
    // The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This response should be used for temporary conditions and the Retry-After HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.
    "service-unavailable": 503

    // 406 Not Acceptable
    // This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content that conforms to the criteria given by the user agent.

    // 407 Proxy Authentication Required
    // This is similar to 401 Unauthorized but authentication is needed to be done by a proxy.

    // 408 Request Timeout
    // This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers use HTTP pre-connection mechanisms to speed up browsing. Some servers may shut down a connection without sending this message.

    // 409 Conflict
    // This response is sent when a request conflicts with the current state of the server. In WebDAV remote web authoring, 409 responses are errors sent to the client so that a user might be able to resolve a conflict and resubmit the request.

    // 410 Gone
    // This response is sent when the requested content has been permanently deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for "limited-time, promotional services". APIs should not feel compelled to indicate resources that have been deleted with this status code.

    // 411 Length Required
    // Server rejected the request because the Content-Length header field is not defined and the server requires it.

    // 412 Precondition Failed
    // In conditional requests, the client has indicated preconditions in its headers which the server does not meet.

    // 413 Content Too Large
    // The request body is larger than limits defined by server. The server might close the connection or return a Retry-After header field.

    // 414 URI Too Long
    // The URI requested by the client is longer than the server is willing to interpret.

    // 415 Unsupported Media Type
    // The media format of the requested data is not supported by the server, so the server is rejecting the request.

    // 416 Range Not Satisfiable
    // The ranges specified by the Range header field in the request cannot be fulfilled. It's possible that the range is outside the size of the target resource's data.

    // 418 I'm a teapot
    // The server refuses the attempt to brew coffee with a teapot.

    // 421 Misdirected Request
    // The request was directed at a server that is not able to produce a response. This can be sent by a server that is not configured to produce responses for the combination of scheme and authority that are included in the request URI.

    // 422 Unprocessable Content (WebDAV)
    // The request was well-formed but was unable to be followed due to semantic errors.

    // 423 Locked (WebDAV)
    // The resource that is being accessed is locked.

    // 424 Failed Dependency (WebDAV)
    // The request failed due to failure of a previous request.

    // 425 Too Early Experimental
    // Indicates that the server is unwilling to risk processing a request that might be replayed.

    // 426 Upgrade Required
    // The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol. The server sends an Upgrade header in a 426 response to indicate the required protocol(s).

    // 428 Precondition Required
    // The origin server requires the request to be conditional. This response is intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.

    // 429 Too Many Requests
    // The user has sent too many requests in a given amount of time (rate limiting).

    // 431 Request Header Fields Too Large
    // The server is unwilling to process the request because its header fields are too large. The request may be resubmitted after reducing the size of the request header fields.

    // 451 Unavailable For Legal Reasons
    // The user agent requested a resource that cannot legally be provided, such as a web page censored by a government.

    // 502 Bad Gateway
    // This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.

    // 504 Gateway Timeout
    // This error response is given when the server is acting as a gateway and cannot get a response in time.

    // 505 HTTP Version Not Supported
    // The HTTP version used in the request is not supported by the server.

    // 506 Variant Also Negotiates
    // The server has an internal configuration error: during content negotiation, the chosen variant is configured to engage in content negotiation itself, which results in circular references when creating responses.

    // 507 Insufficient Storage (WebDAV)
    // The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.

    // 508 Loop Detected (WebDAV)
    // The server detected an infinite loop while processing the request.

    // 510 Not Extended
    // The client request declares an HTTP Extension (RFC 2774) that should be used to process the request, but the extension is not supported.

    // 511 Network Authentication Required
    // Indicates that the client needs to authenticate to gain network access.
}

export const getNextResponse = <T extends any>(body: T, options?:{
    status?: number,
    headers?: ResponseInit['headers']
}):NextResponse<T> => {
    return NextResponse.json(body,{
        status: options?.status,
        headers: options?.headers
    })
}
export const apiLink = (endpoint: string|'root',port?:number) => {
    const domain = process.env.NODE_ENV === 'development'?
    `http://localhost:${port||appDevPort}`:
    `https://${process.env.NEXT_PUBLIC_API_DOMAIN}`

    while (endpoint.startsWith("/") || endpoint.startsWith('api')){
        if(endpoint.startsWith("/")) endpoint = endpoint.split("/")[1];
        else endpoint = endpoint.split('api/')[1];
    }
    return endpoint==='root'?`${domain}/api`:`${domain}/api/${endpoint}`
}