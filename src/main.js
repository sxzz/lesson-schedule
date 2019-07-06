import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import { DatetimePlugin, ToastPlugin } from 'vux'
import App from './App'
import router from './router'

Vue.use(VueRouter)
Vue.use(DatetimePlugin)
Vue.use(ToastPlugin)

FastClick.attach(document.body)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
