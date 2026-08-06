const styleCodes = {
    bold: 1, dim: 2, italics: 3, underline: 4, blink: 5,
    reverse: 7, hidden: 8, strikeThrough: 9
}
const colorCodes = {
    black: 30, red: 31, green: 32, yellow: 33,
    blue: 34, magenta: 35, cyan: 36, white: 37, default: 39
}
const allCodes = {
    // Resets EveryThing
    reset: 0,
    // Text Style
    bold: 1, dim: 2, italics: 3, underline: 4, blink: 5,
    reverse: 7, hidden: 8, "strike-through": 9,
    // Foreground Colors
    black: 30, red: 31, green: 32, yellow: 33,
    blue: 34, magenta: 35, cyan: 36, white: 37,
    defaultC: 39
    // Background Colors => Foreground + 10
    // Bright Versions => ( Foreground | Background ) + 60
}
type Color = keyof typeof colorCodes | `bright-${Exclude<keyof typeof colorCodes,"default">}`;
type Style = keyof typeof styleCodes;

/* New Styles */
type Styles = Extract<keyof typeof allCodes,
    "reset"|"bold"|"dim"|
    "italics"|"underline"|
    "blink"|"reverse"|"hidden"|
    "strike-through"
>;

type ForegroundColor = Exclude<keyof typeof allCodes, Styles>;

type BackgroundColor = `bg-${ForegroundColor}`;

type Bright<
    T extends ForegroundColor | BackgroundColor = 
    ForegroundColor | BackgroundColor
> = Exclude<
    `bright-${T}`,
    `bright-${Extract<ForegroundColor,"default">}`|
    `bright-${Extract<BackgroundColor,"bg-default">}`
>;

type BrightC = Exclude<`bright-${ForegroundColor | BackgroundColor}`,
    `brigth-${Extract<(ForegroundColor & BackgroundColor),"default"|"bg-default">}`
>

export const getColorCodes = ()=>{
    return {
        ...allCodes,
        bgBlack: 40, bgRed: 41, bgGreen: 42, bgYellow: 43,
        bgBlue: 44, bgMagenta: 45, bgCyan: 46, bgWhite: 47,
        bgDefaultC: 49,

        tick: "✓",
        wrong: "✕",// ✘
        dot: "○"
    }
}

export const serverLog = (
    type: "message" | "success" | "failed",
    sender: string,
    options: {
        symbolColor?: "red" | "yellow" | "green" | "cyan" | "white",
        color?: "red" | "yellow" | "green" | "cyan" | "white"
    },
    ...content: any[]
)=>{
    const cc = getColorCodes();
    //console.log(cc[options.symbolColor! ?? type==="message"?"cyan":type==="success"?"green":"red"])
    console.log(
        `\x1b[1;${options.symbolColor? cc[options.symbolColor]:cc[type==="message"?"cyan": type==='success'?"green":"red"]}m${type==="success"?cc.tick:type==="failed"?cc.wrong:cc.dot}\x1b[0m`,
        `\x1b[1;${cc[options.color??'white']}m${sender}\x1b[0m:`,
        ...content
    );
}