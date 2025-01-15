import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from 'path'

export default {
  mode: "production",
  entry: {
    react: "./src/index.tsx"
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: path.resolve("manifest.json"), to: path.resolve('dist') },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                '@babel/preset-env',
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
    extensions: ['.js', '.jsx', '.tsx', '.css']
  }
};
