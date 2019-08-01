<template>
  <div id="app">
    <Header :selectPage="selectPage" @inChildSelectPage="childSelectPage"></Header>
    <div class="backgroudDiv"></div>
    <MainPage v-if="selectPage === 0"></MainPage>
    <timeTable v-if="selectPage === 1"></timeTable>
    <LoginForm v-if="selectPage === 4"></LoginForm>
    <!-- <Footer></Footer> -->
    <Review v-if="selectPage === 2"></Review>
    <Admin v-if="selectPage === -1"></Admin>
  </div>
</template>
<script>
import store from "./store";
import router from "./router.js";
import Header from "@/components/Header";
import MainPage from "@/views/MainPage";
import firebase from "firebase";
import timeTable from "@/components/timeTable";
import LoginForm from "@/components/LoginForm";
// import axios from "axios";
import Review from "@/components/Review";
import ReviewWriter from "@/components/ReviewWriter";
import CommentWriter from "@/components/CommentWriter";
import Admin from "@/components/Admin";

export default {
  name: "App",
  store,
  data() {
    return {
      selectPage: 0,
      temp: null
    };
  },
  components: {
    Header,
    MainPage,
    timeTable,
    LoginForm,
    Review,
    ReviewWriter,
    CommentWriter,
    Admin
  },
  methods: {
    childSelectPage(i) {
      this.selectPage = i;
    }
  },
  mounted() {
<<<<<<< HEAD
    //service worker register
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('firebase-messaging-sw.js')
      .then(function(registration) {
        console.log('Registration successful, scope is:', registration.scope);
      }).catch(function(err) {
        console.log('Service worker registration failed, error:', err);
      });
    }
=======
    //사이트 입장 시 세션에 따른 로그인 정보 초기화
    this.$store.dispatch("initLoginInfo");
>>>>>>> 59dbe770dff1fabf5f6ee509b3d4cbc149be8cb4

    var address = document.location.href;
    var logo = document.querySelector(".logo");
    var mainLogo = document.querySelector(".mainLogo");
    var homeIcon = document.querySelector(".homeIcon");
    if (address === "http://localhost:8080/") {
      logo.classList.remove("logoHide");
      mainLogo.classList.remove("logoHide");
      homeIcon.classList.add("logoHide");
    } else {
      logo.classList.add("logoHide");
      mainLogo.classList.add("logoHide");
      homeIcon.classList.remove("logoHide");
    }

  },
  watch: {
    selectPage: function() {
      if (this.selectPage === 1) {
        document.querySelector(".headerDiv").style.backgroundColor =
          "rgb(255, 255, 255, 0.7)";
      } else if (this.selectPage === 4) {
        document.querySelector("#loginForm").style.display = "block";
      } else if(this.selectPage === -1) {
        if(this.$store.dispatch("checkIsAdmin")){
          this.selectPage = -1;
        }else{
          this.selectPage = 0;
        }
      } else {
        document.querySelector(".headerDiv").style.backgroundColor =
          "transparent";
      }
    }
  }
};
</script>
<style>
body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
}

body * {
  margin: 0;
  padding: 0;
}

#app {
  width: 100vw;
  height: 100vh;
}

.backgroudDiv {
  height: 81vh;
  width: 32vw;
  position: absolute;
  left: 45%;
  z-index: -1;
  background-image: url("./assets/film.jpg");
  background-size: cover;
  background-position: center center;
}
</style>
