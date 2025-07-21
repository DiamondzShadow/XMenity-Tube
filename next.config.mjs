/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable experimental features for App Router
  experimental: {
    // App Router is stable in Next.js 15
  },

  // Environment variables that should be exposed to the browser
  env: {
    THIRDWEB_CLIENT_ID: process.env.THIRDWEB_CLIENT_ID,
    FACTORY_CONTRACT_ADDRESS: process.env.FACTORY_CONTRACT_ADDRESS,
    ARBITRUM_RPC_URL: process.env.ARBITRUM_RPC_URL,
    CHAIN_ID: process.env.CHAIN_ID,
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://34.45.54.110:3000',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://34.45.54.110:3000',
  },

  // Image domains for external images
  images: {
    domains: [
      'pbs.twimg.com', // Twitter profile images
      'abs.twimg.com', // Twitter images
      'api.insightiq.ai', // InsightIQ images
      'staging.insightiq.ai', // InsightIQ staging
      'avatars.githubusercontent.com', // GitHub avatars
      'images.unsplash.com', // Unsplash images
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.twimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.insightiq.ai',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.staging.insightiq.ai https://arbitrum-one.infura.io wss://arbitrum-one.infura.io;",
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },

  // Webpack configuration for Web3 compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        assert: require.resolve('assert'),
        os: require.resolve('os-browserify'),
        path: require.resolve('path-browserify'),
      };
    }

    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    return config;
  },

  // Transpile packages
  transpilePackages: [
    '@rainbow-me/rainbowkit',
    '@tanstack/react-query',
    'wagmi',
    'viem',
    'thirdweb',
  ],

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    dirs: ['app', 'components', 'lib', 'hooks'],
  },

  // Output configuration for different deployment targets
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
};

export default nextConfig;