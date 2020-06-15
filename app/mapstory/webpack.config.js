
'use strict';

let fs = require('fs'),
    _ = require('lodash'),
    webpack = require('webpack');

let port = 3005;

let entries = {
  'shell': './pages/shell/index.js',
  'static': './pages/static/index.js',
  'module-based': './pages/module-based/index.js',
  'editor': './pages/editor/index.js'
};

entries.vendor = [
  'normalize.css',
  'jquery',
  'vue',
  'numeral',
  'moment',
  'lodash',
  'highcharts-browserify'
];

module.exports = {
  entry: entries,
  output: {
    path: './public/dist',
    publicPath: '/public/dist/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      {
        test   : /\.(png|jpg|gif|svg|woff2)$/,
        loader : 'url-loader?limit=100000'
      }
    ]
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },
  vue: {
    loaders: {
      html: 'vue-html?collapseWhitespace=false&removeOptionalTags=false'
    }
  },
  devServer: {
    hot: true,
    inline: true,
    port: 3000,
    proxy: {
      '*': {
        target: `http://localhost:${port}/`
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        WEB_PORT: port
      }
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
  ]
};

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = module.exports.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ]);
} else {
  module.exports.devtool = '#source-map';
}
