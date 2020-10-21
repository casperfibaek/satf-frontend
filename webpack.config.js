const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const XMLWebpackPlugin = require('xml-webpack-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const devCerts = require('office-addin-dev-certs');
const crypto = require('crypto');
const packageJson = require('./package-lock.json');

module.exports = async (env, options) => {
  const hash = crypto.randomBytes(12).toString('hex');

  return {
    entry: {
      custom_functions: ['./src/custom_functions.ts'],
      commands: ['./src/commands.ts'],
      app: ['./src/app.tsx'],
    },
    devtool: 'source-map',
    mode: 'production',
    target: ['web', 'es5'],
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
          exclude: /node_modules/,
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: {
            condition: /^\**!|@preserve|@license|@cc_on/i,
            filename: (fileData) => `${fileData.filename}.LICENSE.txt${fileData.query}`,
            banner: (licenseFile) => `License information can be found in ${licenseFile}`,
          },
        }),
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          { from: 'src/**/*.html', flatten: true },
          { from: 'src/**/*.css', flatten: true },
          { from: 'src/**/*.json', flatten: true },
          { from: 'src/assets/', to: 'assets' },
        ],
      }),
      new XMLWebpackPlugin({
        files: [
          {
            template: path.join('src/manifest.ejs'),
            filename: 'satf_local.xml',
            data: {
              base: 'https://localhost:3000',
              version: `${packageJson.version}`,
              local_custom_functions: `https://localhost:3000/custom_functions.${hash}.js`,
            },
          },
          {
            template: path.join('src/manifest.ejs'),
            filename: 'satf_development.xml',
            data: {
              base: 'https://satf-test.azurewebsites.net',
              local_custom_functions: `https://satf-test.azurewebsites.net/custom_functions.${hash}.js`,
              version: `${packageJson.version}`,
            },
          },
          {
            template: path.join('src/manifest.ejs'),
            filename: 'satf_production.xml',
            data: {
              base: 'https://satf.azurewebsites.net',
              local_custom_functions: `https://satf.azurewebsites.net/custom_functions.${hash}.js`,
              version: `${packageJson.version}`,
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        title: 'SatF',
        template: './src/sites/template.html',
      }),
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: `[name].${hash}.js`,
    },
    devServer: {
      publicPath: '/interface',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      https: (options.https !== undefined) ? options.https : await devCerts.getHttpsServerOptions(),
      port: process.env.npm_package_config_dev_server_port || 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:8080/api',
          secure: false,
          compress: true,
          pathRewrite: { '^/api': '' },
        },
      },
    },
  };
};
