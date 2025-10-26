/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Optional: ignore TS errors in build (not recommended long-term)
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['localhost'],
  },
  // Prevent tsconfig overwrite (optional)
  experimental: {
    // No need to lock tsconfig if we fix it once
  }
};

// ESM syntax: export default
export default nextConfig;