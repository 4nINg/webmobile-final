import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import "firebase/functions";
import * as admin from 'firebase-admin';
import "@firebase/messaging";
import store from "../store.js";

const INFO = "info";
const REVIEW = "review";
const USERINFO = "userInfo";
const PREVIEW = "preview";
const REVIEWCOMMENT = "reviewComment";
const PREVIEWCOMMENT = "previewComment";
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
    } else {
        console.log("No Permission");
    }
}).catch(function(err) {
    store.state.error = err;
});

firebase.firestore().enablePersistence()
    .catch(function(err) {
        if (err.code == 'failed-precondition') {} else if (err.code == 'unimplemented') {}
        // store.state.error = err;
    });

//포그라운드 상태에서 메세지 받는 처리 방식
firebase.messaging().onMessage((payload) => {
    var flag = payload.data.messageAuth;

    if (flag === "reviewCommentReg" || flag === "previewCommentReg") {
        var notificationTitle = payload.data.title;
        var notificationOptions = {
            body: "작성자 : " + payload.data.username + "\n" + "내용 : " + payload.data.body,
            data: payload.data.username,
            icon: "https://ifh.cc/g/lUitx.png"
        };
        var notification = new Notification(notificationTitle, notificationOptions);
        //registration.showNotification(notificationTitle, notificationOptions);
        console.log("online received.");
    } else if (flag === "reviewReg" || flag === "previewReg") {
        var notificationTitle = payload.data.title;
        var notificationOptions = {
            body: payload.data.body,
            icon: "https://ifh.cc/g/lUitx.png"
        };

        var notification = new Notification(notificationTitle, notificationOptions);
        console.log("online received.");
    }

});


