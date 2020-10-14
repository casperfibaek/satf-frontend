// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const devCerts = require('office-addin-dev-certs'); // eslint-disable-line

module.exports = async (env, options) => ({
  entry: {
    app: ['./interface_src/app.tsx'],
    commands: ['./interface_src/commands.ts'],
    custom_functions: ['./interface_src/custom_functions.ts'],
  },
  devtool: 'source-map',
  mode: 'production',
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
    // new ForkTsCheckerWebpackPlugin({ typescript: { memoryLimit: 4098 } }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'interface_src/**/*.html', flatten: true },
        { from: 'interface_src/**/*.css', flatten: true },
        { from: 'interface_src/**/*.xml', flatten: true },
        { from: 'interface_src/**/*.json', flatten: true },
        { from: 'interface_src/assets/', to: 'assets' },
      ],
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, './interface'),
  },
  devServer: {
    contentBase: path.join(__dirname, '/interface'),
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
  stats: 'errors-only',
});
