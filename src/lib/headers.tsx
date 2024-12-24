const origins = ['http://localhost:3000']

export const header = (origin: string|null): HeadersInit =>{
    function checkOrigin(){
        if (origins.includes(origin || '')) return true;
        else return false
    }
    let header: HeadersInit = {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': `${checkOrigin()?origin: ''}`
    };
    return header;
}