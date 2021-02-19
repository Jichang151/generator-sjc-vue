const path = require('path');
const argv = require('yargs').argv
// const webpack = require('webpack')

//#region 根据参数构建配置信息
const configs = ((mode) => {
  let c = {
    publicPath: '/imp2/',
    outputDir: "dist/imp2",
    pages: {
      index: {
        entry: "src/app.ts",
        title: "互动营销平台 V2.0"
      }
    }
  };

  let template = argv.template;
  console.log("===> mode:", mode, "template:",template);
  
  if(mode==="production") {
    if(!!template) {
      c.publicPath = `/imp2/templates/${template}/`;
      c.outputDir = `dist/imp2/templates/${template}`;
      c.pages = {
        [template]: {
          entry: `src/templates/${template}/app.ts`,
          template: `src/templates/${template}/index.html`,
          filename: `index.html`
        }
      }
    }
  } else {
    template = template || "default";
    c.pages[template] = {
      entry: `src/templates/${template}/app.ts`,
      template: `src/templates/${template}/index.html`,
      filename: `templates/${template}/index.html`
    }
  }
  return c;
})(process.env.NODE_ENV)
//#endregion

module.exports = {
  pages: configs.pages,
  publicPath: configs.publicPath,
  outputDir: configs.outputDir,
  assetsDir: "static",
  filenameHashing: true,
  lintOnSave: "default", // boolean | 'warning' | 'default' | 'error'
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    // 需要 proxy 代理的接口（可跨域）
    proxy: {
      '/api/': {
          target: 'https://bt.qll-times.com',
          changeOrigin: true, // needed for virtual hosted sites
          ws: true // websockets代理
      }
    } 
  },
  runtimeCompiler: true,
  productionSourceMap: true,
  chainWebpack: function(config) {
    config.resolve.alias.set('@', path.resolve('src'));
    config.externals({
      "vue": "Vue",
      "axios": "axios",
      "vue-router": "VueRouter",
      "element-ui": "ElementUI",
      "jquery": "$",
    });

    //移除 prefetch、preload 插件
    // Object.keys(configs.pages).forEach(i => {
    //   config.plugins.delete(`prefetch-${i}`);
    //   config.plugins.delete(`preload-${i}`);
    // });
    
    //moment组件打包忽略本地化资源
    // config.plugin('ignore').use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)).end();
  },
  configureWebpack: config => {
    // console.log("configureWebpack===>", config)
  }
}