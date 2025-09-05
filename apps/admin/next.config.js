/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'localhost'],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Optimizaciones para producción
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Configuración para monorepo
  output: 'standalone',
  // Deshabilitar ESLint durante el build para deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Deshabilitar TypeScript durante el build para deployment
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
