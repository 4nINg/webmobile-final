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
      <div class="preview" v-for="i in displayPreview.length" :key="i">
        <div class="hoverDiv" @click="showPreview(i-1)">
          <div class="hoverInnerDiv">
            <span>
              <i class="far fa-plus-square"></i>
            </span>
          </div>
        </div>
        <div class="previewContentDiv">
          <img :src="displayPreview[i-1].imgUrl" />
        </div>
      </div>
    </div>
    <span class="rightArrow" v-show="showIdx+6 < previewList.length" @click="nextPreviewList()">
      <i class="fas fa-chevron-right"></i>
    </span>

    <div class="previewModal">
      <div class="previewModalContainer">
        <span class="closePreview" @click="closePreviewModal()">&times;</span>
        <div class="inModalPreview" v-if="!isPreviewComment">
          <div class="inModalPreviewNotBtn">
            <div class="inModalPreviewImgPart">
              <img :src="previewImg" />
              <ImgUploader v-if="isPreviewModify" ref="uploader" class="imgUploader"></ImgUploader>
            </div>
            <div class="inModalPreviewContentPart">
              <div class="previewModalTitle">
                <span class="preveiwTitle" v-if="!isPreviewModify">{{previewTitle}}</span>
                <input
                  type="text"
                  class="modifyPreviewTitleInput"
                  v-if="isPreviewModify"
                  :value="previewTitle"
                />
              </div>
              <div class="previewModalContent">
                <p class="previewContent" v-if="!isPreviewModify">{{previewContent}}</p>
                <textarea
                  class="modifyPreviewContentInput"
                  v-if="isPreviewModify"
                  :value="previewContent"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="inmodalPreviewBtnDiv">
            <div
              class="modifyPreviewDiv"
              @click="modifyPreview()"
              v-if="this.$store.state.user !== null && (this.$store.state.user.uid == previewWriterUid || this.$store.state.user.grade == 1) && !isPreviewModify"
            >
              <div class="modifyPreviewInner">
                <span>수정</span>
              </div>
            </div>
            <div
              class="completeModifyPreviewDiv"
              @click="completeModifyPreview()"
              v-if="isPreviewModify"
            >
              <div class="modifyCompletePreviewInner">
                <span>수정 완료</span>
              </div>
            </div>
            <div
              class="deletePreviewDiv"
              @click="deletePreview()"
              v-if="this.$store.state.user !== null && (this.$store.state.user.uid == previewWriterUid || this.$store.state.user.grade == 1) && !isPreviewModify"
            >
              <span>삭제</span>
            </div>
            <div
              class="showPreviewCommentBtn"
              @click="showPreviewComment()"
              v-if="!isPreviewComment && !isPreviewModify"
            >
              <span>
                <i class="far fa-comments"></i>댓글 보기
              </span>
            </div>
          </div>
        </div>

        <div class="previewComment" v-if="isPreviewComment">
          <div class="previewCommentContainer">
            <div class="previewCommentInnerDiv">
              <div class="previewCommentVForDiv" v-for="i in previewComment.length" :key="i">
                <span class="previewCommentVForDivUsername">{{previewComment[i-1].username}}</span>
                <span class="previewCommentVForDivContent">{{previewComment[i-1].content}}</span>
                <input type="text" class="modifyPreviewCommentInput" />

                <div class="previewCommentBtnContainer" v-if="checkSession(previewComment[i-1].userUid)">
                  <div class="modifyPreviewCommentDiv" @click="modifyPreviewComment(i-1)">
                    <div class="modifyPreviewCommentInner">
                      <span>수정</span>
                    </div>
                  </div>
                  <div
                    class="completeModifyPreviewCommentDiv"
                    @click="completeModifyPreviewComment(i-1)"
                  >
                    <div class="completeModifyPreviewCommentInner">
                      <span>수정 완료</span>
                    </div>
                  </div>
                  <div class="deletePreviewCommentDiv" @click="deletePreviewComment(i-1)">
                    <span>삭제</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="previewCommentWriteDiv" v-if="this.$store.state.user !== null">
              <PreviewCommentWriter :previewId="previewId" @isSubmit="isSubmit"></PreviewCommentWriter>
            </div>
            <div
              class="showinModalPreview"
              @click="backToThePreviewContent()"
              v-if="isPreviewComment"
            >
              <span>
                <i class="fas fa-undo"></i>글 보기
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="previewWriteModal">
      <div class="previewWriteModalContent">
        <PreviewWriter @isSubmit="isSubmit"></PreviewWriter>
      </div>
    </div>
  </div>
