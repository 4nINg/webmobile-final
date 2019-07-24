<template>
  <div>
    <ImageBanner></ImageBanner>
    <moviePoster></moviePoster>
    <timeTable></timeTable>
  </div>
</template>
<script>
import ImageBanner from "@/components/ImageBanner";
import moviePoster from "@/components/moviePoster";
import timeTable from "@/components/timeTable";

export default {
  components: {
    ImageBanner,
    moviePoster,
    timeTable
  },
  data() {
    return {};
  }
};
</script>
<style>
</style>
