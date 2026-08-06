type Options = {
    lineBreaks?: string,
    alphaNumeric?: string,
    whitespace?: string,
    extraWhitespace?: boolean,
    custom?: [RegExp|string, string]
}

export const purifyInputValue = (input: string|undefined, options?: Options)=>{
    if (!input) return "";

    let result="";

    // Trims Empty Spaces at start and at end
    result = input.trim();

    //.replace(/[^a-zA-Z0-9]/g,"")

    if (typeof options?.lineBreaks === "string")
        result = result.replace(/./g, options.lineBreaks);

    // Removes Extra White spaces with " "
    if (options?.extraWhitespace)
        result = result.replace(/\s+/g," ");

    // Removes Whitespaces
    if (typeof options?.whitespace === "string")
        result = result.replace(/\s/g,options.whitespace);

    // Custom Regex
    if (options?.custom){
        console.log(options.custom[0])
        result = result.replace(options.custom[0],options.custom[1])
    };

    if (typeof options?.alphaNumeric === "string")
        result = result.replace(/[^a-zA-Z0-9]/g,options.alphaNumeric);

    return result
}

type ConfigsTypes = "username" | "password" | "email-format"

export const purifyString = (input: string|undefined, regex: RegExp, replaceWith?: string)=>{
    if (!input) return "";
    return input.replace(regex, typeof replaceWith==="string"? replaceWith: "");
}
export const purifyRegex = (type: ConfigsTypes):RegExp=>{
    switch(type){
        case "username":
            return /[^a-zA-Z0-9\-_@#$%&*]/g;
        case "password":
            return /[^a-zA-Z0-9\-_@#$%&*]/g;
        case "email-format":
            return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        default:
            return new RegExp("");
    }
}
