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

      console.log(firebase.auth().currentUser.email.split("@")[0]);
      db.collection("connectedUsers/" + firebase.auth().currentUser.email.split("@")[0])
      .get()
      .then(snapshot => {

          snapshot.forEach(doc => {
            if(doc.data().token) {
              registerToken.push(doc.data().token);
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
