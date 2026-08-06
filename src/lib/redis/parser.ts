type Data = Record<string, any> | string | undefined | null;

/**
 * This helper function parses JSON strings and normal JS Object.
 * @param data JSON data [normal + stringified]
 * @returns GOOD: Record<string, any> | [T], BAD: null
 */
export function parseRedis<T extends Data = Data>(data:T):
T extends null | undefined
    ? null
    : T extends string
        ? Record<string, any> | null
        : T | null
;
/**
 * This helper function parses JSON strings and normal JS Object.
 * @param data JSON data [normal + stringified]
 * @return GOOD: [R], BAD: null
 */
export function parseRedis<R, T extends Data = Data>(data:T):
T extends null | undefined
    ? null
    : R | null
;

export function parseRedis(data:any){
    let newRecord: Record<string, any>|undefined;
    
    // Returns null if initially nullable
    if (!data) return null;

    if (typeof data === "string"){try {
        // If data==="null" -> parsed will be null 👍🏻
        return JSON.parse(data);
    } catch (error:any) {
        // Parsing failed
        return null;
    }}

    else if (typeof data === "object"){try {
        // Fails if data is an array
        if (Array.isArray(data)) return null;

        newRecord = {};

        for (const [key, value] of Object.entries(data)){try {
            if (typeof value === "string")
                newRecord[key] = JSON.parse(value as any);
            else newRecord[key] = value;
        } catch (error:any) {
            newRecord[key] = value;
        }}

        return {...data, ...newRecord}
    } catch (error:any) {
        return {...data, ...newRecord};
    }}
}
