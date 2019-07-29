<template>
  <div class="headerDiv">
    <div class="logoDiv" @click="changeSelectPage(0)">
      <span class="logo">빠른 영화, 빠른 영화관</span>
      <span class="mainLogo">빠영빠영.</span>
      <i class="fas fa-home homeIcon logoHide"></i>
    </div>
    <div class="">
      <span>
        <router-link to="/admin">Admin</router-link>
      </span>
    </div>
    <div class="sideNav">
      <!-- <span v-if="this.$store.state.user" @click="goToLogout()">
        <router-link to="/">Logout</router-link>
      </span>
      <span v-else @click="goToLogin()">
        <router-link to="/">Login</router-link>
      </span> -->
      <span  v-if="this.$store.state.user" @click="changeSelectPage(4)">Login</span>
      <span v-else @click="goToLogout()"></span>
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
    return {};
  },
  mounted() {},
  components: {},
  // mounted(){
  //   alert(this.$store.state.accessToken)
  // },
  methods: {
    goToLogout(){
      this.$store.dispatch("userSignOut");
    },
    changeSelectPage(i) {
      this.$emit("inChildSelectPage", i);
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
  left: -18%;
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
  /* color: rgb(255, 98, 0); */
  /* color: rgb(231, 76, 60); */
  color: red;
  transform: scale(1.3);
}

.logoHide {
  display: none;
}
</style>
