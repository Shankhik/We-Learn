const isDev = process.env.NODE_ENV !== 'production';
export const timingsInMinutes = {
    // 3 Mins | 8 Mins
    signupSessionJwt: isDev? 20 : 8,

    // 15 Days | 28 Days
    jwt: isDev? 60*24*15 : 60*24*28,

    // 10 mins
    opts: 10,

    redis:{
        userCredential: isDev? 5 : 15
    }
}
export const delayWithId = async (
    time: number
):Promise<NodeJS.Timeout> => {
    
    let id: NodeJS.Timeout;
    return await new Promise(res=>{
        id = setTimeout(()=> res(id), time)
        return id;
    })
}

