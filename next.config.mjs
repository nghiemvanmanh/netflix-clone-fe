/** @type {import('next').NextConfig} */
export const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
   {
      protocol: "https",
      hostname: "**",
    },
   ],
  },
};

export default nextConfig;