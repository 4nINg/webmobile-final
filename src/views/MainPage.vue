<template>
  <div>
    <div class="mainDiv">
      <div class="slogan">
        <span class="firstSlogan">
          Life is a
          <span class="colorSlogan">tragedy</span> when seen in close-up,
        </span>
        <span class="secondSlogan">
          but a
          <span class="colorSlogan">comedy</span> in long-shot.
        </span>
      </div>    
    </div>
  </div>
</template>


<script>
export default {
  components: {
  },
  data() {
    return {
      date: [],
      movieList: []
    };
  },
  mounted() {},
  methods: {}
};
</script>

<style>
.mainDiv {
  width: 100vw;
  height: 80vh;
}

.slogan {
  color: black;
  margin-left: 8%;
  width: 90%;
  height: 80%;
  font-size: 2.3em;
  font-family: "Courgette", cursive;
}

.firstSlogan {
  position: absolute;
  top: 30%;
}

.secondSlogan {
  position: absolute;
  bottom: 30%;
  right: 4%;
}
</style>
