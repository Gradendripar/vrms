import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    Authorization: localStorage.getItem("Authorization")
      ? localStorage.getItem("Authorization")
      : "",
    userInfo: JSON.parse(localStorage.getItem("userInfo")) || {}
  },
  mutations: {
    changeLogin(state, user) {
      state.Authorization = user.Authorization;
      localStorage.setItem("Authorization", user.Authorization);
    },
    setUserInfo(state, userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo)); //将传递的数据先保存到localStorage中
      state.userInfo = userInfo; // 之后才是修改state中的状态
    }
  },
  actions: {},
  modules: {}
});
