// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig
/** @type {import('next').NextConfig} */
const runtimeCaching = require('next-pwa/cache'); // preset caching yang aman
const withPWA = require('next-pwa')({
  dest: 'public',                                   // sw & workbox files ke /public
  disable: process.env.NODE_ENV === 'development',  // matikan saat dev biar ga ribet cache
  register: true,
  skipWaiting: true,
  runtimeCaching,
});
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Mungkin kamu sudah punya konfigurasi lain di sini, biarkan saja.
  // Fokus pada penambahan block 'images' di bawah ini.

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Ini adalah domain tempat foto profil Google disimpan
        port: '',
        pathname: '/**', // Izinkan semua path di dalam hostname ini
      },
      // Kamu bisa tambahkan domain lain di sini jika perlu
    ],
  },
};

module.exports =  withPWA(nextConfig);;