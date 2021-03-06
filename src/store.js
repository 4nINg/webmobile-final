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
                    }).then(function() {
                        commit('setUser', {
                            email: firebaseUser.user.email,
                            username: firebaseUser.user.displayName,
                            grade: 3,
                            uid: firebaseUser.user.uid
                        });

                        FirebaseService.setUserGrade(firebaseUser.uid, 3);
                        alert("반갑습니다.\n" + payload.username + "님 회원가입되었습니다.");
                        commit('setLoading', false);
                        commit('setError', null);
                        window.location.reload();

                        // 회원 목록에 저장.
                        firebase.firestore().collection('registeredToken').doc(firebase.auth().currentUser.uid).set({
                            uid: firebase.auth().currentUser.uid,
                            email: firebase.auth().currentUser.email,
                            token: null,
                            alarmPermission: false
                        });
                        // 현재 로그인된 사용자에 등록.
                        firebase.database().ref('connectedUsers/' + firebase.auth().currentUser.email.split("@")[0]).set({
                            uid: firebase.auth().currentUser.uid,
                            email: firebase.auth().currentUser.email
                        });
                    })
                })
                .catch((err) => {
                    commit('setLoading', false)
                    commit('setError', err)
                })
        },
        // 페이지 refresh 시에 세션 확인 후 '자동 로그인'
        autoSignIn({ commit }, payload) {
            commit('setUser', { email: payload.email, username: payload.username, grade: payload.grade, uid: payload.uid });
            commit('setLoading', false);
            commit('setError', null);
        },
        // 로그아웃
        userSignOut({ commit }) {
            var currentUser = firebase.auth().currentUser;

            commit('setLoading', true);
            firebase.auth().signOut().then(() => {
                commit('setUser', null);
                commit('setLoading', false);
                alert("로그아웃 완료!");

            }).catch(err => {
              commit('setLoading', false)
              commit('setError', err)
            })

            //접속 유저 DB에서 삭제
            firebase.database()
                .ref('connectedUsers/')
                .once('value', function(snapshot) {
                    snapshot.forEach((data) => {
                        if (data.val().uid === currentUser.uid) {
                            firebase.database().ref('connectedUsers/' + currentUser.email.split("@")[0]).remove();
                        }
                    })
                })
        },
        // 일반 로그인
        userSignIn({ commit }, payload) {
            var arrTemp = [];
            var flag = true;

            firebase.database()
              .ref('connectedUsers/')
              .once('value', function(snapshot){
                snapshot.forEach(function(doc) {
                    arrTemp.push(doc.val().email);
                })
                //return arrTemp;
              })
              .then(() => {
                for(var i in arrTemp) {
                  //console.log(arrTemp[i]);
                  if(arrTemp[i] === payload.email) {
                    flag = false;
                  }
                }
              })
              .then(() => {
                if(flag) {
                  commit('setLoading', true);
                  firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
                      .then(firebaseUser => {
                          firebaseUser.user.getIdTokenResult().then(idTokenResult => {
                              commit('setUser', {
                                  uid: firebaseUser.user.uid,
                                  email: firebaseUser.user.email,
                                  username: firebaseUser.user.displayName,
                                  grade: idTokenResult.claims.grade
                              });

                              // 현재 유저의 alarm 승인 여부를 확인 후, 승인됫다면 현재 웹의 토큰값을 받아와서 저장.
                              firebase.firestore()
                              .collection('registeredToken')
                              .doc(firebase.auth().currentUser.uid)
                              .get().then(function(doc) {
                                if(doc.data().alarmPermission) {
                                  firebase.messaging().getToken().then(function(currentToken) {
                                    firebase.firestore()
                                    .collection('registeredToken')
                                    .doc(firebase.auth().currentUser.uid)
                                    .update({
                                      token : currentToken
                                    });
                                  });
                                }
                              })
                              alert("반갑습니다.\n" + this.state.user.username + "님 로그인되었습니다.");

                          })
                          window.location.reload();
                          //commit('setLoading', false);
                          //로그인 유저 REALTIME DB에 저장.
                          firebase.database().ref('connectedUsers/' + firebase.auth().currentUser.email.split("@")[0]).set({
                              uid: firebase.auth().currentUser.uid,
                              email: firebase.auth().currentUser.email
                          });
                          window.location.reload();
                      })
                      .catch(err => {
                          commit('setLoading', false);
                          commit('setError', err);
                      })
                }else {
                  alert("이미 로그인 되어 있는 아이디입니다.")
                  commit('setLoading', false);
                }
              })
        },
        //google 로그인
        userSignInWithGoogle({ commit }, payload) {
            var currentUser;
            var arrTemp = [];
            var flag = true;

            firebase.database()
              .ref('connectedUsers/')
              .once('value', function(snapshot){
                snapshot.forEach(function(doc) {
                    arrTemp.push(doc.val().email);
                })
                return arrTemp;
              })
              .then(() => {
                for(var i in arrTemp) {
                  //console.log(arrTemp[i]);
                  if(arrTemp[i] === payload.email) {
                    flag = false;
                  }
                }
              })
              .then(() => {
                if(flag) {
                commit('setLoading', true)
                firebase.auth().signInWithPopup(google_provider)
                    .then((result) => {
                        currentUser = result.user;
                        currentUser.getIdTokenResult().then(idTokenResult => {
                            if (idTokenResult.claims.grade == 'undefined' || idTokenResult.claims.grade == null) {
                                //setUserGrade 해줘야함
                                FirebaseService.setUserGrade(currentUser.uid, 3);
                            }

                            // 현재 유저의 alarm 승인 여부를 확인 후, 승인됫다면 현재 웹의 토큰값을 받아와서 저장.
                            firebase.firestore()
                            .collection('registeredToken')
                            .doc(firebase.auth().currentUser.uid)
                            .get().then(function(doc) {
                              if(doc.data().alarmPermission) {
                                firebase.messaging().getToken().then(function(currentToken) {
                                  firebase.firestore()
                                  .collection('registeredToken')
                                  .doc(firebase.auth().currentUser.uid)
                                  .update({
                                    token : currentToken
                                  });
                                });
                              }
                            })
                            alert("반갑습니다.\n" + currentUser.displayName + "님 Google 아이디로 로그인되었습니다.");
                            window.location.reload();
                        })

                        firebase.firestore().collection('registeredToken').doc(firebase.auth().currentUser.uid).set({
                            uid: firebase.auth().currentUser.uid,
                            email: firebase.auth().currentUser.email,
                            token: null,
                            alarmPermission: false
                        }, { merge: true });

                        // 현재 로그인된 사용자에 등록.
                        firebase.database().ref('connectedUsers/' + firebase.auth().currentUser.email.split("@")[0]).set({
                            uid: firebase.auth().currentUser.uid,
                            email: firebase.auth().currentUser.email
                        });



                    })
                    .catch(err => {
                        commit('setLoading', false);
                        commit('setError', err);
                    })
                }else {
                  alert("이미 로그인 되어 있는 아이디입니다.")
                  commit('setLoading', false);
                }
              });
        },
        //facebook 로그인
        userSignInWithFacebook({ commit }, payload) {

            var temp = '';
            var currentUser;
            var arrTemp = [];
            var flag = true;

            firebase.database()
              .ref('connectedUsers/')
              .once('value', function(snapshot){
                snapshot.forEach(function(doc) {
                    arrTemp.push(doc.val().email);
                })
                //return arrTemp;
              })
              .then(() => {
                for(var i in arrTemp) {
                  //console.log(arrTemp[i]);
                  if(arrTemp[i] === payload.email) {
                    flag = false;
                  }
                }
              })
              .then(() => {
                if(flag) {
                  commit('setLoading', true)
                  firebase.auth().signInWithPopup(facebook_provider)
                      .then(result => {
                          currentUser = result.user;
                          currentUser.getIdTokenResult().then(idTokenResult => {
                              if (idTokenResult.claims.grade == 'undefined' || idTokenResult.claims.grade == null) {
                                  //setUserGrade 해줘야함
                                  FirebaseService.setUserGrade(currentUser.uid, 3);
                              }
                              // 현재 유저의 alarm 승인 여부를 확인 후, 승인됫다면 현재 웹의 토큰값을 받아와서 저장.
                              firebase.firestore()
                              .collection('registeredToken')
                              .doc(firebase.auth().currentUser.uid)
                              .get().then(function(doc) {
                                if(doc.data().alarmPermission) {
                                  firebase.messaging().getToken().then(function(currentToken) {
                                    firebase.firestore()
                                    .collection('registeredToken')
                                    .doc(firebase.auth().currentUser.uid)
                                    .update({
                                      token : currentToken
                                    });
                                  });
                                }
                                alert("반갑습니다.\n" + currentUser.displayName + "님 Facebook 아이디로 로그인되었습니다.");
                                window.location.reload();
                              })
                          })

                          firebase.firestore().collection('registeredToken').doc(firebase.auth().currentUser.uid).set({
                              uid: firebase.auth().currentUser.uid,
                              email: firebase.auth().currentUser.email,
                              token: null,
                              alarmPermission: false
                          }, { merge: true });

                          // 현재 로그인된 사용자에 등록.
                          firebase.database().ref('connectedUsers/' + firebase.auth().currentUser.email.split("@")[0]).set({
                              uid: firebase.auth().currentUser.uid,
                              email: firebase.auth().currentUser.email
                          });
                      })
                      .catch(err => {
                          commit('setLoading', false);
                          commit('setError', err);
                      })
                }else {
                  alert("이미 로그인 되어 있는 아이디입니다.")
                  commit('setLoading', false);
                }
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
