//断言
export function assert (condition:any, errorMessage:string) {
  if (!condition) throw new Error(errorMessage);
}

const chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "m", "n", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
/**
 * 生成随机字符串（首位不为数字）
 * @param len
 * @return {string} 数字和字符
 */
export const RandomCode = function (len = 8):string {
  let n = chars.length;
  let code = '';
  if (len <= 0) len = 8;
  while (len > 0) {
    let index = code == '' ?
      (10 + Math.floor(Math.random() * (n - 10))) :
      Math.floor(Math.random() * n);
    code += chars[index];
    len--;
  }
  return code;
};

/**
 * 获取全局唯一ID
 */
export const getUUID = function ():string {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
}

let JSONP_COUNT = 0;
/**
 * jsonp
 * @param {string} url 
 * @param {object} params 请求参数
 * @param {string} callback 默认值：callback
 * @param {string} timeout 默认值：15000
 * @param {string} cache 默认值：false
 */
export const jsonp = async (opts:any):Promise<any> => {
  if(!opts.url) throw new Error("url is null or not defined");
 
  let id = `__AxiosJsonpCallback_${JSONP_COUNT++}`;
  let target:any = document.getElementsByTagName('script')[0] || document.head;
  let script:any, timer:number;

  function cleanup() {
    if (script && script.parentNode) script.parentNode.removeChild(script);
    delete (window as any)[id];
    if (timer) clearTimeout(timer);
  }

  return new Promise(function(resolve, reject){
    //超时处理
    timer = setTimeout(function() {
      cleanup();
      reject(new Error('Request timed out'));
    }, (opts.timeout || 15000));
    //定义回调函数
    (window as any)[id] = function(res:any){
      cleanup();
      resolve(res);
    }
    //请求参数处理
    let kvs = [];
    kvs.push(`${opts.callback||"callback"}=${encodeURIComponent(id)}`);
    if(opts.params && typeof opts.params === 'object') {
      for(let k in opts.params) {
        let v = opts.params[k];
        if(v===null) continue;
        kvs.push(`${k}=${encodeURIComponent(v)}`);
      }
    }
    if(!opts.cache) kvs.push(`t=${new Date().getTime()}`);
    let url = opts.url + (opts.url.indexOf("?")===-1?"?":"&") + kvs.join("&");
    //脚本引用
    script = document.createElement("script");
    script.src = url;
    target.parentNode.insertBefore(script, target);
  });
}

/**
 * 动态加载远程JS
 * @param {string} src 远程JS文件URL地址
 * @param {number} timeout 加载超时时间。单位毫秒。默认5000毫秒超时
 */
export const loadjs = async (src:string, timeout=5000):Promise<void> => {
  return new Promise((resolve, reject)=> {
    let target:any = document.getElementsByTagName('script')[0] || document.head;
    let script:any = document.createElement("script");
    script.setAttribute("type","text/javascript");
    // script.setAttribute("crossorigin","anonymous");
    let t = setTimeout(()=>{
      console.error("脚本加载超时");
      reject(new Error(`脚本【${src}】加载超时`));
    }, timeout);
    //IE
    script.onreadystatechange = function() {
      console.log("script onreadystatechange");
      if(this.readyState == "loaded" || this.readyState == "complete") {
        clearTimeout(t); 
        resolve();
      }
    };
    //Opera、FF、Chrome等
    script.onload = function() {
      console.log("script onload");
      clearTimeout(t); 
      resolve(); 
    }
    script.setAttribute("src", src); 
    target.parentNode.insertBefore(script, target);
  });
}

/**
 * 将传统callback方法转化为promise方法
 * @param {function} original
 */
export const promisify= function(original:Function) {
  return function (...args:Array<any>) {
    return new Promise((resolve, reject) => {
      if (typeof original != "function") throw Error("original is not function");
      let callback = function (err:Error, ...values:Array<any>) {
        if(values.length===0 && !(err instanceof Error)) return resolve(err);
        if (err) return reject(err);
        values.length === 1 ? resolve(values[0]) : resolve(values);
      };
      args.push(callback);
      // Call the function.
      original.call(globalThis, ...args);
    });
  };
}

/**
 * 字符串长度（一个汉字算两个字符）
 * @param {string} str  字符串
 */
export const strLen2 = function (str:string):number {
  let chineseRegx = /[\u4e00-\u9fa5]/g, otherRegx = /[^\u4e00-\u9fa5]/g;
  let chinese  = str.match(chineseRegx) || [];
  let other = str.match(otherRegx) || [];
  let len = chinese.length * 2 + other.length;
  return len;
}

/**
 * 判断是否在微信中
 */
export const isWechat = function ():boolean {
  let ua = window.navigator.userAgent.toLowerCase();
  return /MicroMessenger/i.test(ua);
}

/**
 * 校验手机号
 */
export const isPhone = function (value:string):boolean {
  let reg = /^1([3456789])\d{9}$/;
  return reg.test(value);
}

