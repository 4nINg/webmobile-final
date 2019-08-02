import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import axios from "axios";
import cheerio from "cheerio";
import firebase from "firebase";
import FirebaseService from "./services/FirebaseService";

Vue.use(axios);
Vue.use(cheerio);
Vue.config.productionTip = false
Vue.config.devtools = true
Vue.prototype.$http = require('axios');

new Vue({
    router,
    store,
    render: h => h(App),
    created(){
      firebase.auth().onAuthStateChanged((firebaseUser) => {
        // console.log("user => " + this.$store.state.user);
        // console.log(FirebaseService.getUserInfo(firebaseUser));
          if (firebaseUser) {
              store.dispatch('autoSignIn', firebaseUser)
          }
          // else{
          //     alert("비로그인상태")
          // }
      })
    }
}).$mount("#app");
