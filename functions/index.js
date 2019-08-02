const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.getUser = functions.https.onCall((data, context) => {
    //get user
    return admin.auth().getUser(data.uid)
    .then((data) => {
      console.log("Success! Auth getUser");
      return data.toJSON();
    }).catch(err => {
        console.log("Auth getUser Error : " + err);
    });
});

exports.setUserGrade = functions.https.onCall((data, context) => {
  //get user and set custom claim (grade)
  return admin.auth().getUser(data.uid)
  .then((user) => {
    admin.auth().setCustomUserClaims(user.uid, {
      grade : data.grade
    });
    return console.log("Success! Set " + data.uid + " Auth grade");
  }).catch(err => {
    console.log("Auth SetUserGrade Error : " + err);
  });
});

exports.createPortfolio = functions.firestore
    .document('portfolios/{portfolioId}')
    .onCreate((snap, context) => {
    });
