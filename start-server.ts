import { createServer } from "node:http";
import next from "next";
import { WebSocketServer, WebSocket } from "ws";
import { ansiColor } from "@/lib/colorText";
import * as wsUtil from "./web-socket/reqHandler";
import { WithIdWebSocket, WSMessage } from "@/types/websocket";
import { randomUUID } from "node:crypto";
import serverLog from "@/lib/serverUtils/log";

const isDev = process.env.NODE_ENV !== "production"

const appDetails = {
    baseUrl: isDev?
        `http://localhost:${process.env.PORT||3000}`:
        `https://${process.env.NEXT_PUBLIC_API_DOMAIN||
        `localhost:${process.env.PORT||3000}`}`,
    port: process.env.PORT||3000
}

const nextApp = next({ dev: isDev });
const nextJSReqHandler = nextApp.getRequestHandler();
const clients:Map<WebSocket, boolean> = new Map();

console.log(`\n${ansiColor("white","○",true)} App Starting ...`);

nextApp.prepare().then(() => {
    
    const server = createServer((req, res) => {
        nextJSReqHandler(req, res);// Next.js handles pages and API
    });

    const wss = new WebSocketServer({
        noServer:true,
    });

    // Heartbeat Specific
    let heartbeatInterval:NodeJS.Timeout|null = null;
    let prevCount = 0;

    // Function to start heartbeat + auto closes
    const startHeartbeat = ()=>{
        // If interval already exists
        if (heartbeatInterval) return;

        // Sets heartbeat interval
        heartbeatInterval = setInterval(()=>{
            wss.clients.forEach((ws)=>{
                // Checks if in-active/doesn't exists
                if(!clients.get(ws)){
                    ws.terminate();
                    clients.delete(ws);
                    return;
                }
                // Sets the client inactive before ping
                clients.set(ws, false);
                ws.ping();
            });
            
            // Closes interval if 
            if (wss.clients.size === 0){
                clearInterval(heartbeatInterval??undefined);
                heartbeatInterval = null;
                prevCount = 0;
            }

            if(
                // Previous output count is not the same
                prevCount !== wss.clients.size ||
                // Prints if no clients are active
                wss.clients.size === 0
            ){
                prevCount = wss.clients.size;
                serverLog("message","ws",null,`active socket(s) -> ${wss.clients.size}`);
            }
            
        },60000);
    }

    wss.addListener('connection', (socket: WithIdWebSocket, request)=>{

        // Initial heartbeat
        if(clients.size === 0){
            // Sets prev clients count to 1
            // so that the log won't be repeated
            prevCount = 1;
            serverLog("message","ws",null,`active socket(s) -> ${wss.clients.size}`)
            //logWS({color:'cyan'},`active socket(s) -> ${wss.clients.size}`)
        }

        // Starts heartbeat check on a new connection
        // [if there isn't any heartbeat check]
        startHeartbeat();
        socket._id = randomUUID();
        // Adding the client to the set.
        clients.set(socket,true);
        
        // Sets isActive true on pong from the client
        socket.on('pong',()=> clients.set(socket, true)); 

        socket.on("message", (rawData, isBinary)=>{
            const {data, error} = wsUtil.getMessage(rawData,isBinary);
            if (error) return;
            if (typeof data === 'number'|| typeof data ==='string'){
                wsUtil.handleStrNum(socket, data)
            }
            if (typeof data === 'object'){
                wsUtil.handleObject(socket, data as WSMessage)
            }
        });
    
        socket.on("close", (code,reason) => {
            clients.delete(socket);
        });
        socket.on("error",(error)=>{
            serverLog("failed","ws",null,`error: ${error.message}`)
            //logWS({color:'red'},`error: ${error.message}.`);
        })
    })
    
    wss.addListener('close',()=>{
    })
    
    wss.addListener('error',(error)=>{
        serverLog("failed","ws",null,`error: ${error.message}`)
        //logWS({color:'red'},`error: ${error.message}`)
    })
    
    server.on("upgrade",(req, socket, head)=>{
        const { pathname } = new URL(req.url||"/",appDetails.baseUrl);

        if( pathname === '/_next/webpack-hmr'){
            nextApp.getUpgradeHandler()(req, socket, head);
        }

        if (pathname?.startsWith("/api/ws/") || pathname==='/api/ws'){
            wss.handleUpgrade(req, socket, head, (socket,req)=>{
                wss.emit("connection", socket, req)
            });
        }
    })

    console.log(`\n▲ ${ansiColor('green',"We Learn")} (v 0.4)\n`,
        `- PORT: ${appDetails.port}\n`,
        `- ENV: developement`
    );
    server.listen(appDetails.port,()=>{
        console.log(`\nServer Status: ${ansiColor('blue',"Running")}\n`);
    });
    
});