const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const paths = {
  DIST: path.resolve(__dirname, 'dist'),
  SRC: path.resolve(__dirname, 'src'),
  publicPath: '/'
};

module.exports = {
  context: paths.SRC,
  mode: 'development',
  entry: {
    bundle: path.join(paths.SRC, 'index.js'),
    vendor: [
      'react',
      'ajv',
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
      'redux-promise',
      'js-cookie',
      'antd',
      'moment'
    ],
  },
  output: {
    path: paths.DIST,
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].js',
    // cdn前缀设置，下面css还有一个
    // publicPath: '/',
    publicPath: paths.publicPath
  },
  devServer: {

    historyApiFallback: true,
    disableHostCheck: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(paths.SRC, 'index.html'),
      inject: 'head', // 预渲染需要
      chunksSortMode: 'dependency',
      stylePublicPath: paths.publicPath,
    }),
    new BundleAnalyzerPlugin(),
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
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      browsers: ['last 2 versions', '> 2%']
                    }
                  }
                ]
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
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
            }
          },
          // 'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
          // 'postcss-loader',
          // 'sass-loader',
        ]
      },{
        test: /\.(sa|sc|c)ss$/,
        include: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          // 'postcss-loader',
          // 'sass-loader',
        ]
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
    extensions: ['.js', '.jsx', '.mjs'],
  },
};
