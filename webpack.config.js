/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const path = require("path");
const smp = new SpeedMeasurePlugin();

module.exports = () => {
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
          use: "url-loader",
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".css"],
    },
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        favicon: "./public/favicon.ico",
      }),
      new CleanWebpackPlugin(),
    ],
  };

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
