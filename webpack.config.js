const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const XMLWebpackPlugin = require("xml-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const devCerts = require("office-addin-dev-certs");
const crypto = require("crypto");
const path = require("path");
const packageJson = require("./package.json");

module.exports = async (env, options) => {
  const hash = crypto.randomBytes(12).toString("hex");

  return {
    entry: {
      custom_functions: ["./src/custom_functions.ts"],
      commands: ["./src/commands.ts"],
      app: ["./src/app.tsx"],
    },
    devtool: "source-map",
    mode: "production",
    target: ["web", "es5"],
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          loader: "babel-loader",
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          { from: "src/**/*.html" },
          { from: "src/**/*.json" },
          { from: "src/assets/", to: "assets" },
        ],
      }),
      new XMLWebpackPlugin({
        files: [
          {
            template: path.join("src/manifest.ejs"),
            filename: `satf_local.${packageJson.version}.xml`,
            data: {
              base: "https://localhost:3000",
              appId: "f8b6c6c3-08a9-470d-8cc2-83fb3cd52c88",
              version: `${packageJson.version}`,
              type: "Local - ",
              local_custom_functions: `https://localhost:3000/custom_functions.${hash}.js`,
            },
          },
          {
            template: path.join("src/manifest.ejs"),
            filename: `satf_development.${packageJson.version}.xml`,
            data: {
              base: "https://satfstaticdev.z6.web.core.windows.net",
              appId: "594a9feb-ec64-4288-8440-a56b59d3e147",
              local_custom_functions: `https://satfstaticdev.z6.web.core.windows.net/custom_functions.${hash}.js`,
              type: "Development - ",
              version: `${packageJson.version}`,
            },
          },
          {
            template: path.join("src/manifest.ejs"),
            filename: `satf_production.${packageJson.version}.xml`,
            data: {
              base: "https://satfstatic.z6.web.core.windows.net",
              appId: "b208298e-1e1e-486b-bdc4-fa507d8c248f",
              local_custom_functions: `https://satfstatic.z6.web.core.windows.net/custom_functions.${hash}.js`,
              type: "",
              version: `${packageJson.version}`,
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        title: "SatF",
        template: "./src/sites/template.html",
      }),
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: `[name].${hash}.js`,
    },
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      https:
        options.https !== undefined
          ? options.https
          : await devCerts.getHttpsServerOptions(),
      port: process.env.npm_package_config_dev_server_port || 3000,
      proxy: {
        "/api": {
          target: "http://localhost:8080/api",
          secure: false,
          compress: true,
          pathRewrite: { "^/api": "" },
        },
      },
    },
  };
};
