<template>
  <div>
    <ImageBanner></ImageBanner>
    <moviePoster></moviePoster>
    <ReviewWriter></ReviewWriter>
    <PreviewWriter></PreviewWriter>
    <ImgUploader></ImgUploader>
  </div>
</template>
<script>
import ImageBanner from "../components/ImageBanner";
import moviePoster from "../components/moviePoster";
import PreviewWriter from "../components/PreviewWriter";
import ReviewWriter from "../components/ReviewWriter";
import ImgUploader from "../components/ImgUploader";

export default {
  components: {
    ImageBanner,
    moviePoster,
    PreviewWriter,
    ReviewWriter
  },
  data() {
    return {};
  }
};
</script>
<style>
</style>
