/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export as static site (no server needed)
  output: 'export',
  
  // Image optimization disabled for static export
  images: {
    unoptimized: true
  },
  
  // Base path if deploying to subdirectory (optional)
  // basePath: '/my-ministry-organizer',
  
  // Strict mode for better development
  reactStrictMode: true,
  
  // Disable server-side features for static export
  trailingSlash: true,
}

module.exports = nextConfig
