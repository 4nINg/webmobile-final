<template>
  <div id="app">
    <Header :selectPage="selectPage" @inChildSelectPage="childSelectPage"></Header>
    <div class="backgroudDiv"></div>
    <MainPage v-if="selectPage === 0"></MainPage>
    <timeTable v-if="selectPage === 1"></timeTable>
    <LoginForm v-if="selectPage === 4"></LoginForm>
    <!-- <Footer></Footer> -->
    <button @click="crawlingData()">크롤링가즈아</button>
    <div id="movieList">{{temp}}</div>
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
import axios from "axios";

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
    LoginForm
  },
  methods: {
    childSelectPage(i) {
      this.selectPage = i;
    },
    crawlingData(){
      var movieInfo;
      axios.get("http://localhost:8888/megabox",{
        headers : {
          'Access-Control-Allow-Origin' : '*'
        }
      }).then((response)=>{
        // console.log(data)
        console.log(response.data.info)
        this.temp = response.data.info;
      });
      // this.temp = data.data.info;
    }
  },
  mounted() {
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
      } else if(this.selectPage === 4) {
        document.querySelector('#loginForm').style.display = "block"
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
}

body * {
  margin: 0;
  padding: 0;
}

#app {
  width: 100vw;
  height: 100wh;
}

.backgroudDiv {
  height: 81vh;
  width: 30vw;
  position: absolute;
  left: 45%;
  /* top: 13%; */
  z-index: -1;
  background-image: url("./assets/film.jpg");
  background-size: cover;
  background-position: center center;
}
</style>
