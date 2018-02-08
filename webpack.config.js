const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PrerenderSpaPlugin = require('prerender-spa-plugin');

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
      // 'lodash',
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
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/'
  },
  devServer: {
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(paths.SRC, 'index.html'),
      inject: 'head', // 预渲染需要
      chunksSortMode: 'dependency'
    }),
    new ExtractTextPlugin('styles.css'),
    new BundleAnalyzerPlugin(),
    new CopyWebpackPlugin([
      { from: 'static' }
    ]),
    // 实际发布使用
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest'],
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new UglifyJsPlugin(),
    new PrerenderSpaPlugin(
      path.join(__dirname, '/dist'),
      [ '/', '/xinfa', '/map', '/calendar' ],
      {
        postProcessHtml: function (context) {
          let titles = {
            '/': '段段天刀综合助手 | 天涯明月刀：心法模拟器、地图助手、时辰吉凶、帮派技能模拟器、数据百科',
            '/xinfa': '天刀心法模拟器，精确计算功力、突破、潜修、砭石 | 段段天刀综合助手',
            '/map': '天刀地图助手 | 段段天刀综合助手',
            '/calendar': '天刀吉凶时辰模拟预测 | 段段天刀综合助手'
          };
          return context.html.replace(
            /<title>[^<]*<\/title>/i,
            '<title>' + titles[context.route] + '</title>'
          );
        }
      }
    )
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
        include: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        exclude: /node_modules/,
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
