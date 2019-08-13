<template>
  <div id="app">
    <ErrorPage v-if="this.$store.state.error !== null"></ErrorPage>
    <LoadingPage v-if="this.$store.state.loading"></LoadingPage>
    <Header :selectPage="selectPage" @inChildSelectPage="childSelectPage"></Header>
    <div class="backgroudDiv"></div>
    <MainPage v-if="selectPage === 0"></MainPage>
    <timeTable v-if="selectPage === 1"></timeTable>
    <LoginForm v-if="selectPage === 4" @inLoginSelectPage="loginSelectPage"></LoginForm>
    <SignUpForm v-if="selectPage === 5" @inSignUpSelectPage="signUpSelectPage"></SignUpForm>
    <Preview v-if="selectPage === 3"></Preview>
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
import SignUpForm from "@/components/SignUpForm";
import Preview from "@/components/Preview";
import LoadingPage from "@/components/Loading";
import ErrorPage from "@/components/Error";

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
    Admin,
    SignUpForm,
    Preview,
    LoadingPage,
    ErrorPage
  },
  methods: {
    childSelectPage(i) {
      this.selectPage = i;
    },
    loginSelectPage(i) {
      this.selectPage = i;
    },
    signUpSelectPage(i) {
      this.selectPage = i;
    }
  },
  mounted() {
    if (navigator.serviceWorker) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(function(reg) {
          console.log("Registration successful, scope is:", reg);
        })
        .catch(function(err) {
          console.log("Service worker registration failed, error:", err);
        });
    }
  },
  watch: {
    selectPage: function() {
      if (this.selectPage === 1) {
        document.querySelector(".headerDiv").style.backgroundColor =
          "rgba(255, 255, 255, 0.7)";
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
  height: 87vh;
  width: 100vw;
  position: absolute;
  z-index: -1;
  background-image: url("./assets/MovieBG.png");
  background-size: cover;
  background-position: center center;
  opacity: 0.75;
}
</style>
