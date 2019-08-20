require = require("esm")(module)
const { pugFilters } = require("./src/plugins/render");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { DefinePlugin } = require('webpack');
const dree = require("dree");

module.exports = {
  publicPath: "",
  configureWebpack(webpackConfig) {
    for (const rule of webpackConfig.module.rules) {
      if (rule.use) {
        for (const use of rule.use) {
          if (/pug/.test(use.loader)) {
            use.options = {filters: pugFilters};
          }
        }
      } else if (rule.oneOf) {
        for (const oneOf of rule.oneOf) {
          if (oneOf.use) {
            for (const use of oneOf.use) {
              if (/pug/.test(use.loader)) {
                use.options = {filters: pugFilters};
              }
            }
          }
        }
      }
    }

    webpackConfig.plugins.push(...[
      // new DefinePlugin({
      //   "POSTS": JSON.stringify(dree.scan("public/posts"))
      // }),
      new CopyWebpackPlugin([
        "README.md"
      ])
    ])
  }
}