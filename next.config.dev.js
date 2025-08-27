/** @type {import('next').NextConfig} */
module.exports = {
  // No base path for development
  // This allows videos and assets to be served directly from root
  
  // Your existing settings
  images: { 
    unoptimized: true,
    domains: ['localhost'] 
  },
}
