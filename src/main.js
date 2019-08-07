import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import axios from "axios";
import cheerio from "cheerio";
import firebase from "firebase";
import FirebaseService from "./services/FirebaseService";
import VueAxios from 'vue-axios';


Vue.use(axios, VueAxios);
Vue.use(cheerio);
Vue.config.productionTip = false
Vue.config.devtools = true
Vue.prototype.$http = require('axios');

new Vue({
    router,
    store,
    render: h => h(App),
    created() {
        firebase.auth().onAuthStateChanged((firebaseUser) => {
            // FirebaseService.getUserList();
            if (firebaseUser) {
                var user;
                firebaseUser.getIdTokenResult().then(idTokenResult => {
                    user = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email == null ? "등록된 email 없음" : firebaseUser.email,
                        username: firebaseUser.displayName,
                        grade: idTokenResult.claims.grade == null || idTokenResult.claims.grade == "undefined" ?
                            3 : idTokenResult.claims.grade
                    }
                    store.dispatch('autoSignIn', user)
                    if (idTokenResult.claims.grade == 1) {
                        document.querySelector("#adminPageBtn").style.display = "block";
                    } else {
                        document.querySelector("#adminPageBtn").style.display = "none";
                    }
                })
            } else {
                console.log("비로그인 상태")
                document.querySelector("#adminPageBtn").style.display = "none";
            }
        })
    }
}).$mount("#app");
