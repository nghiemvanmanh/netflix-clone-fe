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
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;