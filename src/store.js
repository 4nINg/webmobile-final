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

const adminToken = "zIXgFiNwlngXjgPStvgJH8pm18H3"

export default new Vuex.Store({
    state: {
        accessToken: "0",
        user: {
            email: "",
            username: "",
            grade: 0
        },
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
        },
        setAccessToken(state, payload) {
            state.accessToken = payload
            sessionStorage.setItem("accessToken", payload)
        }
    },
    actions: {
        // 생성과 로그인 동시에...
        userSignUp({ commit }, payload) {
            commit('setLoading', true)
            var currentUser;
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                .then(firebaseUser => {
                    commit('setUser', { email: firebaseUser.user.email, username: firebaseUser.user.username, grade: 3 })
                    commit('setLoading', false)
                    commit('setError', null)
                    commit('setAccessToken', firebaseUser.user.uid)

                    currentUser = firebase.auth().currentUser;

                    currentUser.updateProfile({
                        displayName: payload.username
                    }).then(function() {
                        //uid(식별자), email(사용자 계정), displayName(유저네임 - 닉네임)
                        FirebaseService.createUserInfo(currentUser.uid, currentUser.email, currentUser.displayName);
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
                    FirebaseService.mgrUserInfoLog(currentUser);
                    alert("반갑습니다.\n" + currentUser.displayName + "님 로그인되었습니다." + this.state.accessToken);
                    // window.location.reload();
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
                .then((result) => {
                    currentUser = result.user;
                    commit('setUser', { email: currentUser.email, username: currentUser.displayName })
                    commit('setLoading', false)
                    commit('setError', null)
                    commit('setAccessToken', currentUser.uid)
                        // FirebaseService.createUserInfo(currentUser.uid, currentUser.email, currentUser.email)
                    FirebaseService.mgrUserInfoLog(currentUser);
                    alert("반갑습니다.\n" + currentUser.displayName + "님 Google 아이디로 로그인되었습니다.");
                    window.location.reload();
                })
                .catch(err => {
                    alert("구글 로그인 에러: " + err.message);
                })
        },
        //facebook login
        userSignInWithFacebook({ commit }, payload) {
            var temp = '';
            var currentUser;
            commit('setLoading', true)
            firebase.auth().signInWithPopup(facebook_provider)
                .then(result => {
                    currentUser = result.user;
                    commit('setUser', { email: currentUser.email, username: currentUser.displayName })
                    commit('setLoading', false)
                    commit('setError', null)
                    commit('setAccessToken', currentUser.uid)
                        // FirebaseService.createUserInfo(currentUser.uid, currentUser.email, currentUser.email)
                    FirebaseService.mgrUserInfoLog(currentUser);
                    alert("반갑습니다.\n" + currentUser.displayName + "님 Facebook 아이디로 로그인되었습니다.");
                    window.location.reload();
                })
                .catch(err => {
                    alert("페이스북 로그인 에러: " + err.message);
                })
        },
        autoSignIn({ commit }, payload) {
            // console.log(payload)
            commit('setUser', { email: payload.email, username: payload.displayName })
        },
        userSignOut({ commit }) {
            // var currentUser = firebase.auth().currentUser;
            firebase.auth().signOut().then(() => {
                commit('setUser', null);
                commit('setAccessToken', "0");
                alert("로그아웃 완료1 : " + this.state.accessToken);
                FirebaseService.changeLogoutTime(this.state.accessToken);
                alert("로그아웃 완료2")
            })
        },
        checkIsAdmin({ commit }) { //Admin 페이지 접근 시 세션 확인
            var check = false;
            if (state.accessToken == adminToken && state.grade == 1) {
                check = true;
            } else {
                check = false;
            }
            return check;
        },
        initLoginInfo({ commit }) { //사이트 입장 시 세션에 따른 로그인 정보 초기화
            var info = FirebaseService.getUserInfoByUid(sessionStorage.getItem("accessToken")); //object로 들어옴
            alert("initLoginInfo : " + info)
            if (info == null) {
                commit('setUser', null);
                commit('setAccessToken', "0");
                commit('setLoading', false)
                commit('setError', null)
            } else {
                commit('setUser', { email: info.id, name: info.name, grade: info.grade })
                commit('setLoading', false)
                commit('setError', null)
                commit('setAccessToken', info.uid)
            }
        }
    },
    getters: {
        isAuthenticated(state) {
            return state.user !== null && state.user !== undefined
        }
    }
})