import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import plugins from './plugins'
Vue.config.productionTip = false;

Vue.use(plugins);

new Vue({
  router,
  store: store(true),
  render: h => h(App)
}).$mount('#app')
