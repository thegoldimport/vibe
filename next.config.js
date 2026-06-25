/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['playwright', 'puppeteer', 'pdfkit'],
  },
};

module.exports = nextConfig;