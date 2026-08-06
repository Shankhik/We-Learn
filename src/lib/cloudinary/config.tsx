import {v2} from 'cloudinary'

v2.config({
    cloud_name: process.env.CLD_NAME ||'',
    api_key: process.env.CLD_KEY ||'',
    api_secret: process.env.CLD_SECRET ||'' 
});

export {v2 as Cloudinary}