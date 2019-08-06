//import firebase from 'firebase'

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const messaging = admin.messaging();

  exports.createReview = functions.firestore
    .document('review/{reviewId}')
    .onCreate((snap, context) => {
      let registerToken = [];
      let bodycomment = snap.data().body;
      // var currentUser = firebase.auth().currentUser;
      // console.log(currentUser.displayName);
      // if(currentUser.displayName === null) {
      //   console.log("null name");
      //   return true;
      // };

      db.collection("BrowserToken")
      .get()
      .then(snapshot => {

          snapshot.forEach(doc => {
            if(doc.data().token) {
              registerToken.push(doc.data().token);
              console.log(doc.data().token);
            }
            return true;
          });

          const message = {
            data : {
              title : '새로운 review가 등록 되었습니다.',
              body : bodycomment,
            },
            tokens : registerToken
          };
          messaging.sendMulticast(message).then(response => {
           console.log("success send message");
           return response;
          })
          .catch(err => {
           console.log("err");
           throw err;
          });
          return true;
      })
      .catch(err => {
        throw err;
      });
      return true;
    });

    exports.getUserList = functions.https.onCall(() => {
      return admin.auth().listUsers().then((listUsersResult) => {
        return listUsersResult;
      })
      .catch(err => {
        return err;
      })
    })

    //등급(grade) 부여 or 변경
    exports.setUserGrade = functions.https.onCall((data) => {
      return admin.auth().setCustomUserClaims(data.uid, {grade : data.grade})
                  .catch((err) => {
                    return err
                  })
    });

    exports.getUser = functions.https.onCall((data) => {
      //get user
      return admin.auth().getUser(data)
      .then((result) => {
        return result.toJSON();
      }).catch(err => {
        return err;
      });
    });

    exports.deleteUser = functions.https.onCall((data) => {
      return admin.auth().deleteUser(data)
      .catch(err => {
        return err;
      })
    })
