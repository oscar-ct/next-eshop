/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cloud.shoposcar.com',
            },

        ],
    },
    async redirects() {
        return [
            {
                source: '/landing',
                destination: '/',
                permanent: true,
            },
        ]
    },
};


export default nextConfig;

