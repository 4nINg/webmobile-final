<template>
  <div id="app">
    <Header :selectPage="selectPage" @inChildSelectPage="childSelectPage"></Header>
    <div class="backgroudDiv"></div>
    <MainPage v-if="selectPage === 0"></MainPage>
    <timeTable v-if="selectPage === 1"></timeTable>
    <!-- <Footer></Footer> -->
  </div>
</template>
<script>
import store from "./store";
import router from "./router.js";
import Header from "@/components/Header";
import MainPage from "@/views/MainPage";
import timeTable from "@/components/timeTable";

export default {
  name: "App",
  store,
  data() {
    return {
      selectPage: 0
    };
  },
  components: {
    Header,
    MainPage,
    timeTable
  },
  methods: {
    childSelectPage(i) {
      this.selectPage = i;
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
  height: 82.5vh;
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