/**
 * 校验手机号复杂版
 */
export const isPhone2 = function (value:string):boolean {
  let reg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[189])\d{8}$/;
  return reg.test(value);
}

/**
 * 校验邮箱
 */
export const isEmail = function (value:string):boolean {
  let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
  return reg.test(value);
}

/**
 * 校验车牌号
 */
export const isCarNumber = function (value:string):boolean {
  let reg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
  return reg.test(value);
}

/**
 * 校验网址
 */
export const isUrl = function (value:string):boolean {
  try { 
    return !!(new URL(value)); 
  } catch { 
    return false;
  }
}

/**
 * 校验信用卡卡号
 */
export const isCreditCardNo = function (code:string):boolean {
  if(!code || code.length<14) return false;
  let sum = 0;
  for(let i=1; i<=code.length; i++) {
    if(i % 2 === 0) {
      let n = parseInt(code.charAt(code.length-i), 32) * 2;
      sum += Math.floor((n / 10)) + (n % 10);
    } else {
      sum += parseInt(code.charAt(code.length-i), 32);
    }
  }
  return sum % 10 === 0;
}

/**
 * 判断是否Object对象
 * @param {any} obj
 */
export const isObject = function (obj:any):boolean {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
/**
 * 判断是否数组对象
 * @param {any} obj
 */
export const isArray = function (obj:any):boolean {
  return Object.prototype.toString.call(obj) === '[object Array]';
}
/**
 * 对象转数组
 * @param {any} obj
 */
export const object2Array = function(obj:any) : Array<any> {
  if(!obj) return [];
  return Object.keys(obj).reduce((r, name)=>{
    r.push({name, value:obj[name]});
    return r;
  }, [] as any[])
}
/**
 * 数组转对象
 * @param {any} obj
 */
export const array2Object = function(arr:Array<{name:string, value:any}>):any {
  if(!Array.isArray(arr)) return {};
  return arr.reduce((r, i)=>{
    i.name && (r[i.name] = i.value);
    return r;
  }, {} as any)
}

/**
 * 判断是否函数
 * @param {any} obj
 */
export const isFunction = function (obj:any):boolean {
  return obj && typeof obj === 'function';
}

/**
 * 深拷贝
 * @param {any} obj
 */
export const deepCopy = (obj:any):any => {
  if(obj===undefined) return undefined;
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 将script脚本转为JS对象
 * @param script string
 */
export const toJsObject = (script:string) => {
  return Function(`"use strict";return (${script});`)()
};

/**
 * 获取函数的形式参数列表
 */
export const getFunArgs = function(fn:Function):Array<string> {
  if(typeof fn !== 'object' && typeof fn !== 'function' ) throw new Error('fn不是函数对象');
  let r:any = /[^(]*\(([^)]*)\).*/.exec(fn.toString());
  if(!r[1] || !r[1].trim()) return [];
  return r[1].split(',').map((a:string)=>a.trim());
}

/**
 * 将querystring对象化
 * @param {string} querystring
 */
export const qs = function(querystring:string):any {
  if(!querystring) return {};
  querystring = querystring.replace(/(?:^.*\?)?(.*)/, '$1');
  return querystring.trim().split('&').reduce((s:any, item:string) => {
    let kv = item.split('=');
    kv[0].trim() && (s[kv[0].trim()] = decodeURIComponent(kv[1]||''));
    return s;
  }, {});
}

/**
 * 获取query参数值
 * @param {string} name 参数名
 */
export const getQueryParam = function (name:string):string|null {
  let reg = new RegExp("[?&]" + name + "(=[^&#]*)?(?:&|$|#)");
  let r = window.location.href.match(reg); //search,查询？后面的参数，并匹配正则
  if (r == null) return null;
  return r[1] ? decodeURIComponent(r[1].replace(/^=/, "")) : '';
}
/**
 * 向url地址中添加query请求参数
 * @param {string} url
 * @param {string} name
 * @param {string|number} value
 */
export const addQueryParam = function (url:string, name:string, value:string|number):string {
  url = url || '/';
  url += url.indexOf("?") === -1 ? "?" : "&";
  url += name;
  if (value) url += "=" + encodeURIComponent(value);
  return url;
}

/**
 * 获取/设置cookie
 * @param {string} name cookie名
 * @param {string} value 要设置的cookie值
 * @param {object} options 可选配置项 domain、path、expried等
 */
export const cookie = (name:string, value?:string, options?:any):string|void => {
  if (value != undefined) {
    // name and value given, set cookie
    options = options || {};
    if (value === null) {
      value = "";
      options.expires = -1;
    }
    let expires = "";
    if (options.expires && (typeof options.expires == "number" || options.expires.toUTCString)) {
      let date;
      if (typeof options.expires == "number") {
        date = new Date();
        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
      } else {
        date = options.expires;
      }
      expires = "; expires=" + date.toUTCString(); // use expires attribute, max-age is not supported by IE
    }
    let path = options.path ? "; path=" + options.path : "";
    let domain = options.domain ? "; domain=" + options.domain : "";
    let secure = options.secure ? "; secure" : "";
    document.cookie = [
      name,
      "=",
      encodeURIComponent(value),
      expires,
      path,
      domain,
      secure
    ].join("");
  } else {
    // only name given, get cookie
    if (document.cookie) {
      let cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].replace(/^\s+|\s+$/gm, '');
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == name + "=") {
          value = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return value || '';
  }
};

/**
 * 获取/设置sessionStorage
 */
export const sessionStorage = function(name:string, value?:any):any {
  if (value != undefined) {
    // set
    value ? window.sessionStorage.setItem(name, JSON.stringify(value)) : window.sessionStorage.removeItem(name);
  } else {
    // get
    let v = window.sessionStorage.getItem(name);
    return v ? JSON.parse(v) : '';
  }
}

/**
 * 获取/设置localStorage
 */
export const localStorage = function(name:string, value?:any):any {
  if (value != undefined) {
    // set
    value ? window.localStorage.setItem(name, JSON.stringify(value)) : window.localStorage.removeItem(name);
  } else {
    // get
    let v = window.localStorage.getItem(name);
    return v ? JSON.parse(v) : '';
  }
}

/**
 * 事件防抖
 * @param {Function} func 执行函数
 * @param {Number} delay 延时执行时间。在延时间隔内即使多次调用也保证事件只执行一次
 */
export const debounce = function (func:Function, delay:number=100):Function {
  let timeout:number;
  return function () {
    let context = globalThis;
    let args = arguments;
    let later = function () {
      func.apply(context, args);
    };
    timeout && clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
}
/**
 * 事件轮询
 * @param {Function} fn 执行函数。以函数返回值的true/false确定回调
 * @param {Function} fn_callback 成功回调
 * @param {Function} fn_timeout 超时回调
 * @param {Number} timeout 超时时间
 * @param {Number} interval 轮询间隔
 */
export const poll = function (fn:Function, fn_callback:Function, fn_timeout:Function, timeout:number=2000, interval:number=100):void {
  let end_time = Number(new Date()) + (timeout || 2000);
  interval = interval || 100;
  (function p() {
    // 如果条件满足，则执行！
    if (fn()) fn_callback();
    // 如果条件不满足，但并未超时，再来
    else if (Number(new Date()) < end_time) setTimeout(p, interval);
    // 不匹配且时间消耗过长，则拒绝！
    else fn_timeout(new Error('timed out for ' + fn + ': ' + arguments));
  })();
}
/**
 * 保证函数只执行一次
 * @param {Function} fn 执行函数
 * @param {Object} context 执行上下文，可空
 */
export const once = function (fn:Function|null, context:any):any {
  let result:any;
  return function () {
    if (fn) {
      result = fn.apply(context || globalThis, arguments);
      fn = null;
    }
    return result;
  };
}

/**
 * 等待xx毫秒
 * @param {Number} ms 等待毫秒数
 */
export const waiting = async function (ms:number):Promise<void> {
  return new Promise((resolve, reject) => {
    let t = setTimeout(() => {
      clearTimeout(t);
      resolve();
    }, ms);
  });
}

/**
 * 获取/设置对象属性值
 * @param {Object} obj 目标对象
 * @param {string} path 属性路径。eg. a.b.c
 * @param {string} value 设置值。不传则为获取属性值
 */
export const objectProperty = function (obj:any, path:string, value?:any):any {
  let props = path.replace(/\[(\1'|")?(\w+)\1?\]/g, '.$1').split(".");
  let last:string = props.pop() || '';
  for (let i = 0; i < props.length; i++) {
    let p = props[i];
    if (obj && Object.prototype.hasOwnProperty.call(obj, p)) {
      obj = obj[p];
    } else {
      return undefined;
    }
  }
  return value === undefined ? obj[last] : (obj[last] = value);
}

/**
 * 深度对象合并
 * 合并原则：
 *  相同属性名，相同类型将合并成员
 *  相同属性名，不同类型的将被覆盖
 * @param {Object} to 合并目标对象
 * @param {Object} from 合并源对象
 */
export const merge = function (to:any, from:any):any {
  if (!to || to.constructor != Object) return from;
  if (!from || from.constructor != Object) return to;
  for (var key in from) {
    if (Array.isArray(from[key]) && Array.isArray(to[key])) {
      to[key] = to[key].concat(from[key]);
    } else if (from[key].constructor === Object && to[key].constructor === Object) {
      to[key] = merge(to[key], from[key]);
    } else {
      to[key] = from[key];
    }
  }
  return to;
}

/**
* dataURL字符串转二进制
*/
export function dataURLtoBlob(dataurl:string) : Blob {
  let arr = dataurl.split(','),
  m = arr[0].match(/:(.*?);/);
  if(!m) throw new Error("dataurl格式不正确");
  let mime = m[1],
  bstr = atob(arr[1]),
  n = bstr.length,
  u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime
  });
}



