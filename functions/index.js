const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.getUser = functions.https.onCall((data) => {
    //get user
    return admin.auth().getUser(data)
    .then((result) => {
      return result.toJSON();
    }).catch(err => {
      return err;
    });
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

// 회원가입
exports.createUser = functions.https.onCall((data) => {
  admin.auth().createUser({
    email: data.email,
    password: data.password,
    displayName: data.username
  }).then((userRecord) => {
      admin.auth().setCustomUserClaims(userRecord.uid, {grade: 3}).then((result)=>{
        return result;
      }).catch((error) =>{
        console.log('functions createUser error => ' + error);
      })
      return userRecord;
  }).catch((error) =>{
      console.log('functions createUser error => ' + error);
  })
})

exports.createPortfolio = functions.firestore
    .document('portfolios/{portfolioId}')
    .onCreate((snap, context) => {
    });
