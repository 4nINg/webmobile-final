importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '453520187002'
});

self.addEventListener('install', function(event){
    console.log('SW 설치 완료', event);
});

// 오프라인일때 메세지를 받고 처리 방식
firebase.messaging().setBackgroundMessageHandler(function(payload) {
  console.log('Received background message ', payload);
  // Customize notification here
  var notificationTitle = payload.data.title;
  var notificationOptions = {
    body: payload.data.body + "off",
    icon: 'https://ifh.cc/g/lUitx.png'
  };
  console.log("background received.")
  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});
