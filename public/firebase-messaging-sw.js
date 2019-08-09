importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '453520187002'
});

var STATIC_CACHE_NAME = "staticStorage";
var DYNAMIC_CACHE_NAME = "dynamicStorage";

var urlsToCache = [
  "/public/img/icons/favicon-32x32.png",
  "/public/img/icons/favicon-16x16.png",
  "/src/components/MainPage.vue",
  "/src/components/Preview.vue",
  "/src/components/PreviewCommentWriter",
  "/src/components/App.vue"
];


//정적 캐시 저장소
self.addEventListener('install', event => {
    //console.log('SW install', event);
    event.waitUntil(
      caches
        .open(STATIC_CACHE_NAME)
        .then(cache => {
          console.log("cash connected");
          return cache.addAll(urlsToCache);
        })
        .then(() => {
          return self.skipWaiting();
        })
    );
});


// 백그라운드일때 메세지를 받고 처리 방식
firebase.messaging().setBackgroundMessageHandler(function(payload) {
  console.log('Received background message ', payload);
  // Customize notification here
  const flag = payload.data.messageAuth;
  //리뷰, 프리뷰 생성 알림
  if(flag === "reviewReg" || flag == "previewReg") {
    var notificationTitle = "payload.data.title";
    var notificationOptions = {
      body: payload.data.body,
      icon: 'https://ifh.cc/g/lUitx.png',
      image: payload.data.imageUrl
    };
    console.log("background received.")
    registration.showNotification(notificationTitle, notificationOptions);
  //리뷰댓글, 프리뷰 댓글 생성 알림
}else if(flag == "previewComm"){
    var notificationTitle = payload.data.title;
    var notificationOptions = {

    };
  }
});
