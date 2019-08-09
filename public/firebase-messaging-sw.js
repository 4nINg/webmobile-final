importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

var staticCacheName = 'static test cache';
//캐쉬에 dynamic 캐쉬 저장
var dynamicCacheName = "dynamic cache";
var staticCache = [
    '/favicon.ico',
];

firebase.initializeApp({
    'messagingSenderId': '453520187002'
});

self.addEventListener('install', function(event) {
    console.log('SW 설치 완료', event);
    event.waitUntil(
        // '캐시-스토리지1'을 연다.
        // @return {Promise} 연결된 Cache Database를 반환한다.
        caches
        .open(staticCacheName)
        .then(cache => {
            console.log("캐시 디비와 연결됨");
            // addAll 메소드로 내가 캐싱할 리소스를 다 넣어주자.
            return cache.addAll(staticCache);
        })
        .then(() => {
            // 설치 후에 바로 활성화 단계로 들어갈 수 있게 해준다.
            return self.skipWaiting();
        })
    );
});

// fetch event는 어딘가에서 리소스를 가져올 때 모두 실행된다.
// js를 가져오거나 이미지를 가져오거나 페이지를 가져오거나 등등
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // 캐시에 있으면 repsonse를 그대로 돌려준다.
            if (response) {
                return response;
            }

            // 여기서 request를 복사해준다.
            // request는 스트림으로 fetch 당 한 번만 사용해야하기 때문이다.
            // 근데 event.request로 받아도 실행은 된다
            var fetchRequest = event.request.clone();

            // if (response) return response 구문을 하나로 합칠 수도 있다.
            // return response || fetch(fetchRequest)
            return fetch(fetchRequest).then(response => {
                // 응답이 제대로 왔는지 체크한다.
                if (!response) {
                    return response;
                }

                // 응답은 꼭 복사 해줘야한다.
                var responseToCache = response.clone();

                // 캐시 스토리지를 열고 정말 캐싱을 해준다.
                caches.open(dynamicCacheName).then(cache => {
                    cache.put(event.request, responseToCache);
                });

                // 여기서 response를 내보내줘야 캐싱 처리 후에 리소스를 반환한다.
                return response;
            });
        })
        .catch(error => {
            // 에러 발생시 캐시되어있는 offline.html로 이동시킨다.
            return caches.open(dynamicCacheName)
                .then(cache => {
                    // 들어온 요청의 Accept 헤더가 text/html 을 포함하고 있다면 (페이지 요청이라면)
                    if (event.request.headers.get('accept').includes('text/html')) {
                        // 캐시된 offline fallback 페이지를 보여준다.
                        return cache.match('/offline.html');
                    }
                })
        })
    );
});

// 오래된 캐쉬 지우기용
self.addEventListener("activate", event => {
    // 영구적으로 가져갈 캐시 스트리지 화이트리스트
    var cacheWhiteList = [staticCacheName, dynamicCacheName];

    event.waitUntil(
        // 캐시 스토리지의 모든 스토리지명을 가져온다.
        caches.keys().then(cacheNames => {
            // 캐시를 삭제하는 건 Promise를 반환하므로 Promise.all을 사용해 끝날 시점을 잡아야한다.
            return Promise.all(
                // 이 결과는 [Promise, Promise...] 형태가 되시겠다.
                cacheNames.map(cacheName => {
                    // 각각의 캐시 스토리지명이 화이트 리스트와 같지 않을 경우
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // 캐시를 삭제하는 Promise를 배열에 추가한다.
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // activate 시에는 clients claim 메소드를 호출해서
    // 브라우저에 대한 제어권을 가져와야한다.
    return self.clients.claim();
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