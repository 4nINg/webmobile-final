<template>
  <div>
    <ImageBanner></ImageBanner>
    <moviePoster></moviePoster>
  </div>
</template>
<script>
import ImageBanner from "@/components/ImageBanner";
import moviePoster from "@/components/moviePoster";

export default {
  components: {
    ImageBanner,
    moviePoster
  },
  data() {
    return {};
  }
};
</script>
<style>
</style>
