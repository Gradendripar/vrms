module.exports = {
  // 公共路径(必须有的)
  publicPath: "./",
  // 输出文件目录
  outputDir: "dist",
  // 静态资源存放的文件夹(相对于ouputDir)
  assetsDir: "static",
  // eslint-loader 是否在保存的时候检查(果断不用，这玩意儿我都没装)
  lintOnSave: false,
  // 我用的only，打包后小些
  productionSourceMap: true, // 不需要生产环境的设置false可以减小dist文件大小，加速构建
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  pwa: {
    iconPaths: {
      favicon32: "favicon.ico",
      favicon16: "favicon.ico",
      appleTouchIcon: "favicon.ico",
      maskIcon: "favicon.ico",
      msTileImage: "favicon.ico"
    }
  },
  // devServer: {
  //   /* before: require("src/mock/index.js"), //引入MOCK/index.js */
  //   overlay: {
  //     // 让浏览器 overlay 同时显示警告和错误
  //     warnings: true,
  //     errors: true
  //   },
    // /* host: "localhost",
    //   port: 8080, // 端口号 */
    // https: false, // https:{type:Boolean}
    // open: false, //配置后自动启动浏览器
    // hotOnly: true, // 热更新
    // /* changeOrigin: true, */
    // /* proxy: "http://10.0.1.77:8880" // 配置跨域处理, */
    // /* proxy: "http://172.20.10.9:8880" // 配置跨域处理, */
    // /* proxy: "http://172.17.174.49:8880" */
    // /* proxy: "http://10.13.138.44:8880" */
    // /* proxy: "http://192.168.43.73:8880", */
    // proxy: "http://localhost:8880"
    // /* proxy: "http://localhost:8880" // 配置跨域处理, */
  // }
};
