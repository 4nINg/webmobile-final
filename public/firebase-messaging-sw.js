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

self.addEventListener("fetch", event => {
  console.log('SW fetch', event);

  event.respondWith(
    caches.match(event.request).then(response => {
      if(response) {
        return response;
      }
      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(response => {
        if(!response) {
          return response;
        }

        var responseToCache = response.clone();

        caches.open(DYNAMIC_CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});


// 백그라운드일때 메세지를 받고 처리 방식
firebase.messaging().setBackgroundMessageHandler(function(payload) {
  console.log('Received background message ', payload);
  // Customize notification here
  var notificationTitle = payload.data.title;
  var notificationOptions = {
    body: payload.data.body,
    icon: 'https://ifh.cc/g/lUitx.png',
    image: payload.data.imageUrl
  };
  console.log("background received.")
  registration.showNotification(notificationTitle, notificationOptions);
});
