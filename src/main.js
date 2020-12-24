import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Element from 'element-ui'
import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'
import './assets/styles/element-variables.scss'
// global css
import './assets/styles/index.scss'

import './assets/icons' // icon

Vue.config.productionTip = false

Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
