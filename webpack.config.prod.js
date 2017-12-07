var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './app'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        drop_console: true,
        drop_debugger: true
      }
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.js?$/,
      use: ['babel-loader'],
      exclude: /(node_modules|bower_components)/
    }]
  }
};