</template>
<script>
import PreviewWriter from "@/components/PreviewWriter";
import FirebaseService from "../services/FirebaseService";
import ImgUploader from "../components/ImgUploader";
import PreviewCommentWriter from "../components/PreviewCommentWriter";

export default {
  data() {
    return {
      previewList: [],
      commentList: [],
      displayPreview: [],
      showIdx: 0,
      previewWriterUid: "",
      previewId: "",
      previewImg: "",
      previewTitle: "",
      previewContent: "",
      previewComment: [],
      displayedPreview: 0,
      isModify: false,
      isPreviewModify: false,
      isPreviewComment: false
    };
  },
  methods: {
    async previewPageInit(){
      await this.setLoadingTrue();
      await this.getPreviewList();
      await this.getPreviewCommentList();
      await this.setLoadingFalse();
    },
    isSubmit() {
      this.getPreviewCommentList();
      this.getPreviewList();
    },
    async getPreviewCommentList() {
      this.commentList = await FirebaseService.getPreviewCommentList();
      if (this.previewId !== null && this.previewId !== "") {
        this.previewComment = [];
        for (var j = 0; j < this.commentList.length; ++j) {
          if (this.commentList[j].previewId === this.previewId) {
            this.previewComment.push(this.commentList[j]);
          }
        }
      }
    },
    async getPreviewList() {
      this.previewList = await FirebaseService.getPreviewList();
      this.showList();
    },
    showList() {
      this.displayPreview = [];
      for (
        var i = this.showIdx;
        i <
        (this.showIdx + 6 < this.previewList.length
          ? this.showIdx + 6
          : this.previewList.length);
        ++i
      ) {
        this.displayPreview.push(this.previewList[i]);
      }
    },
    nextPreviewList() {
      this.showIdx += 6;
      this.showList();
    },
    prePreviewList() {
      this.showIdx -= 6;
      this.showList();
    },
    showPreview(i) {
      this.displayedPreview = i + this.showIdx;
      this.previewWriterUid = this.displayPreview[i].writerUid;
      this.previewId = this.displayPreview[i].id;
      this.previewImg = this.displayPreview[i].imgUrl;
      this.previewTitle = this.displayPreview[i].title;
      this.previewContent = this.displayPreview[i].body;
      this.previewComment = [];
      for (var j = 0; j < this.commentList.length; ++j) {
        if (this.commentList[j].previewId === this.previewId) {
          this.previewComment.push(this.commentList[j]);
        }
      }
      this.isPreviewComment = false;
      this.isPreviewModify = false;
      document.querySelector(".previewModal").style.display = "block";
    },
    closePreviewModal() {
      this.isModify = false; // 이미지 업로더
      this.isPreviewComment = false;
      this.isPreviewModify = false;
      document.querySelector(".previewModal").style.display = "none";
    },
    showPreviewComment() {
      this.isPreviewComment = true;
    },
    backToThePreviewContent() {
      this.isPreviewComment = false;
    },
    deletePreviewComment(index) {
      if (confirm("댓글을 삭제하시겠습니까?")) {
        FirebaseService.deletePreviewComment(this.previewComment[index].id);
        this.getPreviewCommentList();
      }
    },
    showPreviewWrite() {
      document.querySelector(".previewWriteModal").style.display = "block";
    },
    modifyPreviewComment(index) {
      var beforeModifyCommentValue = this.previewComment[index].content; // 내용 들고 오기
      var modifyPreviewCommentDiv = document.querySelectorAll(
        ".modifyPreviewCommentDiv"
      ); // 수정 버튼
      var deletePreviewCommentDiv = document.querySelectorAll(
        ".deletePreviewCommentDiv"
      ); // 삭제 버튼
      var completeModifyPreviewCommentDiv = document.querySelectorAll(
        ".completeModifyPreviewCommentDiv"
      ); // 수정 완료 버튼
      var modifyPreviewCommentInput = document.querySelectorAll(
        ".modifyPreviewCommentInput"
      ); // 수정시 이용할 인풋
      var previewCommentVForDivContent = document.querySelectorAll(
        ".previewCommentVForDivContent"
      ); // 원래 댓글 내용

      // document.querySelector(".previewCommentWriteDiv").style.display = "none"; // 댓글 작성창
      previewCommentVForDivContent[index].style.display = "none";
      modifyPreviewCommentInput[index].style.display = "block";
      modifyPreviewCommentDiv[index].style.display = "none";
      deletePreviewCommentDiv[index].style.display = "none";
      completeModifyPreviewCommentDiv[index].style.display = "block";
      modifyPreviewCommentInput[index].value = beforeModifyCommentValue;
    },
    completeModifyPreviewComment(index) {
      var modifyPreviewCommentDiv = document.querySelectorAll(
        ".modifyPreviewCommentDiv"
      ); //수정버튼
      var deletePreviewCommentDiv = document.querySelectorAll(
        ".deletePreviewCommentDiv"
      ); // 삭제버튼
      var completeModifyPreviewCommentDiv = document.querySelectorAll(
        ".completeModifyPreviewCommentDiv"
      ); // 수정완료버튼
      var modifyPreviewCommentInput = document.querySelectorAll(
        ".modifyPreviewCommentInput"
      ); // 댓글 수정 인풋
      var previewCommentVForDivContent = document.querySelectorAll(
        ".previewCommentVForDivContent"
      ); // 원래 댓글 내용
      // document.querySelector(".previewCommentWriteDiv").style.display = "block"; // 댓글작성 창
      FirebaseService.modifyPreviewComment(
        this.previewComment[index].id,
        modifyPreviewCommentInput[index].value
      );
      this.getPreviewCommentList();
      previewCommentVForDivContent[index].style.display = "block"; // 원래 내용 보임
      modifyPreviewCommentInput[index].style.display = "none"; // 수정창 없앰
      modifyPreviewCommentDiv[index].style.display = "block"; // 수정버튼 보임
      deletePreviewCommentDiv[index].style.display = "block"; // 삭제버튼 보임
      completeModifyPreviewCommentDiv[index].style.display = "none"; //수정완료버튼 없앰
    },

    modifyPreview() {
      var beforeModifyTitle = document.querySelector(".preveiwTitle").innerText;
      var beforeModifyContent = document.querySelector(".previewContent")
        .innerText;
      this.isModify = true;
      this.isPreviewModify = true;
    },
    completeModifyPreview() {
      for (var i = 0; i < this.previewList.length; ++i) {
        if (this.previewList[i].id === this.previewId) {
          this.previewList[i].title = this.previewTitle;
          this.previewList[i].body = document.querySelector(
            ".modifyPreviewContentInput"
          ).value;
          this.previewTitle = this.previewList[i].title;
          this.previewContent = this.previewList[i].body;
          break;
        }
      }
      this.isPreviewModify = false;
      var imgUrl = this.$refs.uploader.imageUrl;
      if (imgUrl === "" || imgUrl === null) {
        FirebaseService.modifyPreview(
          this.previewId,
          this.previewTitle,
          this.previewContent,
          "",
          ""
        );
      } else {
        this.previewImg = imgUrl;
        FirebaseService.modifyPreview(
          this.previewId,
          this.previewTitle,
          this.previewContent,
          this.$refs.uploader.imageUrl,
          this.$refs.uploader.imageName
        );
      }
      this.isModify = false;
      this.getPreviewList();
    },
    deletePreview() {
      if (confirm("게시글을 삭제하시겠습니까?")) {
        FirebaseService.deletePreview(this.previewId);
        this.getPreviewList();
        this.isPreviewComment = false;
        document.querySelector(".previewModal").style.display = "none";
      }
    },
    checkSession(uid){
      if(this.$store.state.user !== null && (this.$store.state.user.uid == uid || this.$store.state.user.grade == 1)){
        return true;
      }else{
        return false;
      }
    },
    setLoadingTrue(){
       this.$store.state.loading = true;
     },
     setLoadingFalse(){
       this.$store.state.loading = false;
     },
  },
  components: {
    PreviewWriter,
    ImgUploader,
    PreviewCommentWriter
  },
  mounted() {
    this.previewPageInit();
    this.isModify = false;
  }
};
</script>
<style>
.previewMainDiv {
  width: 90%;
  height: 81vh;
  margin-left: 10%;
  display: flex;
  justify-content: space-around;
  align-items: center;
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

.PreviewDiv {
  width: 85%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 5%;
}

.preview {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgb(0, 0, 0, 0.1);
  margin-right: 3%;
  margin-left: 1%;
  width: 23%;
  height: 41.7%;
}

.preview:hover .hoverDiv {
  display: block;
}

.preview:nth-child(4) {
  margin-left: 19%;
}

.hoverInnerDiv {
  width: 100%;
  height: 100%;
  font-size: 2em;
  background-color: rgb(0, 0, 0, 0.7);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.previewContentDiv {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.previewContentDiv img {
  width: 100%;
  height: 100%;
}

.leftArrow,
.rightArrow {
  cursor: pointer;
  top: 50%;
  font-size: 2em;
  opacity: 0.6;
}

.previewModal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgb(0, 0, 0, 0.4);
}

.previewModalContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fefefe;
  height: 80%;
  width: 80%;
  margin-left: 10%;
  margin-top: 5%;
  position: relative;
  border: 1px solid black;
  overflow: auto;
}

.closePreview {
  cursor: pointer;
  position: absolute;
  top: 5%;
  right: 5%;
  font-size: 2em;
}

.inModalPreview {
  width: 90%;
  height: 75%;
}

.inModalPreviewNotBtn {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 90%;
}

.inModalPreviewImgPart {
  width: 40%;
  height: 100%;
  /* border: 1px solid rgb(0, 0, 0, 0.4); */
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.inModalPreviewImgPart img {
  border: 1px solid rgb(0, 0, 0, 0.4);
  width: 100%;
  height: 95%;
}

.inModalPreviewContentPart {
  width: 40%;
  height: 100%;
}

.previewModalTitle {
  width: 100%;
  height: 10%;
  margin-bottom: 5%;
  padding-bottom: 3%;
  border-bottom: 1px solid black;
  font-size: 1.2em;
  font-weight: 600;
}

.preveiwTitle {
  width: 100%;
  height: 100%;
}

.modifyPreviewTitleInput {
  width: 100%;
  height: 100%;
  padding: 1.5% 1.5% 1.5% 1.5%;
}

.previewModalContent {
  width: 100%;
  height: 82%;
  margin-bottom: 5%;
  border-bottom: 1px solid black;
}

.previewContent {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.modifyPreviewContentInput {
  width: 100%;
  height: 100%;
}

.inmodalPreviewBtnDiv {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 10%;
  width: 100%;
  margin-top: 3%;
}

.inmodalPreviewBtnDiv > div:hover {
  box-shadow: 0.2em 0.2em 0.2em 0.2em rgb(0, 0, 0, 0.1);
}

.completeModifyPreviewCommentInner {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.modifyPreviewDiv,
.completeModifyPreviewDiv,
.deletePreviewDiv,
.showPreviewCommentBtn {
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 1em;
}

.modifyPreviewInner,
.modifyCompletePreviewInner,
.deletePreviewDiv,
.showPreviewCommentBtn {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 7em;
  height: 1.5em;
}

.previewComment {
  width: 90%;
  height: 75%;
}

.previewCommentContainer {
  width: 100%;
  height: 100%;
  position: relative;
}

.previewCommentInnerDiv {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 80%;
  overflow: auto;
}

.previewCommentVForDiv {
  margin-top: 1%;
  padding-bottom: 1%;
  border-bottom: 1px solid rgb(0, 0, 0, 0.1);
  width: 100%;
  display: flex;
  flex-direction: column;
}

.showinModalPreview {
  cursor: pointer;
  position: absolute;
  bottom: 0;
  right: 0;
}

.modifyPreviewCommentInput {
  display: none;
  width: 95%;
  padding: 0.5% 0.5%;
  font-size: 1em;
}

.previewCommentBtnContainer {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5%;
  width: 98%;
}

.completeModifyPreviewCommentDiv {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-align: center;
  width: 5em;
  height: 1.5em;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 0.5em;
}

.completeModifyPreviewCommentDiv {
  display: none;
}

.modifyPreviewCommentInner {
  width: 4em;
  height: 1.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-right: 1%;
  border: 1px solid rgb(0, 0, 0, 0.5);
  border-radius: 0.5em;
}
.deletePreviewCommentDiv {
  width: 4em;
  height: 1.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-right: 1%;
  margin-left: 1%;
  border: 1px solid rgb(0, 0, 0, 0.5);
  border-radius: 0.5em;
}
</style>
