importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '453520187002'
});

self.addEventListener('install', function(event) {
    // console.log('SW 설치 완료', event);
});

// 백그라운드일때 메세지를 받고 처리 방식
firebase.messaging().setBackgroundMessageHandler(function(payload) {
    var flag = payload.data.messageAuth;

    if(flag === "reviewCommentReg" || flag === "previewCommentReg") {
      var notificationTitle = payload.data.title;
      var notificationOptions = {
          body : "작성자 : " + payload.data.username + "\n" + "내용 : " + payload.data.body,
          data : payload.data.username,
          icon: "https://ifh.cc/g/lUitx.png",
      };
      console.log("background received.")
      registration.showNotification(notificationTitle, notificationOptions);
    }else if(flag === "reviewReg" || flag === "previewReg") {
      var notificationTitle = payload.data.title;
      var notificationOptions = {
        body : payload.data.body,
        icon: "https://ifh.cc/g/lUitx.png"
      };
      registration.showNotification(notificationTitle, notificationOptions);
    }
});
