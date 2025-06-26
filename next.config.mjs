/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    devIndicators:false,
    images:{
        remotePatterns:[
            {
                protocol:'https',
                hostname:'res.cloudinary.com'
            }
        ]
    }
};

export default nextConfig;
