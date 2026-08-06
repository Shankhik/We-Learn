import { ansiColor } from "../colorText";

/**
 * console.logs() in the nextjs server.s
 * @param args Args of type any seperated by ","
 * @returns void
 */
export default async function serverLog(
    status: "success"|"failed"|"message",
    sender: "we-learn"|"redis"|"ws",
    color: "red"|"green"|"cyan"|"yellow"|null,
    ...contents: any[]
) {
    return console.log(`${ansiColor(
        color || status==="success"?"green":status==='failed'?'red':'cyan',
        status==='success'?"✓":status==="message"?"○":"✘", true
    )} ${ansiColor("white",sender, true)}:`,...contents);
}