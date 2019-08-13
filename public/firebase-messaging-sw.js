importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '453520187002'
});

self.addEventListener('install', function(event) {
    //console.log('SW 설치 완료', event);
});

var DYNAMIC_CACHE = "다이나믹-캐시-스토리지1";

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {

        }).map(function(cacheName) {
            return caches.delete(cacheName);
        })
      );
    })
  );
});


self.addEventListener("fetch", event => {
    console.log("fetch");
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
                    // 구글 문서에는 다음과 같이 처리하라고 되어있는데
                    // 이 경우 Cross Site Request에 대해 캐싱 처리를 할 수가 없다.
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        // if (!response) {
                        return response;
                    }

                    // 응답은 꼭 복사 해줘야한다.
                    var responseToCache = response.clone();

                    // 캐시 스토리지를 열고 정말 캐싱을 해준다.
                    caches.open(DYNAMIC_CACHE).then(cache => {
                        cache.put(event.request.url, responseToCache);
                    });

                    // 여기서 response를 내보내줘야 캐싱 처리 후에 리소스를 반환한다.
                    return response;
                })
                .catch(error => {
                    // 에러 발생시 캐시되어있는 offline.html로 이동시킨다.
                    return caches.open(DYNAMIC_CACHE)
                        .then(cache => {
                            // 들어온 요청의 Accept 헤더가 text/html 을 포함하고 있다면 (페이지 요청이라면)
                            if (event.request.headers.get('accept').includes('text/html')) {
                                // 캐시된 offline fallback 페이지를 보여준다.
                                return cache.match('/offline.html');
                            }
                        })
                });
        })
    );
});


// 백그라운드일때 메세지를 받고 처리 방식
firebase.messaging().setBackgroundMessageHandler(function(payload) {
    var flag = payload.data.messageAuth;

    if (flag === "reviewCommentReg" || flag === "previewCommentReg") {
        var notificationTitle = payload.data.title;
        var notificationOptions = {
            body: "작성자 : " + payload.data.username + "\n" + "내용 : " + payload.data.body,
            data: payload.data.username,
            icon: "https://ifh.cc/g/lUitx.png",
        };
        console.log("background received.")
        registration.showNotification(notificationTitle, notificationOptions);
    } else if (flag === "reviewReg" || flag === "previewReg") {
        var notificationTitle = payload.data.title;
        var notificationOptions = {
            body: payload.data.body,
            icon: "https://ifh.cc/g/lUitx.png"
        };
        registration.showNotification(notificationTitle, notificationOptions);
    }
});
