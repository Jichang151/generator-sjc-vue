"use strict";

import {VueConstructor} from 'vue'
import axios, {AxiosRequestConfig} from "axios";

const CancelToken = axios.CancelToken

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config: AxiosRequestConfig = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  timeout: 15 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(res) {
    // Do something with response data
    return res.data;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

export default {
  install: function(Vue:VueConstructor) {
    window.axios = _axios;
    Vue.$axios = _axios;

    // Vue.prototype.$axios = _axios; OR
    Object.defineProperties(Vue.prototype, {
      $axios: {
        get() {
          return _axios;
        }
      }
    });
  }
}