<template>
  <div class="headerDiv">
    <div class="logoDiv">
      <span class="logo">빠른 영화, 빠른 영화관</span>
      <span class="mainLogo">빠영빠영.</span>
    </div>
    <div class="routerDiv">
      <span>Review</span>
      <span>Comment</span>
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
.headerDiv {
  background-color: rgb(44, 62, 80);
  display: flex;
  justify-content: space-between;
  color: white;
  text-align: center;
  width: 100%;
}

.headerDiv span {
  cursor: pointer;
}
.logo {
  font-size: 1em;
  opacity: 0.7;
  color: white;
}
.mainLogo {
  font-size: 3em;
  font-weight: 600;
  color: white;
}

.logoDiv {
  display: flex;
  flex-direction: column;
  margin: 2% 2%;
}

.routerDiv {
  display: flex;
  margin-right: 7%;
  margin-top: 3.5%;
  justify-content: space-around;
}

.routerDiv span {
  margin-left: 10%;
  margin-right: 30%;
  font-size: 1.7em;
}
</style>

