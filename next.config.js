/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
// }
// module.exports = nextConfig

// const webpack = require("webpack");
// const {parsed:envKeys} = require("dotenv").config({path:"./.env"});
// *** disable rewrites for dev
module.exports = {
  basePath: process.env.DOMAIN,
  // baseUrl: process.env.DOMAIN,
  // async rewrites() {
  //   return [
  //     {
  //       // source: '/api/:path*',
  //       source: '/api/:path*',
  //       // destination: `${process.env.DOMAIN}/api/:path*`,
  //       destination: `${process.env.DOMAIN}/:path*`,
  //       // destination: `/:path*`,
  //     }
  //   ]
  // },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  // webpack(config){
  //   config.plugins.push(new webpack.EnvironmentPlugin(envKeys))
  //   return config
  // }
}