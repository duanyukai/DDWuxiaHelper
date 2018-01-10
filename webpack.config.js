const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const paths = {
  DIST: path.resolve(__dirname, 'dist'),
  SRC: path.resolve(__dirname, 'src'),
};

module.exports = {
  context: paths.SRC,
  entry: {
    bundle: path.join(paths.SRC, 'index.js'),
    vendor: [
      'react',
      'ajv',
      'lodash',
      'react-bootstrap',
      'react-custom-scrollbars',
      'react-dom',
      'react-measure',
      'react-onclickoutside',
      'react-redux',
      'react-router-bootstrap',
      'react-router-dom',
      'redux',
      'redux-localstorage',
      'redux-promise'
    ],
  },
  output: {
    path: paths.DIST,
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js'
  },
  devServer: {
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(paths.SRC, 'index.html'),
    }),
    new ExtractTextPlugin('styles.css'),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: ['vendor', 'manifest'],
    // }),
    new BundleAnalyzerPlugin(),
    // new UglifyJsPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['env', {
                  targets: {
                    browsers: ['last 2 versions', '> 2%']
                  }
                }]
              ],
              plugins: [
                'transform-react-jsx',
                'transform-object-rest-spread',
                'syntax-dynamic-import',
                [
                  'react-css-modules',
                  {
                    context: paths.SRC
                  }
                ]
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use:
          ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
          })
      },{
        test: /\.css$/,
        include: /node_modules/,
        use:
          ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader'
          })

      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
