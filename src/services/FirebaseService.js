import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import "firebase/functions";
import * as admin from 'firebase-admin';

import "@firebase/messaging";

import store from "../store.js"
const INFO = "info";
const REVIEW = "review";
const USERINFO = "userInfo";
const PREVIEW = "preview";
// cloud firestore


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

var serviceAccount = require("../../webmobile-final-c2c78-firebase-adminsdk-pqts2-229bb83353.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://webmobile-final-c2c78.firebaseio.com"
});

const firestore = firebase.firestore();
const firestorage = firebase.storage();
const messaging = firebase.messaging();
const functions = firebase.functions();

messaging.usePublicVapidKey("BICBJ4VJNXGOauHFGbcpv8uwalnfMAHwB3DN9HmlyBmPI0jxM8OZhnBcp12-IYNfTeGaAzPjRvxJ-fH-KsdNmLs");

Notification.requestPermission().then(function(Permission) {
    if (Permission === 'granted') {
        console.log('Alarm Permission');
        return messaging.getToken();
    } else {
        console.log("No Permission");
    }
}).then(function(token) {
    console.log("Alarm token : " + token);
    //토큰 값이 있을때
    if (token) {
        firestore.collection('BrowserToken').doc(token).set({
                token: token,
                email: "",
                name: "",
                alarmPermission: true
            })
            .then(function() {
                console.log("Token 저장 성공");
            })
    }
}).catch(function(err) {
    console.log("Error ", err);
});

firebase.firestore().enablePersistence()
    .catch(function(err) {
        if (err.code == 'failed-precondition') {} else if (err.code == 'unimplemented') {}
    });

//온라인 상태에서 메세지 받는 처리 방식
firebase.messaging().onMessage((payload) => {
    console.log(payload);
    var options = {
        body: payload.data.body,
        icon: "https://ifh.cc/g/lUitx.png"
    };

    var notification = new Notification(payload.data.title, options);
    console.log('Message received. ', payload);
});

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
                    return data;
                });
            });
    },
    postReview(title, body, writer, writerUid) { //리뷰 작성
        firestore.collection(REVIEW).add({
                title: title,
                writerUid : writerUid,
                writer: writer,
                body: body,
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                id: "",
                commentContent: [],
                commentUsername: [],
                commentUserUid: []
            })
            .then(() => {}).catch((error) => {
                alert(error)
            });
    },
    postReviewComment(reviewId, commentUsername, commentContent, commentUserUid) { //reviewId - review식별자 //댓글 작성
        firestore.collection(REVIEW).doc(reviewId).update({
            commentUsername: commentUsername,
            commentContent: commentContent,
            commentUserUid: commentUserUid
        })
    },
    modifyReviewComment(reviewId, commentContent) { //modify review's commentContent
        firestore.collection(REVIEW).doc(reviewId).update({
            commentContent: commentContent
        })
    },
    deleteReviewComment(reviewId, commentUsername, commentContent, commentUserUid) {
        firestore.collection(REVIEW).doc(reviewId).update({
                commentUsername: commentUsername,
                commentContent: commentContent,
                commentUserUid: commentUserUid
            })
            // return firestore.collection(REVIEW).doc(reviewId).get().then(DS => {
            //     return DS.data();
            // });
    },
    getPreviewList() { //시사회정보 상세보기
        const reviewCollection = firestore.collection(PREVIEW);
        return reviewCollection
            .orderBy("created_at", "desc")
            .get()
            .then(docSnapshots => {
                return docSnapshots.docs.map(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    return data;
                });
            });
    },
    postPreview(title, uid, writer, body, imgUrl, imgName) { //시사회정보 작성
        firestore.collection(PREVIEW).add({
            title: title,
            writerUid: uid,
            writer: writer,
            body: body,
            imgUrl: imgUrl,
            imgName: imgName,
            commentContent: [],
            commentUserName: [],
            commentUserUid: [],
            created_at: firebase.firestore.FieldValue.serverTimestamp()
        });
    },
    deletePreview(o) { //시사회정보 삭제
        firestore.collection(REVIEW).doc(o.id).delete().finally(() => {
            firestorage.ref().child('review/' + o.num).delete()
            window.location.reload();
        });
    },
    deleteReview(reviewId) {
        firestore.collection(REVIEW).doc(reviewId).delete();
    },
    modifyReview(reviewId, mtitle, mbody) {
        firestore.collection(REVIEW).doc(reviewId).update({
            title: mtitle,
            body: mbody
        });
    },
    //사용자 정보 불러오기
    getUser(uid) {
        const getUserFunc = functions.httpsCallable('getUser');
        getUserFunc(uid).then((result) => {
            // console.log(result)
            // console.log(result.data)
            return result.data;
        }).catch(err => console.log(err));
    },
    //사용자 등급 설정
    setUserGrade(uid, grade) {
        const setUserGradeFunc = functions.httpsCallable('setUserGrade');
        setUserGradeFunc({
                uid: uid,
                grade: grade
            }).then(() => {
                console.log("수정완료!")
            })
            .catch(err => {
                console.log("setUserGrade Error => " + err);
            })
    },
    //사용자 삭제
    async deleteUser(uid){
      const deleteUserFunc = functions.httpsCallable('deleteUser');
      await deleteUserFunc(uid).then(()=>{
        alert("삭제완료!")
      })
      .catch(err => {
        console.log("deleteUser Error => " + err);
      })
    },
    // review 개수
    getNumOfReview(){
      return firestore.collection(REVIEW).get().then((snap)=>{
        console.log(snap)
        return snap.size;
      })
    },
    // preview 개수
    getNumOfPreview(){
      return firestore.collection(PREVIEW).get().then((snap)=>{
        console.log(snap)
        return snap.size;
      })
    },
    // user 개수
    getNumOfUser(){
    },
    getUserList(){
        const getUserListFunc = functions.httpsCallable('getUserList');
        console.log(getUserListFunc());
    }
}
