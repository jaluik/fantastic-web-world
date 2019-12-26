const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
let subDir = process.argv[process.argv.length - 1];
subDir = subDir.split("=")[1];
let entryPath = path.join(__dirname, "css-world", subDir);

module.exports = {
  entry: path.join(entryPath, "index.js"),
  output: {
    path: path.join(__dirname, "dist"),
    filename: "index_bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    hot: true,
    port: "8080"
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 正则匹配以.css结尾的文件
        use: ["style-loader", "css-loader"] // 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
      },
      {
        test: /\.(scss|sass)$/, // 正则匹配以.scss和.sass结尾的文件
        use: ["style-loader", "css-loader", "sass-loader"] // 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(entryPath, "index.html")
    })
  ]
};
