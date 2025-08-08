/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', port: '', pathname: '/**' },
    ],
  },
  webpack: (config: any, context: { isServer?: boolean; nextRuntime?: string }) => {
    const { nextRuntime } = context;
    if (nextRuntime === 'edge') {
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        'node:process': require('path').resolve('./lib/edge-stubs/node-process.ts'),
        process: require('path').resolve('./lib/edge-stubs/node-process.ts'),
      };
      config.externals = config.externals || [];
      config.externals.push(function (params: { request?: string }, callback: (err?: any, result?: any) => void) {
        if (params.request && /google-logging-utils/.test(params.request)) {
          return callback(null, 'undefined');
        }
        callback();
      });
    }
    return config;
  }
};

export default nextConfig;