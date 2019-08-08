
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const messaging = admin.messaging();

  //리뷰가 생성되면
  exports.createReview = functions.firestore
    .document('review/{reviewId}')
    .onCreate((snap, context) => {
      const registerToken = [];
      const bodycomment = snap.data().body;

      //모든 유저 정보가 담긴 DB를 탐색.
      admin.firestore().collection("registeredToken").get().then((snapshot) => {
        snapshot.forEach((docs) => {
          console.log(docs.data().token);
          //토큰 값이 있고, 알람이 허용됫으면
          if(docs.data().token && docs.data().alarmPermission) {
            registerToken.push(docs.data().token);
          }
        });

        //메세지 보낸다.
        const message = {
          data : {
            title : '새로운 review가 등록 되었습니다.',
            body : bodycomment,
          },
          tokens : registerToken
        };
        //console.log("1");
        //수신처 다인 메세지 전송
        messaging.sendMulticast(message).then((response) => {
          //console.log("success send message to all user")
          return response;
        })
        .catch((err) => {
          console.log(err)
          throw err;
        });
        return true;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
      return true;
    });

    exports.createPreview = functions.firestore
      .document('preview/{previewId}')
      .onCreate((snap, context) => {
        const registerToken = [];
        const bodycomment = snap.data().body;
        const iconImgUrl = snap.data().imgUrl;
        console.log(iconImgUrl);
        admin.firestore().collection("registeredToken").get().then((snapshot) => {
          snapshot.forEach((docs) => {
            console.log(docs.data().token);
            //토큰 값이 있고, 알람이 허용됫으면
            if(docs.data().token && docs.data().alarmPermission) {
              registerToken.push(docs.data().token);
            }
          });

          //메세지 보낸다.
          const message = {
            data : {
              title : '새로운 preview가 등록 되었습니다.',
              body : bodycomment,
          //    icon : iconImgUrl
            },
            tokens : registerToken
          };
          messaging.sendMulticast(message).then((response) => {
            return response;
          })
          .catch((err) => {
            console.log(err)
            throw err;
          });
          return true;
        })
        .catch((err) => {
          console.log(err);
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

    // exports.getNumOfUser =  functions.https.onCall(() => {
    //   return admin.auth().listUsers().then((listUsersResult) => {
    //     return listUsersResult;
    //   })
    //   .catch(err => {
    //     return err;
    //   })
    // })
