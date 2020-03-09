import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import './plugins/element.js'
import Http from './api/Http'

Vue.config.productionTip = false

Vue.prototype.$Http = Http;
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
