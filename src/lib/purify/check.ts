/*
    ^ → start of string
    + → one or more allowed characters
    $ → end of string
*/
export const checkUsername = (username: string|undefined)=>{
    if (!username || username==="") return false;
    const reg = /^[a-zA-Z0-9\-_@#$%&*]+$/
    return reg.test(username)
}

export const checkPassword = (password: string|undefined)=>{
    if (!password || password==="") return false;
    const reg = /^[a-zA-Z0-9\-_@#$%&*]+$/
    return reg.test(password)
}

export const checkEmail = (email: string|undefined)=>{
    if (!email || email==="") return false;
    const reg = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    return reg.test(email)
}

export const checkOtp = (otp: string|undefined, length:number = 6)=>{
    if (!otp || otp==="") return false;
    // Regex: /^\d{<length>}$/
    return RegExp(`^\\d{${length}}$`).test(otp);
}