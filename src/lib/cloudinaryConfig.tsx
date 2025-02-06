import {v2} from 'cloudinary'

v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLD_NAME ||'',
    api_key: process.env.NEXT_PUBLIC_CLD_KEY ||'',
    api_secret: process.env.NEXT_PUBLIC_CLD_SECRET ||'' 
});

export {v2 as Cloudinary}