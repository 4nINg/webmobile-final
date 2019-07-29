<template>
  <div>
    <div class="writeBtnDiv">
      <i class="far fa-edit"></i>
    </div>
    <div class="ReviewsDiv">
      <!-- <div v-for></div> -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      reviewList: []
    };
  }
};
</script>
<style>
.writeBtnDiv {
  border-bottom: 1px solid black;
}
</style>
