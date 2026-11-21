const ipBack=""
const ip2=""
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  allowedDevOrigins: [ipBack, ip2],
  
};

export default nextConfig;
