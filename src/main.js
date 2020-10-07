import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue } from 'bootstrap-vue'
import ElementUI from 'element-ui';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'

// Install BootstrapVue
Vue.use(BootstrapVue)
Vue.use(ElementUI);

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost:4000/api/'

new Vue({
  render: h => h(App),
}).$mount('#app')
