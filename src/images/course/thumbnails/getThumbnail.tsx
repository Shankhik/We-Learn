import Blue from "./Course Thumbnail Default Blue.png";
import Violet from "./Course Thumbnail Default Violet.png";
import Orange from "./Course Thumbnail Default Orange.png";


export const getThumbnail = (options?:{
    color?: 'violet'|'orange'|'blue',
    random?: boolean
})=>{
    const t = {
        "1": {
            image:Blue,
            dominantColor: "rgb(98, 131, 240)"
            
        },
        "2": {
            image:Violet,
            dominantColor: "rgb(90, 77, 207)"
        },
        "3": {
            image:Orange,
            dominantColor: "rgb(223, 136, 86)"
        }
    }

    if (options?.color && !options?.random){
        return options.color==='blue'?t[1]:
        options.color==='violet'?t[2]:t[3]
    }

    if (options?.random){
        return t[String(randomInt(1,3)) as "1"|"2"|"3"]
    }
    return t[2];
}

function randomInt(min:number, max:number) {
    if (min > max) [min, max] = [max, min]; // optional safety
    return Math.floor(Math.random() * (max - min + 1)) + min;
}