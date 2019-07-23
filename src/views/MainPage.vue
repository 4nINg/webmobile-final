<template>
  <div>
    <div class="imgBanner">
      <input type="text" name class="searchBox" />
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {};
  }
};
</script>
<style>
.imgBanner {
  width: 100%;
  height: 20em;
  background-image: url("../assets/moon.jpg");
  background-size: cover;
}

.searchBox {
  width: 80%;
}
</style>
