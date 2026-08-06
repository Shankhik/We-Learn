/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: false,
    devIndicators:false,
    images:{
        remotePatterns:[
            {
                protocol:'https',
                hostname:'res.cloudinary.com'
            }
        ],
        localPatterns:[
            {
                pathname: "/media/**",
            }
        ]
    },
    allowedDevOrigins: [
        "192.168.0.173"
    ],
    experimental: {
        viewTransition: true
    }
    // rewrites: async ()=>[
    //     {
    //         source: `/cloudinary/:cld/:path*`,
    //         has: [{
    //             type: 'cookie',
    //             key: 'CLD_:cld'
    //         }],
    //         destination: `https://res.cloudinary.com/${
    //             process.env.NEXT_PUBLIC_CLD_NAME
    //         }/:path*?__cld_token__=hello`
    //     }
    // ]
};

export default nextConfig;
