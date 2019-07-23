<template>
  <div id="app">
    <Header></Header>
    <MainPage></MainPage>
    <Footer></Footer>
  </div>
</template>
<script>
import store from "./store";
import router from "./router.js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MainPage from "@/views/MainPage";

export default {
  name: "App",
  store,
  methods: {},
  data() {
    return {};
  },
  components: {
    Header,
    Footer,
    MainPage
  }
};
</script>
<style>
body {
  margin: 0;
  padding: 0;
}
</style>

