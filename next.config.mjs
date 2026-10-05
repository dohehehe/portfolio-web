/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  experimental: {
    // Middleware clones the request body and stops at 10MB by default.
    // Larger originals need to reach server-side WebP encoding.
    proxyClientMaxBodySize: "50mb",
  },
};

export default nextConfig;
