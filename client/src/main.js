// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import store from './store/store'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
// 项目公用样式
import '@/assets/css/style.css';
import VueSocketio from 'vue-socket.io';
import {
  imgBaseUrl,
  fileBaseUrl,
  fileUploadUrl,
  fileDownloadUrl
} from './config/config.js'

// Vue.use(VueSocketio, '127.0.0.1:3000');
Vue.use(VueSocketio, '47.93.34.145:3000');

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // config.url = 'http://localhost:8080' + config.url;
  config.url = 'http://47.93.34.145:3000' + config.url;
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

Vue.use(ElementUI)

Vue.config.productionTip = false;

store.commit('setBaseUrl', {
  imgBaseUrl: imgBaseUrl,
  fileBaseUrl: fileBaseUrl,
  fileUploadUrl: fileUploadUrl,
  fileDownloadUrl: fileDownloadUrl
})

Vue.prototype.axios = axios
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  sockets: { // 将（socket.on）绑定事件放在sockets中
    connect: function () {
      console.log('socket connected')
    },
    customEmit: function (val) {
      console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    }
  },
  components: { App },
  template: '<App/>'
})
