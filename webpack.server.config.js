const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map',
  entry: ['webpack/hot/poll?1000', path.join(__dirname, 'src/server.ts')],
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?1000']
    })
  ],
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        exclude: [path.resolve(__dirname, 'node_modules')],
        test: /\.(ts|js)$/,
        use: 'babel-loader'
      }
    ]
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist')
  },
  target: 'node',
  plugins: [new CleanWebpackPlugin(), new webpack.HotModuleReplacementPlugin()],
};