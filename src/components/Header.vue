<template>
  <div class="headerDiv">
    <div class="logoDiv">
      <span class="logo">빠른 영화, 빠른 영화관</span>
      <span class="mainLogo">빠영빠영.</span>
      <i class="fas fa-home homeIcon hide"></i>
    </div>
    <div class="sideNav">
      <span>
        <router-link to="/">Login</router-link>
      </span>
      <span>
        <router-link to="/">Preview</router-link>
      </span>
      <span>
        <router-link to="/">Review</router-link>
      </span>
      <span>
        <router-link to="/">Search</router-link>
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
  methods: {}
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
  /* color: rgb(255, 98, 0); */
  color: white;
  opacity: 0.6;
}
.mainLogo {
  font-size: 3.7em;
  margin-left: 0.3em;
  margin-top: -0.1em;
  /* font-family: "Song Myung", serif; */
  /* font-family: "East Sea Dokdo", cursive; */
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
  /* flex-direction: column; */
  width: 40vw;
  /* justify-content: space-between !important; */
  position: absolute;
  top: 40%;
  left: -18%;
  transform: rotate(-90deg);
}

.sideNav span {
  cursor: pointer;
  font-size: 1.3em;
  color: white;
  transition: 0.3s;
  margin-right: 10%;
  font-family: "Courgette", cursive;
  /* text-shadow: 5px 5px black; */
}

a:visited,
a:active,
a:link {
  /* color: rgb(255, 98, 0); */
  color: white;
  text-decoration: none;
}

.sideNav span:hover,
.sideNav a:hover {
  color: rgb(255, 98, 0);
}
</style>

