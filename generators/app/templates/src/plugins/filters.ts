import {VueConstructor} from 'vue'
import dayjs from 'dayjs'

export default {
  install: function(Vue:VueConstructor) {
    // 图片地址解析
    Vue.filter('imgUrlResolve', function(src:string){
      if(!src) return '';
      return /^https:\/\/?/.test(src) ? src : `//image.qll-times.com/${src}`;
    });

    //日期格式化
    Vue.filter('dateFormat', function(value:any, format:string){
      let d = dayjs(value).format(format || 'YYYY-MM-DD HH:mm:ss');
      return d;
    })

    // 互动活动状态名称
    Vue.filter('imaStatusName', function(value:number) {
      let name = "";
      switch (value) {
        case -1:
          name = "已删除";
          break;
        case 0:
          name = "未发布";
          break;
        case 1:
          name = "发布中";
          break;
        case 2:
          name = "已发布";
          break;
        case 3:
          name = "已关闭";
          break;
      }
      return name;
    });
  }
}