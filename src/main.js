import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router/index'
import './plugins/element.js'
import Http from './api/Http'
import createVuexAlong from 'vuex-along'
Vue.use(Vuex)

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    seller: {
      sellerId: null,
    },
  },
  mutations: {
    setSellerId(state, id) {
      state.seller.sellerId = id
    }
  },
  plugins: [
    createVuexAlong({
      // 设置保存的集合名字，避免同站点下的多项目数据冲突
      name: "rybleme",
      session: {
        // 保存模块 ma 中的 a1 到 sessionStorage
        list: ["seller"],
      },
      // 仅使用session
      justSession: true
    }),
  ],
})

Vue.prototype.$Http = Http;
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
