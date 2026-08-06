const change = (color: string)=>{
    let match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return null;
    
    const [r, g, b] = match.slice(1).map(Number);
    //console.log(`\x1b[38;2;${r};${g};${b}mColor\x1b[0m`)
    return `\x1b[38;2;${r};${g};${b}m`
}
export const ansiColors = {
    'red':change('rgb(255, 86, 86)'),
    'green':change('rgb(116, 202, 120)'),
    'yellow':change('rgb(255, 200, 83)'),
    'blue':change('rgb(86, 131, 255)'),
    'magenta':change('rgb(166, 0, 255)'),
    'cyan':change('rgb(19, 214, 182)'),
    'white':change('rgb(255, 255, 255)'),
}

export function colorText (text: string|undefined, color: keyof typeof ansiColors){
    return `${ansiColors[color]}${text}\x1b[0m`
}

export function serverLog (
    status:'success'|'failed',
    category: 'USER'|'SYSTEM',
    type:
        'login'|'signup'|
        'profile-picture-add'|'profile-picture-delete'
    ,
    options?: {
        username?: string|undefined,
        error?: string|undefined
    }
){
    const statusColor = status==='success'?' 🟢 ':' 🔴 '; 
    const categoryPart = `${category}${options?.username?
        ` [${colorText(options?.username,'cyan')}]`:''
    }`
    console.log(statusColor+categoryPart+" : "+colorText(type,status==='success'?'green':'red'))
    if(options?.error && status ==='failed') console.log(" ➡️  "+colorText(options.error, 'yellow'));
}

const colors = {
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
    white: 37
}
export function ansiColor (
    color: keyof (typeof colors),
    text: string,
    bold?: boolean
){
// ✘✔✓
// 30 = Black
// 31 = Red
// 32 = Green
// 33 = Yellow
// 34 = Blue
// 35 = Magenta
// 36 = Cyan
// 37 = White
    return `\x1b[${bold?"1;":''}${colors[color]}m${text}\x1b[0m`
}