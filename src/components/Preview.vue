<template>
  <div class="previewMainDiv">
    <div class="writeBtnDiv">
      <span @click="showPreviewWrite()">
        <i class="far fa-edit"></i>글쓰기
      </span>
    </div>
    <span class="leftArrow" v-show="showIdx !== 0" @click="prePreviewList()">
      <i class="fas fa-chevron-left"></i>
    </span>
    <div class="PreviewDiv">
      <div class="preview" v-for="i in displayPreview" :key="i">
        <div class="hoverDiv" @click="showReview(i-1)">
          <div class="hoverInnerDiv">
            <span>
              <i class="far fa-plus-square"></i>
            </span>
          </div>
        </div>
        <div class="previewContentDiv">
          <div>
            <div>img</div>
            <div>
              <div>title</div>
              <div>content</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span class="rightArrow" v-show="showIdx+6 < previewList.length" @click="nextPreviewList()">
      <i class="fas fa-chevron-right"></i>
    </span>
    <previewModal :displayedPreview="displayedPreview"></previewModal>
    <div class="previewWriteModal">
      <div class="previewWriteModalContent">
        <PreviewWriter></PreviewWriter>
      </div>
    </div>
  </div>
</template>
<script>
// import previewModal from "@/components/previewModal";
import PreviewWriter from "@/components/PreviewWriter";
export default {
  data() {
    return {
      displayPreview: null,
      showIdx: 0,
      previewList: [],
      displayedPreview: []
    };
  },
  methods: {
    showPreviewWrite() {
      document.querySelector(".previewWriteModal").style.display = "block";
    }
  },
  components: {
    // previewModal,
    PreviewWriter
  }
};
</script>
<style>
.previewMainDiv {
  width: 90%;
  height: 81vh;
  margin-left: 10%;
}

.previewWriteModal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgb(255, 255, 255, 0.7);
}

.previewWriteModalContent {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
}
</style>

