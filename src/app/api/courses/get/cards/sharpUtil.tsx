import sharp from "sharp";

export const getArrayBuffer = async (url: string)=>{
    try {
        const res = await fetch(url);
        const arrayBuffer = await res.arrayBuffer();
        return {
            arrayBuffer: arrayBuffer,
            buffer: Buffer.from(arrayBuffer)
        };
        //return Buffer.from(arrayBuffer);
    } catch (error:any) {
        return null;
    }
}
export const getDominantColor = async (
    buffer:Buffer|ArrayBuffer,
    lightenBy?:{
        r: number, g: number, b: number
    }
):Promise<`rgb(${number}, ${number}, ${number})`>=>{
    const image = sharp(buffer).resize(50, 50,{fit:'inside'})
    const imageStats = await image.stats();

    const effColor = {
        r: Math.min(245,imageStats.dominant.r + (lightenBy?.r||0)),
        g: Math.min(245,imageStats.dominant.g + (lightenBy?.g||0)),
        b: Math.min(245,imageStats.dominant.b + (lightenBy?.b||0))
    }
    return `rgb(${effColor.r}, ${effColor.g}, ${effColor.b})`
}