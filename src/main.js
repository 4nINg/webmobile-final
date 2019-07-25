import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import axios from "axios";
import cheerio from "cheerio";

Vue.use(axios);
Vue.use(cheerio);
Vue.config.productionTip = false
Vue.prototype.$http = require('axios');

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
