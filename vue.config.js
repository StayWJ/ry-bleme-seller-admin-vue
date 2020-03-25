const webpack = require('webpack')
module.exports = {
  //部署应用包时的基本 URL
  publicPath: process.env.NODE_ENV === 'production' ? '/selleradmin/' : './',
  //当运行 vue-cli-service build 时生成的生产环境构建文件的目录
  outputDir: 'dist',
  //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir: 'assets',
  // eslint-loader 是否在保存的时候检查 安装@vue/cli-plugin-eslint有效
  lintOnSave: true,
  //是否使用包含运行时编译器的 Vue 构建版本。设置true后你就可以在使用template
  runtimeCompiler: true,
  // 生产环境是否生成 sourceMap 文件 sourceMap的详解请看末尾  
  productionSourceMap: true,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
  },
  // webpack-dev-server 相关配置
  devServer: { // 设置代理
    hot: true, //热加载
    host: '0.0.0.0', //ip地址
    port: 8085, //端口
    https: false, //false关闭https，true为开启
    open: false, //自动打开浏览器
    disableHostCheck: true,
    proxy: {
        '/api': { //本地 
            target: 'https://127.0.0.1:443/sell/seller',
            // 如果要代理 websockets
            // ws: true,
            changeOrigin: true,
            pathRewrite: {
              '^/api': ''
            },
        },
    }
  },
  pluginOptions: { // 第三方插件配置
    // ...
  }
}