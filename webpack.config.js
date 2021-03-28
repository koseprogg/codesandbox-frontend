const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const path = require("path");
const smp = new SpeedMeasurePlugin();
const webpack = require("webpack");

module.exports = () => {
  const isProd = process.env.NODE_ENV == "production";

  const config = {
    entry: "./src/index.tsx",
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: "ts-loader",
          include: path.resolve(__dirname, "src"),
        },
        {
          test: /\.(css|scss)$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.(png|jpg|svg)$/,
          use: [{ loader: "url-loader" }],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".css"],
      alias: {
        process: "process/browser",
      },
      fallback: {
        process: require.resolve("process/browser"),
      },
    },
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
    },
    plugins: [
      new webpack.EnvironmentPlugin(["NODE_ENV", "BACKEND_URL"]),
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        favicon: "./public/favicon.ico",
      }),
      new CleanWebpackPlugin(),
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
    ],
  };

  if (isProd) {
    return smp.wrap({
      ...config,
      mode: "production",
      devtool: "source-map",
      performance: {
        // https://web.dev/your-first-performance-budget/#budget-for-quantity-based-metrics
        hints: "warning",
        maxEntrypointSize: 170 * 1024,
        maxAssetSize: 450 * 1024,
      },
      plugins: [
        ...config.plugins,
        process.env.ANALYZE &&
          new BundleAnalyzerPlugin({
            generateStatsFile: true,
            analyzerMode: "disabled",
          }),
      ].filter(Boolean),
    });
  }

  return smp.wrap({
    ...config,
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
      contentBase: "./dist",
      port: 4000,
      historyApiFallback: true,
    },
    module: {
      rules: [
        ...config.module.rules,
        {
          enforce: "pre",
          test: /\.*js$/,
          loader: "source-map-loader",
        },
      ],
    },
  });
};
