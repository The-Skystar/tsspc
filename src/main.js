// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'
import ElementUI from 'element-ui'
import './assets/css/theme-green/index.css'
import './assets/css/theme-green/icon.css'
import './components/common/directives'
import 'babel-polyfill'
import  Qs from 'querystring'

Vue.config.productionTip = false
Vue.prototype.$axios = Axios
Vue.config.productionTip = false
Vue.prototype.qs = Qs
// Vue.use(Axios)
Vue.use(ElementUI, {
  size: 'small'
})
Axios.defaults.baseURL = '/api'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
