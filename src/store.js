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

// const adminToken = "zIXgFiNwlngXjgPStvgJH8pm18H3"

export default new Vuex.Store({
  state: {
    accessToken: '',
    user: {
        email: "",
        userName: ""
    },
    error: null,
    loading: false
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
    },
    setAccessToken(state, payload){
        state.accessToken = payload
    }
  },
  actions: {
    // 생성과 로그인 동시에...
    userSignUp({ commit }, payload) {
        commit('setLoading', true)
        var currentUser;
        firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
            .then(firebaseUser => {
                commit('setUser', { email: firebaseUser.user.email })
                commit('setLoading', false)
                commit('setError', null),
                commit('setAccessToken', firebaseUser.user.uid)
                currentUser = firebase.auth().currentUser;

                currentUser.updateProfile({
                    displayName: payload.username
                }).then(function() {
                    // FirebaseService.createUserLog(currentUser.uid, currentUser.email)
                    alert("반갑습니다.\n" + currentUser.displayName + "님 회원가입되었습니다.");
                })
            })
            .catch(error => {
                commit('setError', error.message)
                alert(error.message)
                commit('setLoading', false)
            })
    },
    // 일반 로그인
    userSignIn({ commit }, payload) {
        var temp = '';
        var currentUser;
        commit('setLoading', true)
        firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
            .then(firebaseUser => {
                commit('setUser', { email: firebaseUser.user.email })
                commit('setLoading', false)
                commit('setError', null)
                commit('setAccessToken', firebaseUser.user.uid)
                currentUser = firebase.auth().currentUser;
                // FirebaseService.mgrUserLog(currentUser.uid, currentUser.email)
                alert("반갑습니다.\n" + currentUser.displayName + "님 로그인되었습니다.");
            })
            .catch(error => {
                commit('setError')
                alert(error.message)
                commit('setLoading', false)
            })
    },
    //google login
    userSignInWithGoogle({ commit }, payload) {
        var temp = '';
        var currentUser;
        commit('setLoading', true)
        firebase.auth().signInWithPopup(google_provider)
            .then(firebaseUser => {
                commit('setUser', { email: firebaseUser.user.email})
                commit('setLoading', false)
                commit('setError', null)
                commit('setAccessToken', firebaseUser.user.uid)
                currentUser = firebase.auth().currentUser;
                // FirebaseService.mgrUserLog(currentUser.uid);
                console.log(currentUser);
                alert("반갑습니다.\n" + currentUser.displayName + "님 Google 아이디로 로그인되었습니다.");
            })
            .catch(err => {
                alert("에러: " + err.message);
            })
    },
    //facebook login
    userSignInWithFacebook({ commit }, payload) {
        var temp = '';
        var currentUser;
        commit('setLoading', true)
        firebase.auth().signInWithPopup(facebook_provider)
            .then(firebaseUser => {
                commit('setUser', { email: firebaseUser.user.email })
                commit('setLoading', false)
                commit('setError', null)
                commit('setAccessToken', firebaseUser.user.uid)
                currentUser = firebase.auth().currentUser;
                // FirebaseService.createUserLog(currentUser.uid)
                // FirebaseService.mgrUserLog(currentUser.uid);
                alert("반갑습니다.\n" + currentUser.displayName + currentUser.uid + "님 Facebook 아이디로 로그인되었습니다.");
            })
            .catch(err => {
                alert("에러: " + err.message);
            })
    },

    autoSignIn({ commit }, payload) {
        // console.log(payload)
        commit('setUser', { email: payload.email, userName: payload.displayName })
    },

    userSignOut({ commit }) {
        var currentUser = firebase.auth().currentUser;
        firebase.auth().signOut().then(() => {
            commit('setUser', null);
            commit('setAccessToken', null);
            // FirebaseService.changeLogoutTime(currentUser.uid);
        }).finally(()=>{
          alert("로그아웃 완료");
        })
    }
  },
  getters: {
      isAuthenticated(state) {
          return state.user !== null && state.user !== undefined
      }
  }
})
