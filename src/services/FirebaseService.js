import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import store from "../store.js"
const INFO = "info";
const REVIEW = "review";
const USER = "user";
// const BANNERS = "bannerImages";
const USERINFO = "userInfo";

// Setup Firebase
const config = {
    projectId: "webmobile-final-c2c78",
    apiKey: "AIzaSyD4bq7xQpiSRQki36ysWNwuisQDu1vSRaU",
    authDomain: "webmobile-final-c2c78.firebaseapp.com",
    databaseURL: "https://webmobile-final-c2c78.firebaseio.com",
    storageBucket: "webmobile-final-c2c78.appspot.com",
    messagingSenderId: "453520187002",
    appId: "1:453520187002:web:4c7fe212b5dc488a"
};

firebase.initializeApp(config);
const firestore = firebase.firestore();
const firestorage = firebase.storage();
// export const firebaseDatabase = firebase.database();

export default {
    getFireStore() {
        return firestore;
    },
    getFirestorage() {
        return firestorage;
    },
    getReviewList() { //리뷰리스트를 fireStore에서 get
        const reviewCollection = firestore.collection(REVIEW);
        return reviewCollection
            .orderBy("created_at", "desc")
            .get()
            .then(docSnapshots => {
                return docSnapshots.docs.map(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    data.created_at = new Date(data.created_at.toDate());
                    return data;
                });
            });
    },
    getReview() { //리뷰 상세보기
        const reviewCollection = firestore.collection(REVIEW);
        return reviewCollection
            .orderBy("created_at", "desc")
            .get()
            .then(docSnapshots => {
                return docSnapshots.docs.map(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    data.created_at = new Date(data.created_at.toDate());
                    return data;
                });
            });
    },
    postReview(title, body, writer) { //리뷰 작성
        // alert(title + " " + body + " " +writer)
        firestore.collection(REVIEW).add({
                title: title,
                writer: writer,
                body: body,
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                id: "",
                comment: [],
                userId: []
            })
            .then(() => {
                // alert("보내는중")
            }).catch((error) => {
                alert(error)
            }).finally(() => {
                // alert("작성끝")
            });
    },
    deleteReview(o) { //리뷰 삭제
        firestore.collection(REVIEW).doc(o.id).delete().finally(() => {
            firestorage.ref().child('review/' + o.num).delete()
            alert("삭제완료!")
            window.location.reload();
        });
    },
    postComment(reviewId, userList, contentList) { //reviewId - review식별자
        firestore.collection(REVIEW).doc(reviewId).update({
            userId: userList,
            comment: contentList
        })
            
        
    },
    getPreview() { //시사회정보 상세보기
        const reviewCollection = firestore.collection(REVIEW);
        return reviewCollection
            .orderBy("created_at", "desc")
            .get()
            .then(docSnapshots => {
                return docSnapshots.docs.map(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    data.created_at = new Date(data.created_at.toDate());
                    return data;
                });
            });
    },
    postPreview(title, body, writer) { //시사회정보 작성
        firestore.collection(REVIEW).add({
            title: title,
            writer: writer,
            body: body,
            created_at: firebase.firestore.FieldValue.serverTimestamp(),
            id: ""
        });
    },
    deletePreview(o) { //시사회정보 삭제
        firestore.collection(REVIEW).doc(o.id).delete().finally(() => {
            firestorage.ref().child('review/' + o.num).delete()
            alert("삭제완료!")
            window.location.reload();
        });
    },
    loginWithGoogle() {
        let provider = new firebase.auth.GoogleAuthProvider();
        return firebase
            .auth()
            .signInWithPopup(provider)
            .then(function(result) {
                // let accessToken = result.credential.accessToken;
                // let user = result.user;
                return result;
            })
            .catch(function(error) {
                console.error("[Google Login Error]", error);
            });
    },
    createUserInfo(uid, id, username) { // 회원가입
      alert("크리에이트 입장")
         firestore.collection(USERINFO).doc(uid).set({
            uid,
            id,
            username,
            login_time: firebase.firestore.FieldValue.serverTimestamp(),
            logout_time: '',
            grade: 3
        }).catch((error) => alert(error))
        .finally(() => {
          alert("크리에이트 완료")
            window.location.reload();
        })
    },
    mgrUserInfoLog(uid, id, username) {
        var userList = [];
        firestore.collection(USERINFO)
            .get()
            .then((docSnapshots) => {
                return docSnapshots.docs.map((doc) => {
                    let data = doc.id
                    userList.push(data)
                })
            })
            .finally(() => {
                var check = false;
                for (var i = 0; i < userList.length; i++) {
                    if (userList[i] == uid) {
                        check = true;
                        break;
                    }
                }
                var userLogRef = firestore.collection(USERINFO);
                if (check) {
                    userLogRef.doc(uid).update({
                        login_time: firebase.firestore.FieldValue.serverTimestamp()
                    }).finally(() => {
                        window.location.reload();
                    });
                } else {
                    this.createUserInfo(uid, id, username);
                }
            })
    },
    mgrUserInfoGrade(uid, grade){
      var userInfoRef = firestore.collection(USERINFO);
      userInfoRef.doc(uid).update({
        grade : grade
      }).finally(()=>{
        //재로드가 이루어져야함
      })
    },
    changeLogoutTime(uid) {
        var userLogRef = firestore.collection(USERINFO).doc(uid).update({
            logout_time: firebase.firestore.FieldValue.serverTimestamp()
        }).finally(() => {
            window.location.href = "/";
        });
    },
    getUserInfoList() {
        var userList = [];
        firestore.collection(USERINFO)
            .get()
            .then((docSnapshots) => {
                return docSnapshots.docs.map((doc) => {
                    let data = doc.data()
                    if (data.login_time !== "") {
                        data.login_time = new Date(data.login_time.toDate());
                    }
                    if (data.logout_time !== "") {
                        data.logout_time = new Date(data.logout_time.toDate());
                    }
                    userList.push(data)
                })
            })
        return userList;
    }
}
