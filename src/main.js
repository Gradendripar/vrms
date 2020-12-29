import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementUI from "element-ui";
import ZkTable from "vue-table-with-tree-grid";
import axios from "axios";
import NProgress from "nprogress"; // 引入nprogress插件
import "nprogress/nprogress.css"; // 这个nprogress样式必须引入
// 挂载axios 到Vue的原型prototype的$http
axios.defaults.baseURL = "http://8.129.111.24:8880/";

Vue.prototype.$http = axios;
var instance = axios.create({
  timeout: 5000,
  headers: {
    "Content-Type":
      "multipart/form-data;boundary=---------------------------7d4a6d158c9"
  }
});
Vue.prototype.instance = instance;

// 设置请求的根路径
import "element-ui/lib/theme-chalk/index.css";
import echarts from "echarts"; //引入echarts
Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false;

import { hasPermission } from "./utils/permission";

NProgress.configure({ ease: "ease", speed: 500 });
NProgress.configure({ minimum: 0.3 });

const Plugins = [hasPermission];
Plugins.map(plugin => {
  Vue.use(plugin);
});

// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
  config => {
    NProgress.start();
    if (localStorage.getItem("Authorization")) {
      config.headers.Authorization = localStorage.getItem("Authorization");
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
instance.interceptors.request.use(
  config => {
    NProgress.start();
    if (localStorage.getItem("Authorization")) {
      config.headers.Authorization = localStorage.getItem("Authorization");
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  function(response) {
    NProgress.done();
    if (response.data.code == 4001) {
      //如果返回的code==4001说明token错误或者token过期
      window.localStorage.clear();
      // var vm=new Vue();
      // vm.$message.error("您的登入状态已失效,请您重新登入~")
      return router.push("/login");
    }
    if (response.data.code == 500) {
      this.$message.error("用户已禁用！！！！");
    } else {
      return response;
    }
  },
  function(error) {
    return Promise.reject(error);
  }
);

Vue.use(ElementUI);
Vue.use(ZkTable);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
