const Generator = require('yeoman-generator')

module.exports = class extends Generator{
  prompting () {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'your project name',
        default: this.appname
      }
    ]).then(answers => {
      this.answers = answers
    })
  }
  writing () {
    //  把每一个文件都通过模板转换到目标路径
    const templates = [
      'babel.config.js',
      'package.json',
      'README.md',
      'tsconfig.json',
      'vue.config.js',
      'public/index.html',
      'src/assets/logo.png',
      'src/js/Utils.ts',
      'src/plugins/axios.ts',
      'src/plugins/filters.ts',
      'src/plugins/index.ts',
      'src/router/index.ts',
      'src/.eslintrc.js',
      'src/app.ts',
      'src/App.vue',
      'src/declare.d.ts',
    ]
    templates.forEach(item => {
      // 为每一个模板生成他在目标目录中的对应文件
      this.fs.copyTpl(
        this.templatePath(item),
        this.destinationPath(item),
        this.answers
      )
    })
  }
}