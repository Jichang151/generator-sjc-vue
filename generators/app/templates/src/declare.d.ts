import { AxiosInstance } from 'axios'
import Dayjs from 'dayjs'
import {AbstractToast} from './js/Declares'

declare global {
  interface Window {
    axios: AxiosInstance,
    PUBLISHED: boolean,
    VERSION: string,
    BUSINESSID: string,
    ACTIVITYID: string,
    CONFIGS: any
  }
}

declare module 'vue/types/vue' {
  //prototype this.xxx
  interface Vue {
    $isEditing: boolean;
    $axios: AxiosInstance;
    $ebus: Vue;
    $toast: AbstractToast;
    $dayjs: Dayjs;

    //定义方法
    $query:(name:string) => string|null;

    $getValue:(name:string)=>any;
    $getValue:(name:string, options:any)=>any

    $setValue:(name:string, value:any)=>void;
    $setValue:(name:string, value:any, options:any)=>void;

    $toJsObject:(script:string|undefined|null) => any;
  }

  //static Vue.xxx
  interface VueConstructor {
    $isEditing: boolean;
    $axios: AxiosInstance;
    $ebus: Vue;
    $toast: AbstractToast;
    $dayjs: Dayjs;
  }
}