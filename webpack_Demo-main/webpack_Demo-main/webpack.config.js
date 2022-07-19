// Resourde: https://webpack.js.org/configuration/

const pathModule = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
module.exports = {
    mode:"production",
    entry:"./src/index.js",
    output:{
        filename:"bundle.js",
        path:pathModule.resolve(__dirname,"build"),
        assetModuleFilename: 'images/[name][ext]'
    },
    module:{
        rules: [
            {
              test: /\.css$/i, //loader
              use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,  // images format
                type: 'asset/resource',
              },
              {
                test: /\.s[ac]ss$/i,   // sass
                use: [
                  //`style` nodes from JS strings
                  MiniCssExtractPlugin.loader, "css-loader", "sass-loader", // minimize
                ],
              },
          ],
    },
    
    plugins:[new HtmlWebpackPlugin(),new MiniCssExtractPlugin(),
      new CssMinimizerPlugin()
    ],
          optimization: {
            minimizer: [
              "...", //terser minimize
              new ImageMinimizerPlugin({
                minimizer: {
                  implementation: ImageMinimizerPlugin.imageminMinify,
                  options: {
                    // Lossless optimization with custom option
                    plugins: [
                      ["gifsicle", { interlaced: true }],
                      [ "mozjpeg",{ quality: 60}],
                      ["optipng", { optimizationLevel: 5 }],
                      [
                        "svgo",
                        {
                              name: 'preset-default',
                              params: {
                                overrides: {
                                  convertShapeToPath: {
                                    convertArcs: true  //  plugin options
                                  },
                                  
                                  convertPathData: false // disable plugins
                                }
                              }
                        }
                      ],
                    ],
                  },
                },
              }),
            ],
          }
       
}