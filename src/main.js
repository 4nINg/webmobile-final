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
                //유저가 로그인 하게 되면
                firebase.firestore().collection("registeredToken").get().then((snapshot) => {
                  snapshot.forEach((docs)=> {
                    if(docs.data().uid === firebaseUser.uid) {
                      //로그인한 유저가 이전에 알람을 허용했는지 안했는지 확인해서 알맞은 버튼 활성화.
                      if(docs.data().alarmPermission) {
                        //console.log("alarmok");
                        document.querySelector('#SubscribeBtn').style = 'display:none';
                        document.querySelector('#SubscribeCancel').style = 'display:visible';
                      }else {
                        //console.log("alarmno")
                        document.querySelector('#SubscribeBtn').style = 'display:visible';
                        document.querySelector('#SubscribeCancel').style = 'display:none';
                      }
                    }
                  })
                });

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
                    if (firebaseUser.email == "admin@admin.com") {
                        document.querySelector("#adminPageBtn").style.display = "block";
                    } else {
                        document.querySelector("#adminPageBtn").style.display = "none";
                    }
                })
            } else {
                console.log("비로그인 상태")
                document.querySelector("#adminPageBtn").style.display = "none";
                //로그아웃을 하면 구독,취소 버튼 비활성화.
                document.querySelector('#SubscribeCancel').style = 'display:none';
                document.querySelector('#SubscribeBtn').style = 'display:none';
            }
        })
    }
}).$mount("#app");
