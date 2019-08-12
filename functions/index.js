
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);


const messaging = admin.messaging();

  //리뷰댓글생성시 admin에게 알림.
  exports.createReviewComment = functions.firestore
    .document('reviewComment/{reviewCommentId}')
    .onCreate((snap, context) => {
      var adminToken = '';
      const commentBody = snap.data().content;
      const reviewId = snap.data().reviewId;

      admin.firestore().collection("registeredToken").get().then((snapshot) => {
        snapshot.forEach((docs) => {
          //admin계정이고
          if(docs.data().email === "admin@admin.com") {
          //토큰 허용이면
            if(docs.data().token && docs.data().alarmPermission) {
              console.log("re admin~");
              adminToken = docs.data().token;
            }
          }
        });

        const message = {
          data : {
            messageAuth : "reviewCommentReg",
            title : "새로운 댓글이 등록되었습니다.",
            body : commentBody,
            reviewId : reviewId
          },
          token : adminToken
        };

        messaging.send(message).then((response) => {
          return response;
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
        return true;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
      return true;
    })

    //프리뷰댓글생성시 admin에게 알림.
    exports.createPreviewComment = functions.firestore
      .document('previewComment/{previewCommentId}')
      .onCreate((snap, context) => {
        var adminToken = '';
        const commentBody = snap.data().content;
        const previewId = snap.data().previewId;

        admin.firestore().collection("registeredToken").get().then((snapshot) => {
          snapshot.forEach((docs) => {

            //admin계정이고
            if(docs.data().email === "admin@admin.com") {
            //토큰 허용이면
              if(docs.data().token && docs.data().alarmPermission) {
                console.log("pre admin~");
                adminToken = docs.data().token;
              }
            }
          });

          const message = {
            data : {
              messageAuth : "previewCommentReg",
              title : "새로운 댓글이 등록되었습니다.",
              body : commentBody,
              previewId : previewId
            },
            token : adminToken
          };

          messaging.send(message).then((response) => {
            return response;
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
          return true;
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
        return true;
      })

  //리뷰가 생성되면
  exports.createReview = functions.firestore
    .document('review/{reviewId}')
    .onCreate((snap, context) => {
      const registerToken = [];
      const bodyTitle = snap.data().title;

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
            messageAuth : "reviewReg",
            title : '새로운 review가 등록 되었습니다.',
            body : bodyTitle,
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

    exports.createPreview = functions.firestore
      .document('preview/{previewId}')
      .onCreate((snap, context) => {
        const registerToken = [];
        const bodyTitle = snap.data().title;
        const alarmImgUrl = snap.data().imgUrl;
        //console.log(alarmImgUrl);

        admin.firestore().collection("registeredToken").get().then((snapshot) => {
          snapshot.forEach((docs) => {
            //토큰 값이 있고, 알람이 허용됫으면
            if(docs.data().token && docs.data().alarmPermission) {
              registerToken.push(docs.data().token);
            }
          });

          //메세지 보낸다.
          const message = {
            data : {
              title : '새로운 preview가 등록 되었습니다.',
              body : bodyTitle,
              imageUrl : alarmImgUrl
            },
            tokens : registerToken
          };
          console.log("2");
          messaging.sendMulticast(message).then((response) => {
            return response;
          })
          .catch((err) => {
            throw err;
          });
          return true;
        })
        .catch((err) => {
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
