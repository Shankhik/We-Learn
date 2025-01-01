const origins = ['http://localhost:3000', 'https://we-learn.onrender.com']

export const header = (origin: string|null): HeadersInit =>{
    function checkOrigin():string{
        if(origin!==null && origin){
            if (origins.includes(origin)) return origin;
        }
        return ''
    }
    let header: HeadersInit = {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': `${checkOrigin()}`
    };
    return header;
}