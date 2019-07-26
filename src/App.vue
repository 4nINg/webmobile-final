<template>
  <div id="app">
    <MainPage></MainPage>
    <!-- <Footer></Footer> -->
  </div>
</template>
<script>
import store from "./store";
import router from "./router.js";
import Header from "@/components/Header";
// import Footer from "@/components/Footer";
import MainPage from "@/views/MainPage";

export default {
  name: "App",
  store,
  data() {
    return {};
  },
  components: {
    Header,
    // Footer,
    MainPage
  },
  methods: {},
  mounted() {
    var address = document.location.href;
    if (address !== "http://localhost:8080/") {
      var logo = document.querySelector(".logo");
      var mainLogo = document.querySelector(".mainLogo");
      logo.classList.add("hide");
      mainLogo.classList.add("hide");
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
  background-image: url("./assets/film.gif");
  background-size: cover;
  background-position: center center;
}
</style>

