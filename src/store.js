import Vue from 'vue'
import Vuex from 'vuex'
import FirebaseService from './services/FirebaseService'
import firebase from 'firebase'

Vue.use(Vuex)

var google_provider = new firebase.auth.GoogleAuthProvider();
google_provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
google_provider.setCustomParameters({
    display: "popup"
});

var facebook_provider = new firebase.auth.FacebookAuthProvider();
facebook_provider.addScope("public_profile");
facebook_provider.setCustomParameters({
    display: "popup"
});

export default new Vuex.Store({
  state: {
    user: null,
    error: null,
    loading: false,
  },
  mutations: {
    setUser(state, payload) {
        state.user = payload
    },
    setError(state, payload) {
        state.error = payload
    },
    setLoading(state, payload) {
        state.loading = payload
    }
  },
  actions: {
    // 회원가입
    userSignUp({ commit }, payload) {
        commit('setLoading', true)
        firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(firebaseUser => {
          firebase.auth().currentUser.updateProfile({
            displayName: payload.username
          }).then(function(){
            commit('setUser', { email: firebaseUser.user.email,
                                username: firebaseUser.user.displayName,
                                grade: 3,
                                uid: firebaseUser.user.uid });
            commit('setLoading', false);
            commit('setError', null);
            FirebaseService.setUserGrade(firebaseUser.uid, 3);
            alert("반갑습니다.\n" + payload.username + "님 회원가입되었습니다.");
          })
        })
        .catch((err) => {
          commit('setError', err.message)
          alert("일반회원가입 에러 => " + err)
          commit('setLoading', false)
        })
    },
    // 페이지 refresh 시에 세션 확인 후 '자동 로그인'
    autoSignIn({ commit }, payload) {
        commit('setUser', { email: payload.email, username: payload.username, grade: payload.grade, uid: payload.uid });
        commit('setLoading', false);
        commit('setError', null);
        // console.log("autoSignIn 페이로드 => email : " + payload.email + " username : " + payload.username + " token : " + payload.uid + " grade : " + payload.grade )
    },
    // 로그아웃
    userSignOut({ commit }) {
        const messaging = firebase.messaging();
        var currentUser = firebase.auth().currentUser;
        commit('setLoading', true);
        firebase.auth().signOut().then(() => {
            commit('setUser', null);
            commit('setLoading', false);
            alert("로그아웃 완료!");
            return messaging.getToken();
        })
        .then(function(token) {
          //실시간 데이터 베이스, 현재 토큰값과 비교후 삭제.
          firebase.database()
          .ref('connectedUsers/')
          .once('value', function(snapshot) {
            snapshot.forEach(function(data) {
              if(data.val().uToken === token){
                firebase.database().ref('connectedUsers/' + currentUser.email.split("@")[0]).remove();
              }
            })

          })
        })

    },
    // 일반 로그인
    userSignIn({ commit }, payload) {
        commit('setLoading', true);
        firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
            .then(firebaseUser => {

                firebaseUser.user.getIdTokenResult().then(idTokenResult => {
                    commit('setUser', {
                        uid : firebaseUser.user.uid,
                        email : firebaseUser.user.email,
                        username : firebaseUser.user.displayName,
                        grade : idTokenResult.claims.grade
                    });
                    commit('setLoading', false);
                    alert("반갑습니다.\n" + this.state.user.username + "님 로그인되었습니다.");
                })

                const messaging = firebase.messaging();
                return messaging.getToken();
            })
            .then(function(token) {
              //realtime database에 로그인된 사용자 Web Token값 넣기
              firebase.database().ref('connectedUsers/' + firebase.auth().currentUser.email.split("@")[0]).set({
                uToken : token
              });
            })
            .catch(error => {
                commit('setError', true);
                alert("일반 로그인 에러: " + error);
                commit('setLoading', false);
            })

    },
    //google 로그인
    userSignInWithGoogle({ commit }, payload) {
        var currentUser;
        commit('setLoading', true)
        firebase.auth().signInWithPopup(google_provider)
            .then((result) => {
                currentUser = result.user;
                currentUser.getIdTokenResult().then(idTokenResult => {
                    if(idTokenResult.claims.grade == 'undefined' || idTokenResult.claims.grade == null){
                        //setUserGrade 해줘야함
                        FirebaseService.setUserGrade(currentUser.uid, 3);
                    }
                })

                alert("반갑습니다.\n" + currentUser.displayName + "님 Google 아이디로 로그인되었습니다.");
                const messaging = firebase.messaging();
                return messaging.getToken();
            })
            .then(function(token) {
              firebase.database().ref('connectedUsers/' + firebase.auth().currentUser.email.split("@")[0]).set({
                uToken : token
              });
            })
            .catch(err => {
                commit('setError', true);
                alert("구글 로그인 에러: " + err.message);
                commit('setLoading', false);
            })

    },
    //facebook 로그인
    userSignInWithFacebook({ commit }, payload) {

        var temp = '';
        var currentUser;
        commit('setLoading', true)
        firebase.auth().signInWithPopup(facebook_provider)
            .then(result => {
                currentUser = result.user;
                currentUser.getIdTokenResult().then(idTokenResult => {
                    if(idTokenResult.claims.grade == 'undefined' || idTokenResult.claims.grade == null){
                        //setUserGrade 해줘야함
                        FirebaseService.setUserGrade(currentUser.uid, 3);
                    }
                })


                alert("반갑습니다.\n" + currentUser.displayName + "님 Facebook 아이디로 로그인되었습니다.");
                const messaging = firebase.messaging();
                return messaging.getToken();
            })
            .then(function(token) {
              firebase.database().ref('connectedUsers/' + firebase.auth().currentUser.email.split("@")[0]).set({
                uToken : token
              });
            })
            .catch(err => {
                commit('setError', true);
                alert("페이스북 로그인 에러: " + err.message);
                commit('setLoading', false);
            })

    },
  },
  getters: {
      isAuthenticated(state) {
          //현재 로그인한 계정이 있는지 체크(true/false)
          return state.user !== null && state.user !== undefined
      }
  }
})
