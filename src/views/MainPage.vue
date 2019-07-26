<template>
  <div>
    <div class="mainDiv">
      <Header></Header>
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
    <!-- <ImageBanner></ImageBanner>
    <moviePoster></moviePoster>


    
    <ReviewWriter></ReviewWriter>
    <PreviewWriter></PreviewWriter>
    <ImgUploader></ImgUploader> -->
  </div>
</template>

<script>
import ImageBanner from "../components/ImageBanner";
import moviePoster from "../components/moviePoster";
import PreviewWriter from "../components/PreviewWriter";
import ReviewWriter from "../components/ReviewWriter";
import ImgUploader from "../components/ImgUploader";
import Header from "@/components/Header";

export default {
  components: {
    ImageBanner,
    moviePoster,
    PreviewWriter,
    ReviewWriter,
    Header
  }
};
</script>

<style>
.mainDiv {
  width: 100vw;
  height: 100vh;
}

.slogan {
  color: white;
  margin-left: 8%;
  width: 90%;
  height: 80%;
  font-size: 3.5em;
  font-family: "Courgette", cursive;
  /* font-family: "Kaushan Script", cursive; */
  /* font-weight: 600; */
  /* text-shadow: 30px 30px black; */
}

.firstSlogan {
  position: absolute;
  top: 30%;
  /* left: 10%; */
}

.secondSlogan {
  position: absolute;
  bottom: 30%;
  right: 4%;
}

.colorSlogan {
  /* color: rgb(255, 98, 0); */
  /* color: red; */
}
</style>
