const webpack = require("webpack");

module.exports = {
  webpack: function (config, env) {
    config.module.rules = config.module.rules.map((rule) => {
      if (rule.oneOf instanceof Array) {
        rule.oneOf[rule.oneOf.length - 1].exclude = [
          /\.(js|mjs|jsx|cjs|ts|tsx)$/,
          /\.html$/,
          /\.json$/,
        ];
      }
      return rule;
    });
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      assert: require.resolve("assert"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify"),
      url: require.resolve("url"),
      zlib: require.resolve("browserify-zlib"),
    });
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
    ]);
    config.ignoreWarnings = [/Failed to parse source map/];
    config.module.rules.push({
      test: /\.(js|mjs|jsx)$/,
      enforce: "pre",
      loader: require.resolve("source-map-loader"),
      resolve: {
        fullySpecified: false,
      },
    });
    return config;
  },
};
