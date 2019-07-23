<template>
  <div class="headerDiv">
    <div class="logoDiv">
      <span class="logo">빠른 영화, 빠른 영화관</span>
      <span class="mainLogo">빠영빠영.</span>
    </div>
    <div class="routerDiv">
      <span>Review</span>
      <span>Comments</span>
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
  /* background-color: rgb(44, 62, 80); */
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
  margin-right: 7%;
  margin-top: 2.3%;
  justify-content: space-around;
}

.routerDiv span {
  margin-left: 10%;
  margin-right: 30%;
  font-size: 1.7em;
}
</style>

