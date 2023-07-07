// const removeImports = require('next-remove-imports');

// module.exports = removeImports()({
//   // ✅  options...
//   webpack: function(config) {
//     config.module.rules.push({
//       test: /\.md$/,
//       use: 'raw-loader',
//     })
//     return config
//   },
// });

// const removeImports = require('next-remove-imports')({
//   test: /\@uiw$/,
//  use: 'raw-loader',
// });

// module.exports = removeImports({

// // ✅  options...
// // webpack: function(config) {
// //   config.module.rules.push({
// //     test: /\.md$/,
// //     use: 'raw-loader',
 
// //   })

// //   return config
// // },
// webpack(config, options) {
// return config
// },
// });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains:["assets-global.website-files.com"]
  }
}

module.exports = nextConfig