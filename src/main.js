// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import axios from 'axios'
import { Message } from 'element-ui';
import locale from 'element-ui/lib/locale/lang/zh-TW'

axios.defaults.baseURL = 'http://localhost:3000/'
// axios 請求攔截器
axios.interceptors.request.use(config => {
  // console.log(config);
  // 在每一次發出請求時都在header區段加入Authorization的設定
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
Vue.prototype.$http = axios
Vue.prototype.$message = Message

Vue.config.productionTip = false

Vue.use(ElementUI,{locale});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
