const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase;

  exports.createPortfolio = functions.firestore
    .document('portfolios/{portfolioId}')
    .onCreate((snap, context) => {
    })