export default {

    getFireStore() {
        return firestore;
    },
    getFirestorage() {
        return firestorage;
    },
    // ==================================================== 리뷰 =================================================================
    // 리뷰 전체 리스트 가져오기
    getReviewList() {
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
            })
            .catch(err => {
              store.state.error = err;
            });
    },
    // 리뷰 작성
    postReview(title, body, writer, writerUid) {
        firestore.collection(REVIEW).add({
                title: title,
                writerUid: writerUid,
                writer: writer,
                body: body,
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                id: "",
            })
            .then(() => {}).catch((error) => {
                alert(error)
            })
            .catch(err => {
              store.state.error = err;
            });
    },
    // 리뷰 수정
    modifyReview(reviewId, mtitle, mbody) {
        firestore.collection(REVIEW).doc(reviewId).update({
            title: mtitle,
            body: mbody
        }).catch(err => {
          store.state.error = err;
        });
    },
    // 리뷰 삭제
    deleteReview(reviewId) {
        firestore.collection(REVIEW).doc(reviewId).delete().catch(err => {
          store.state.error = err;
        });
    },
    // ==================================================== 리뷰 댓글 =================================================================
    // 모든 리뷰 댓글 다 들고오기
    getReviewCommentList() {
        const reviewCommentCollection = firestore.collection(REVIEWCOMMENT);
        return reviewCommentCollection
            .orderBy("created_at", "desc")
            .get()
            .then(docSnapshots => {
                return docSnapshots.docs.map(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    return data;
                });
            }).catch(err => {
              store.state.error = err;
            });
    },
    // 리뷰 댓글 등록하기
    postReviewComment(reviewId, content, userUid, username) {
        firestore.collection(REVIEWCOMMENT).add({
            content: content,
            reviewId: reviewId,
            userUid: userUid,
            username: username,
            id: "",
            created_at: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(err => {
          store.state.error = err;
        });
    },
    // 리뷰 댓글 수정
    modifyReviewComment(reviewCommentId, content) {
        firestore.collection(REVIEWCOMMENT).doc(reviewCommentId).update({
            content: content
        }).catch(err => {
          store.state.error = err;
        });
    },
    // 리뷰 댓글 삭제
    deleteReviewComment(reviewCommentId) {
        firestore.collection(REVIEWCOMMENT).doc(reviewCommentId).delete().catch(err => {
          store.state.error = err;
        });
    },
    // ==================================================== 프리뷰 =================================================================
    getPreviewList() {
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
            }).catch(err => {
              store.state.error = err;
            });
    },
    postPreview(title, uid, writer, body, imgUrl, imgName) {
        firestore.collection(PREVIEW).add({
            title: title,
            writerUid: uid,
            writer: writer,
            body: body,
            imgUrl: imgUrl,
            imgName: imgName,
            created_at: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(err => {
          store.state.error = err;
        });
    },
    deletePreview(previewId) {
        firestore.collection(PREVIEW).doc(previewId).delete().catch(err => {
          store.state.error = err;
        });
    },
    modifyPreview(previewId, title, body, imgUrl, imgName) {
        if (imgUrl === "") {
            firestore.collection(PREVIEW).doc(previewId).update({
                title: title,
                body: body
            }).catch(err => {
              store.state.error = err;
            });
        } else {
            firestore.collection(PREVIEW).doc(previewId).update({
                title: title,
                body: body,
                imgUrl: imgUrl,
                imgName: imgName,
            }).catch(err => {
              store.state.error = err;
            });
        }
    },
    // =================================================== 프리뷰 댓글 ==============================================================
    // 프리뷰 댓글 다 들고오기
    getPreviewCommentList() {
        const reviewCommentCollection = firestore.collection(PREVIEWCOMMENT);
        return reviewCommentCollection
            .orderBy("created_at", "desc")
            .get()
            .then(docSnapshots => {
                return docSnapshots.docs.map(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    return data;
                });
            }).catch(err => {
              store.state.error = err;
            });
    },
    // 프리뷰댓글 등록
    postPreviewComment(previewId, content, userUid, username) {
        firestore.collection(PREVIEWCOMMENT).add({
            content: content,
            previewId: previewId,
            userUid: userUid,
            username: username,
            id: "",
            created_at: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(err => {
          store.state.error = err;
        });
    },
    // 프리뷰 댓글 수정
    modifyPreviewComment(previewCommentId, content) {
        firestore.collection(PREVIEWCOMMENT).doc(previewCommentId).update({
            content: content
        }).catch(err => {
          store.state.error = err;
        });
    },
    // 프리뷰 댓글 삭제
    deletePreviewComment(previewCommentId) {
        firestore.collection(PREVIEWCOMMENT).doc(previewCommentId).delete().catch(err => {
          store.state.error = err;
        });
    },

    //사용자 정보 불러오기
    getUser(uid) {
        const getUserFunc = functions.httpsCallable('getUser');
        getUserFunc(uid).then((result) => {
                // console.log(result)
                // console.log(result.data)
                return result.data;
            })
            .catch(err => {
              store.state.error = err;
            })
            .finally(() => {});
    },
    //사용자 등급 설정
    async setUserGrade(uid, grade) {
        const setUserGradeFunc = functions.httpsCallable('setUserGrade');
        await setUserGradeFunc({
                uid: uid,
                grade: grade
            }).then(() => {
                alert("변경완료!")
            })
            .catch(err => {
              store.state.error = err;
            });
    },
    //사용자 삭제
    async deleteUser(uid) {
        const deleteUserFunc = functions.httpsCallable('deleteUser');
        await deleteUserFunc(uid).then(() => {

                alert("삭제완료!")
            })
            .catch(err => {
              store.state.error = err;
            });
    },
    // review 개수
    async getNumOfReview() {
        var cnt;
        return await firestore.collection(REVIEW).get().then((snap) => {
            cnt = snap.docs.length;
            var result = snap.docs.map(doc => {
                return new Date(doc.data().created_at.toDate());
            });
            result.push(cnt);
            return result;
        }).catch(err => {
          store.state.error = err;
        });
    },
    // preview 개수
    async getNumOfPreview() {
        var cnt;
        return await firestore.collection(PREVIEW).get().then((snap) => {
            cnt = snap.docs.length;
            var result = snap.docs.map(doc => {
                return new Date(doc.data().created_at.toDate());
            });
            result.push(cnt);
            return result;
        }).catch(err => {
          store.state.error = err;
        });
    },
    //관리자페이지용 review get
    async getReviewListForAdmin() {
        var result
        return await firestore.collection(REVIEW).orderBy("created_at", "desc").get().then((snap) => {
            return snap.docs.map(doc => {
                result = doc.data();
                var data = {
                    id: doc.id,
                    title: result.title,
                    body: result.body,
                    writer: result.writer,
                    created_at: new Date(doc.data().created_at.toDate())
                }
                return data
            });
        }).catch(err => {
          store.state.error = err;
        });
    },
    //관리자페이지용 preview get
    async getPreviewListForAdmin() {
        var result;
        return await firestore.collection(PREVIEW).orderBy("created_at", "desc").get().then((snap) => {
            return snap.docs.map(doc => {
                result = doc.data();
                var data = {
                    id: doc.id,
                    title: result.title,
                    body: result.body,
                    writer: result.writer,
                    created_at: new Date(doc.data().created_at.toDate())
                }
                return data
            });
        }).catch(err => {
          store.state.error = err;
        });
    }
}
