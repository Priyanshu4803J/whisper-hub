
const path = require("path");
const webpack = require("webpack");

module.exports = function override(config, env) {
  // Add custom configurations here

  config.resolve.fallback = {
    zlib: require.resolve("browserify-zlib"),
    querystring: require.resolve("querystring-es3"),
    path: require.resolve("path-browserify"),
    crypto: require.resolve("crypto-browserify"),
    fs: false,
    stream: require.resolve("stream-browserify"),
    http: require.resolve("stream-http"),
    net: false,
    vm: require.resolve("vm-browserify"),
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      "process.env": JSON.stringify(process.env),
      Buffer: ["buffer", "Buffer"],
    }),
  ]);

  return config;
};
