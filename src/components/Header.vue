<template>
  <div class="headerDiv">
    <div class="logoDiv" @click="changeSelectPage(0)">
      <span class="logo">빠른 영화, 빠른 영화관</span>
      <span class="mainLogo">빠영빠영.</span>
    </div>
    <div class>
      <span @click="changeSelectPage(-1)" id="adminPageBtn">Admin</span>
    </div>
    <div class="sideNav">
      <!-- <span v-if="this.$store.state.user" @click="goToLogout()">
        <router-link to="/">Logout</router-link>
      </span>
      <span v-else @click="goToLogin()">
        <router-link to="/">Login</router-link>
      </span>-->
      <span v-if="checkLoginSession()" @click="goToLogout()" id="sideNavLogout">Logout</span>
      <span v-else @click="changeSelectPage(4)" id="sideNavLogin">Login</span>
      <span @click="changeSelectPage(3)">Preview</span>
      <span @click="changeSelectPage(2)">Review</span>
      <span @click="changeSelectPage(1)">Search</span>
    </div>
  </div>
</template>
<script>
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
      // document.querySelector('#loginForm').style.display = "block";
      this.changeSelectPage(4);
    },
    goToLogout() {
      // this.changeSelectPage(4);
      this.$store.dispatch("userSignOut").finally(() => {
        this.changeSelectPage(0);
      });
    },
    changeSelectPage(i) {
      if (i === -1 && !this.$store.getters.isAdmin) {
        i = 0;
        alert("관리자만 접근 가능합니다.");
      }
      // if(this.$store.state.user == null){
      //   alert("유저 없음")
      // }else if(this.$store.state.user.username == null){
      //   alert("유저네임 없음")
      // }else{
      //   alert("유저네임 확인용 : " + this.$store.state.user.username);
      // }
      this.$emit("inChildSelectPage", i);
    },
    checkLoginSession() {
      var check = this.$store.getters.isAuthenticated;
      return check;
      // if(sessionStorage.getItem('accessToken') == "0" || sessionStorage.getItem('accessToken') == "undefined"){
      //   // alert("없당 : ", sessionStorage.getItem('accessToken'), typeof sessionStorage.getItem('accessToken'))
      //   return false;
      // }else{
      //   // alert("있다 : ", sessionStorage.getItem('accessToken'), typeof sessionStorage.getItem('accessToken'))
      //   return true;
      // }
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
</style>
