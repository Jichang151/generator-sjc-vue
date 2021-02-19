module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    // 注意：配置 babel-plugin-import 插件后将不允许导入所有组件
    ["import", {
      "libraryName": "mint-ui",
      "style": name => `${name}/style.css`
    }, "mint-ui"],
    ["import", {
      "libraryName": "vant",
      "libraryDirectory": "es",
      "style": true
    }, "vant"]
  ]
}
