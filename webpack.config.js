const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
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
    new ForkTsCheckerWebpackPlugin({ memoryLimit: 4098 }),
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
    contentBase: path.join(__dirname, './interface'),
    compress: true,
    port: 9000,
  },
};
