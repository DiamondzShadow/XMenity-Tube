/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable experimental features
  experimental: {
    // Using pages router - no appDir needed in Next.js 14
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
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Redirects for better UX
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

    // Handle ESM modules
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    return config;
  },

  // Transpile packages that need it
  transpilePackages: [
    'thirdweb',
    '@thirdweb-dev/sdk',
    '@thirdweb-dev/chains',
  ],

  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Output configuration for deployment
  output: 'standalone',
  
  // PoweredByHeader
  poweredByHeader: false,
};

module.exports = nextConfig;