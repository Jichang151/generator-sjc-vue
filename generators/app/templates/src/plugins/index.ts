import {VueConstructor} from 'vue'
import axios from './axios';
import filters from './filters';
import components from './components';
import dayjs from 'dayjs';
import {AbstractToast} from '../js/Declares';

class Toast implements AbstractToast{
  private elm:any;
  constructor() {
    this.elm = (window as any).ELEMENT;
  }

  message(text:string, options?:any):void {
    this.elm.Message.info(Object.assign({}, options, {message: text}));
  }

  success(text:string, options?:any):void {
    this.elm.Message.success(Object.assign({}, options, {type:"success", message: text}));
  }

  error(text:string, options?:any):void {
    this.elm.Message.error(Object.assign({}, options, {type:"error",message: text}));
  }
}

export default {
  install: function(Vue:VueConstructor) {

    //定义事件总线, 并挂载到Vue实例上
    Vue.$ebus = Vue.prototype.$ebus = new Vue();
    Vue.$dayjs = Vue.prototype.$dayjs = dayjs;
    Vue.$toast = Vue.prototype.$toast = new Toast();

    axios.install(Vue);

    filters.install(Vue);

    components.install(Vue);
  }
}