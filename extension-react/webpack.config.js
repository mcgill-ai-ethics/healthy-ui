import webpack from 'webpack'

import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

import path from 'path'
import Dotenv from 'dotenv-webpack'

export default {
  mode: "production",
  entry: {
    background: './src/background/background.ts',
    react: "./src/index.tsx",
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    clean: true
  },
  plugins: [
    new Dotenv({
      path: '../.env'
    }),
    new webpack.DefinePlugin({
      'process.env.BACKEND_API': JSON.stringify(path.resolve("env.BACKEND_API"))
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: path.resolve("manifest.json"), to: path.resolve('dist') },
        { from: 'src/assets/logo_v2.png', to: "assets" },
        { from: 'src/assets/icon16.png', to: 'assets' },
        { from: 'src/assets/icon32.png', to: 'assets' },
        { from: 'src/assets/icon48.png', to: 'assets' },
        { from: 'src/assets/icon128.png', to: 'assets' },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              path: 'assets/'
            }
          }
        ]
      },
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript',
                ['@babel/preset-react', { 'runtime': 'automatic' }]
              ]
            }
          }],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.png', '.jpg']
  }
};
