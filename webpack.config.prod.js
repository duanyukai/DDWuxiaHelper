const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const PrerenderSpaPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSpaPlugin.PuppeteerRenderer;

const allRoutes = require('./sitemap/output/routes.json');

const paths = {
  DIST: path.resolve(__dirname, 'dist'),
  SRC: path.resolve(__dirname, 'src'),
  publicPath: 'https://wuxia-tools-main-server-1251080372.file.myqcloud.com/',
  // publicPath: '/'
};

module.exports = function(env) {
  return {
    context: paths.SRC,
    mode: 'production',
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
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {}
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(paths.SRC, 'index.html'),
        inject: 'head', // 预渲染需要
        chunksSortMode: 'dependency',
        stylePublicPath: paths.publicPath,
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
        chunkFilename: '[id].[hash].css'
      }),
      new CopyWebpackPlugin([
        {from: 'static'}
      ]),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          ecma: 5,
          ie8: true
        }
      }),
      new CompressionPlugin({
        filename: '[path].gz[query]',
        threshold: 10240,
        deleteOriginalAssets: true
      }),
      env.prerender ?
        new PrerenderSpaPlugin({
          staticDir: path.join(__dirname, 'dist'),
          outputDir: path.join(__dirname, 'prerendered'),
          indexPath: path.join(__dirname, 'dist', 'index.html'),
          routes: allRoutes,
          renderer: new Renderer({
            injectProperty: '__PRERENDER_INJECTED',
            inject: true,
            maxConcurrentRoutes: 32,
            // renderAfterTime: 10000,  // 10s后渲染（不推荐）
            // headless: true,
            headless: false
          }),
          minify: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            decodeEntities: true,
            keepClosingSlash: true,
            sortAttributes: true
          },

          postProcess: function (renderedRoute) {
            // let titles = {
            //   '/': '段段天刀综合助手 | 天涯明月刀：心法模拟器、地图助手、时辰吉凶、帮派技能模拟器、数据百科',
            //   '/xinfa': '天刀心法模拟器，精确计算功力、突破、潜修、砭石 | 段段天刀综合助手',
            //   '/map': '天刀地图助手，墨宝坐标、航海图鉴… | 段段天刀综合助手',
            //   '/calendar': '天刀吉凶时辰模拟预测，天涯时刻 | 段段天刀综合助手',
            //   '/family-tech': '天刀帮派技能模拟器，碎银帮贡修为消耗模拟 | 段段天刀综合助手',
            //   '/rank': '天刀功力排行榜，每日最新排名、历史排名查询 | 段段天刀综合助手',
            //   '/panorama': '天刀全景图分享，全景美图视觉体验 | 段段天刀综合助手',
            //   '/data': '天刀数据百科，最新最全的天刀数据 | 段段天刀综合助手',
            //   '/data/gem': '天刀砭石数据百科，最新最全的天刀砭石属性、功力战力、图标及可视化汇总 | 段段天刀综合助手'
            // };
            // html = html.replace(
            //   /<title>[^<]*<\/title>/i,
            //   '<title>' + titles[context.route] + '</title>'
            // );
            // 去除模态框
            renderedRoute.html = renderedRoute.html.replace(
              /<body[^>]*>/ig,
              '<body>'
            );
            renderedRoute.html = renderedRoute.html.replace(
              /<div role="dialog">.*<\/div><\/body>/ig,
              '</body>'
            );
            // 增加Google自动广告
            // renderedRoute.html = renderedRoute.html.replace(
            //   /<\/head>/i,
            //   `<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
            //   <script>
            //     (adsbygoogle = window.adsbygoogle || []).push({
            //       google_ad_client: "ca-pub-9742451422065878",
            //       enable_page_level_ads: true
            //     });
            //   </script></head>`
            // );
            return renderedRoute;
          }
        }) : null,
    ].filter(o => o!==null),
    module: {
      rules: [
        {
          test: /\.(js|jsx|mjs)$/,
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
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
              }
            }
            // 'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
            // 'postcss-loader',
            // 'sass-loader',
          ]
        }, {
          test: /\.(sa|sc|c)ss$/,
          include: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
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
        // 暂时不用url loader，避免html过大
        {
          test: /\.(png|jpg|gif|svg)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'file-loader',
              options: {}
            }
          ],
          // use: [
          //   {
          //     loader: 'url-loader',
          //     options: {
          //       limit: 8192
          //     }
          //   }
          // ]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.mjs'],
    },
  };
};