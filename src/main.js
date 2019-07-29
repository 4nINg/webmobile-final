import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import axios from "axios";
import cheerio from "cheerio";
import firebase from "firebase";

Vue.use(axios);
Vue.use(cheerio);
Vue.config.productionTip = false
Vue.prototype.$http = require('axios');

new Vue({
    router,
    store,
    render: h => h(App),
    created(){
      firebase.auth().onAuthStateChanged((firebaseUser) => {
          if (firebaseUser) {
              store.dispatch('autoSignIn', firebaseUser)
          }
      })
    }
}).$mount("#app");
