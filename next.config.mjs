/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "biznify.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "account.softifybd.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
