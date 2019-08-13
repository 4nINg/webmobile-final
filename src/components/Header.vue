<template>
  <div class="headerDiv">
    <div class="logoDiv" @click="changeSelectPage(0)">
      <span class="logo">빠른 영화, 빠른 영화관</span>
      <span class="mainLogo">빠영빠영.</span>
    </div>
    <div class="headerBtn">
      <div>
        <span id="SubscribeBtn" @click="subscribeAlarm()" style="display: none;">
          <i class="fas fa-bell-slash"></i>
        </span>
        <span id="SubscribeCancel" @click="subscribeAlarmCancel()" style="display: none;">
          <i class="fas fa-bell"></i>
        </span>
      </div>
      <div @click="changeSelectPage(-1)" id="adminPageBtn">
        <img src="../assets/adminBtn.png" id="adminPageBtnImg" />
      </div>
    </div>
    <div class="sideNav">
      <span v-if="checkLoginSession()" @click="goToLogout()" id="sideNavLogout">Logout</span>
      <span v-else @click="changeSelectPage(4)" id="sideNavLogin">Login</span>
      <span @click="changeSelectPage(3)">Preview</span>
      <span @click="changeSelectPage(2)">Review</span>
      <span @click="changeSelectPage(1)">Search</span>
    </div>
  </div>
</template>
<script>
import firebase from "firebase";

export default {
  props: ["selectPage"],
  data() {
    return {
      isLogin: false
    };
  },
  mounted() {},
  components: {},
  methods: {
    goToLogin() {
      this.changeSelectPage(4);
    },
    goToLogout() {
      var logoutFlag = confirm("정말로 로그 아웃 하시겠습니까?");
      if (logoutFlag) {
        this.$store.dispatch("userSignOut").finally(() => {
          this.changeSelectPage(0);
        });
      }
    },
    changeSelectPage(i) {
      if (
        i == 3 &&
        (this.$store.state.user == null || this.$store.state.user.grade == 3)
      ) {
        alert("일반회원 이상만 접근 가능합니다.");
        return;
      }
      this.$emit("inChildSelectPage", i);
    },
    checkLoginSession() {
      var check = this.$store.getters.isAuthenticated;
      return check;
    },

    showHideDiv(divId, show) {
      const div = document.querySelector("#" + divId);
      if (show) {
        div.style = "display: visible";
      } else {
        div.style = "display: none";
      }
    },

    //구독버튼
    subscribeAlarm() {
      const messaging = firebase.messaging();
      const firestore = firebase.firestore();
      var flag = confirm("새글 알림을 받으시겠습니까?");

      if (flag) {
        messaging
          .getToken()
          .then(currentToken => {
            firestore
              .collection("registeredToken")
              .get()
              .then(snapshot => {
                snapshot.forEach(function(doc) {
                  const temp = doc.data().uid;
                  if (temp === firebase.auth().currentUser.uid) {
                    firestore
                      .collection("registeredToken")
                      .doc(temp)
                      .update({
                        alarmPermission: true,
                        token: currentToken
                      });
                  }
                  //console.log(currentToken);
                });
              });
          })
          .catch(function(err) {
            throw err;
          });
        //구독취소 버튼 활성화
        document.querySelector("#SubscribeBtn").style = "display:none";
        document.querySelector("#SubscribeCancel").style = "display:visible";
      }
    },

    //구독취소 버튼
    subscribeAlarmCancel() {
      const messaging = firebase.messaging();
      const firestore = firebase.firestore();
      var flag = confirm("새글 알림을 취소하겠습니까?");
      if (flag) {
        //토큰 값을 가져와서
        messaging
          .getToken()
          .then(currentToken => {
            //해당 토큰을 삭제할껀데
            messaging
              .deleteToken(currentToken)
              .then(() => {
                //console.log('Token deleted.');
                //현재 로그인 유저의 정보를 찾아서
                firestore
                  .collection("registeredToken")
                  .get()
                  .then(snapshot => {
                    snapshot.forEach(function(docs) {
                      if (docs.data().uid === firebase.auth().currentUser.uid) {
                        // 구독취소와 토큰을 삭제한다
                        firestore
                          .collection("registeredToken")
                          .doc(docs.data().uid)
                          .set(
                            {
                              alarmPermission: false,
                              token: null
                            },
                            { merge: true }
                          );
                      }
                    });
                  });
              })
              .catch(function(err) {
                throw err;
              });
          })
          .catch(function(err) {
            throw err;
          });
        //구독하기 버튼 활성화
        document.querySelector("#SubscribeBtn").style = "display:visible";
        document.querySelector("#SubscribeCancel").style = "display:none";
      }
    }
  }
};
</script>
<style>
@font-face {
  font-family: "Chosunilbo_myungjo";
  src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/Chosunilbo_myungjo.woff")
    format("woff");
  font-weight: 700;
  font-style: normal;
}
.headerDiv {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 13%;
}

.headerDiv span {
  cursor: pointer;
}
.logo {
  font-size: 0.85em;
  color: black;
  opacity: 0.6;
}
.mainLogo {
  font-size: 2.8em;
  margin-left: 0.3em;
  margin-top: -0.1em;
  font-family: "Nanum Brush Script", cursive;
  font-weight: 400;
}

.logoDiv {
  display: flex;
  flex-direction: column;
  /* margin-top: 1%; */
  margin-left: 1.5%;
  /* margin-bottom: 1%; */
}

.sideNav {
  display: flex;
  width: 40vw;
  position: absolute;
  top: 43%;
  left: -17%;
  transform: rotate(-90deg);
}

.sideNav span {
  cursor: pointer;
  font-size: 1.1em;
  color: black;
  margin-right: 10%;
  font-family: "Courgette", cursive;
}

a:visited,
a:active,
a:link {
  color: black;
  text-decoration: none;
}

.sideNav span:hover,
.sideNav a:hover {
  color: red;
  transform: scale(1.3);
}

.logoHide {
  display: none;
}

#adminPageBtn {
  display: none;
  height: 35px;
  width: 35px;
  margin-top: 8%;
}

#adminPageBtnImg {
  height: 35px;
  width: 35px;
  cursor: pointer;
}

#SubscribeBtn,
#SubscribeCancel {
  font-size: 2em;
  color: gold;
  margin-right: 10px;
}
.headerBtn {
  /* margin-top: 2px; */
  margin-right: 10px;
  display: flex;
}
</style>