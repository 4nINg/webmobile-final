<template>
  <div class="headerDiv">
    <div class="logoDiv" @click="changeSelectPage(0)">
      <span class="logo">빠른 영화, 빠른 영화관</span>
      <span class="mainLogo">빠영빠영.</span>
    </div>
    <div class>
      <span @click="changeSelectPage(-1)" id="adminPageBtn"><i class="fas fa-user-crown"></i></span>
      <div id = "SubscribeBtn" @click="subscribeAlarm()"><span>알림받습니다</span></div>
      <div id = "SubscribeCancel" @click="subscribeAlarmCancel()" style="display: none;"><span>알림취소합시다</span></div>
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
import firebase from 'firebase';

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
      this.$store.dispatch("userSignOut").finally(() => {
        this.changeSelectPage(0);
      });
    },
    changeSelectPage(i) {
      if(i == 3 && (this.$store.state.user == null || this.$store.state.user.grade == 3)){
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
      const div = document.querySelector('#' + divId);
      if(show) {
        div.style = 'display: visible';
      }else {
        div.style = 'display: none';
      }
    },

    // 구독취소버튼활성화
    subscribeAlarm() {
      const messaging = firebase.messaging();

      messaging.getToken().then((currentToken) => {
        messaging.deleteToken(currentToken).then(() => {
          console.log('Token deleted.');

        })
      })
      document.querySelector('#SubscribeBtn').style = 'display:none';
      document.querySelector('#SubscribeCancel').style = 'display:visible';

    },

    //구독버튼 활성화
    subscribeAlarmCancel() {
      document.querySelector('#SubscribeBtn').style = 'display:visible';
      document.querySelector('#SubscribeCancel').style = 'display:none';

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
  color: black;
  text-align: center;
  width: 100%;
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
  margin-top: 3%;
  margin-left: 1.5%;
  margin-bottom: 1%;
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
}
</style>
