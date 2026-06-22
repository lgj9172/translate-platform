/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  async redirects() {
    return [
      // 구 마켓플레이스 경로 → 새 경로
      { source: "/translation", destination: "/market", permanent: true },
      {
        source: "/translation/:id/quote/create/done",
        destination: "/market/:id/quote/create/done",
        permanent: true,
      },
      {
        source: "/translation/:id/quote/create",
        destination: "/market/:id/quote/create",
        permanent: true,
      },
      {
        source: "/translation/:id",
        destination: "/market/:id",
        permanent: true,
      },
      // 구 my/translation ghost redirect 경로 → 새 경로
      {
        source: "/my/translation/request/create",
        destination: "/my/requests/create",
        permanent: true,
      },
      {
        source: "/my/translation/request/:id",
        destination: "/my/requests/:id",
        permanent: true,
      },
      {
        source: "/my/translation/request",
        destination: "/my/requests",
        permanent: true,
      },
      {
        source: "/my/translation/response",
        destination: "/my/work",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
