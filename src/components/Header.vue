<template>
  <div class="headerDiv">
    <div class="logoDiv">
      <span class="logo">빠른 영화, 빠른 영화관</span>
      <span class="mainLogo">빠영빠영.</span>
    </div>
    <div class="sidebar openBtn" @click="openNav()">
      <i class="fas fa-bars"></i>
    </div>
    <div class="routerDiv sideNav">
      <span class="closebtn" @click="closeNav()">
        <i class="fas fa-times"></i>
      </span>
      <span>
        <router-link to="/">Review</router-link>
      </span>
      <span>
        <router-link to="/">Comments</router-link>
      </span>
      <span>
        <router-link to="/">Login</router-link>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  components: {},
  methods: {
    openNav() {
      document.querySelector(".sideNav").style.height = "100%";
    },
    closeNav() {
      document.querySelector(".sideNav").style.height = "0";
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
  /* background-color: rgb(44, 62, 80); */
  display: flex;
  justify-content: space-between;
  color: black;
  text-align: center;
  width: 100%;
  /* top: 0;
  position: sticky;
  background-color: white; */
}

.headerDiv span {
  cursor: pointer;
}
.logo {
  font-size: 0.85em;
  color: gray;
  opacity: 0.6;
}
.mainLogo {
  font-size: 2.8em;
  margin-left: 0.3em;
  margin-top: -0.1em;
  font-family: "Song Myung", serif;
}

.logoDiv {
  display: flex;
  flex-direction: column;
  margin-top: 1.5%;
  margin-left: 1.5%;
  margin-bottom: 1%;
}

.routerDiv {
  display: flex;
  flex-direction: column;
  /* margin-right: 7%;
  margin-top: 2.3%; */
  justify-content: space-evenly;
}

.routerDiv span {
  /* margin-left: 10%; */
  /* margin-right: 30%; */
  font-size: 2em;
  text-decoration: none;
}

a:link,
a:visited,
a {
  color: white;
  text-decoration: none;
}

.sideNav {
  height: 0;
  width: 100%;
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  background-color: rgb(44, 62, 80);
  opacity: 0.9;
  overflow: hidden;
  transition: 0.5s;
}

.sideNav span {
  cursor: pointer;
  font-size: 2.5em;
  color: white;
  transition: 0.3s;
}

.closebtn {
  position: absolute;
  top: 4.5%;
  right: 4.8%;
  font-size: 3em !important;
  /* margin-right: 100%; */
}

.openBtn {
  cursor: pointer;
  top: 15%;
  right: 15%;
  font-size: 2em;
  margin-right: 5%;
  margin-top: 2.5%;
}
</style>

