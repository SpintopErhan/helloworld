// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Genellikle önerilir, isteğe bağlı
  transpilePackages: ['wagmi', 'viem', '@wagmi/connectors', '@tanstack/react-query'], // Bu satırı ekleyin!
};

export default nextConfig;