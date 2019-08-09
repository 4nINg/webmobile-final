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
        <div class="inModalPreview">
          <div class="inModalPreviewNotBtn">
            <div class="inModalPreviewImgPart">
              <img :src="previewImg" />
              <ImgUploader v-if="isModify" ref="uploader" class="imgUploader"></ImgUploader>
            </div>
            <div class="inModalPreviewContentPart">
              <div class="previewModalTitle">
                <span class="preveiwTitle">{{previewTitle}}</span>
                <input type="text" class="modifyPreviewTitleInput" />
              </div>
              <div class="previewModalContent">
                <p class="previewContent">{{previewContent}}</p>
                <textarea class="modifyPreviewContentInput"></textarea>
              </div>
            </div>
          </div>
          <div class="inmodalPreviewBtnDiv">
            <div class="modifyPreviewDiv" @click="modifyPreview()">
              <div class="modifyPreviewInner">
                <span>수정</span>
              </div>
            </div>
            <div class="completeModifyPreviewDiv" @click="completeModifyPreview()">
              <div class="modifyCompletePreviewInner">
                <span>수정 완료</span>
              </div>
            </div>
            <div class="deletePreviewDiv" @click="deletePreview()">
              <span>삭제</span>
            </div>
            <div class="showPreviewCommentBtn" @click="showPreviewComment()">
              <span>
                <i class="far fa-comments"></i>댓글 보기
              </span>
            </div>
          </div>
        </div>

        <div class="previewComment">
          <div class="previewCommentContainer">
            <div class="previewCommentInnerDiv">
              <div
                class="previewCommentVForDiv"
                v-for="i in previewCommentUserName.length"
                :key="i"
              >
                <span class="previewCommentVForDivTitle">{{previewCommentUserName[i-1]}}</span>
                <span class="previewCommentVForDivContent">{{previewCommentContent[i-1]}}</span>
                <input type="text" class="modifyPreviewCommentInput" />

                <div class="previewCommentBtnContainer">
                  <div class="modifyPreviewCommentDiv">
                    <div class="modifyPreviewCommentInner">
                      <span>수정</span>
                    </div>
                  </div>
                  <div class="completeModifyPreviewCommentDiv">
                    <div class="completeModifyPreviewCommentInner">
                      <span>수정 완료</span>
                    </div>
                  </div>
                  <div class="deletePreviewCommentDiv">
                    <span>삭제</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="previewCommentWriteDiv">
              <PreviewCommentWriter
                :previewId="previewId"
                :previewCommentUserName="previewCommentUserName"
                :previewCommentContent="previewCommentContent"
                :previewCommentUserUid="previewCommentUserUid"
                @isSubmit="isSubmit"
              ></PreviewCommentWriter>
            </div>
            <span class="showinModalPreview" @click="backToThePreviewContent()">
              <i class="fas fa-undo"></i>글 보기
            </span>
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
      displayPreview: [],
      showIdx: 0,
      previewId: "",
      previewImg: "",
      previewTitle: "",
      previewContent: "",
      previewCommentContent: [],
      previewCommentUserName: [],
      previewCommentUserUid: [],
      displayedPreview: 0,
      isModify: false
    };
  },
  methods: {
    isSubmit() {
      this.getPreviewList();
    },
    showPreviewWrite() {
      document.querySelector(".previewWriteModal").style.display = "block";
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
      this.previewId = this.displayPreview[i].id;
      this.previewImg = this.displayPreview[i].imgUrl;
      this.previewTitle = this.displayPreview[i].title;
      this.previewContent = this.displayPreview[i].body;

      if (this.displayPreview[i].commentUserUid.length === 0) {
        this.previewCommentUserName = [];
        this.previewCommentContent = [];
        this.previewCommentUserUid = [];
      } else {
        this.previewCommentUserName = this.displayPreview[i].commentUserName;
        this.previewCommentContent = this.displayPreview[i].commentContent;
        this.previewCommentUserUid = this.displayPreview[i].commentUserUid;
      }

      document.querySelector(".previewComment").style.display = "none";
      document.querySelector(".inModalPreview").style.display = "block";
      document.querySelector(".previewModal").style.display = "block";
    },
    closePreviewModal() {
      document.querySelector(".modifyPreviewTitleInput").style.display = "none";
      document.querySelector(".preveiwTitle").style.display = "block";
      document.querySelector(".modifyPreviewContentInput").style.display =
        "none";
      document.querySelector(".previewContent").style.display = "block";
      document.querySelector(".modifyPreviewDiv").style.display = "block";
      document.querySelector(".completeModifyPreviewDiv").style.display =
        "none";
      this.isModify = false;
      document.querySelector(".previewModal").style.display = "none";
    },
    modifyPreview() {
      var beforeModifyTitle = document.querySelector(".preveiwTitle").innerText;
      var beforeModifyContent = document.querySelector(".previewContent")
        .innerText;
      this.isModify = true;
      document.querySelector(".preveiwTitle").style.display = "none";
      document.querySelector(".modifyPreviewTitleInput").style.display =
        "block";
      document.querySelector(
        ".modifyPreviewTitleInput"
      ).value = beforeModifyTitle;
      document.querySelector(".previewContent").style.display = "none";
      document.querySelector(".modifyPreviewContentInput").style.display =
        "block";
      document.querySelector(
        ".modifyPreviewContentInput"
      ).value = beforeModifyContent;

      document.querySelector(".modifyPreviewDiv").style.display = "none";
      document.querySelector(".completeModifyPreviewDiv").style.display =
        "block";
    },
    completeModifyPreview() {
      for (var i = 0; i < this.previewList.length; ++i) {
        if (this.previewList[i].id === this.previewId) {
          this.previewList[i].title = document.querySelector(
            ".modifyPreviewTitleInput"
          ).value;
          this.previewList[i].body = document.querySelector(
            ".modifyPreviewContentInput"
          ).value;
          this.previewTitle = this.previewList[i].title;
          this.previewContent = this.previewList[i].body;
          break;
        }
      }
      document.querySelector(".modifyPreviewTitleInput").style.display = "none";
      document.querySelector(".preveiwTitle").style.display = "block";
      document.querySelector(".modifyPreviewContentInput").style.display =
        "none";
      document.querySelector(".previewContent").style.display = "block";
      document.querySelector(".modifyPreviewDiv").style.display = "block";
      document.querySelector(".completeModifyPreviewDiv").style.display =
        "none";

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
        document.querySelector(".previewComment").style.display = "none";
        document.querySelector(".inModalPreview").style.display = "none";
        document.querySelector(".previewModal").style.display = "none";
      }
    },
    showPreviewComment() {
      document.querySelector(".inModalPreview").style.display = "none";
      document.querySelector(".previewComment").style.display = "block";
    },
    backToThePreviewContent() {
      document.querySelector(".inModalPreview").style.display = "block";
      document.querySelector(".previewComment").style.display = "none";
    },
    deletePreviewComment(index) {
      var tempCommentUserName = [];
      var tempCommentContent = [];
      var tempCommentUserUid = [];
      for (var i = 0; i < this.previewCommentUserUid.length; ++i) {
        if (i !== index) {
          tempCommentUserName.push(this.previewCommentUserName[i]);
          tempCommentContent.push(this.previewCommentContent[i]);
          tempCommentUserUid.push(this.previewCommentUserUid[i]);
        }
      }
      var tempPreview = FirebaseService.deletePreviewComment(
        this.previewId,
        tempCommentUserName,
        tempCommentContent,
        tempCommentUserUid
      );
      this.getPreviewList();
      this.previewCommentContent = tempCommentContent;
      this.previewCommentUserName = tempCommentUserName;
    },
    modifyPreviewComment(index) {
      var beforeModifyCommentValue = this.previewCommentContent[index]; // 내용 들고 오기
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
      var previewCommentContent = document.querySelectorAll(
        ".previewCommentContent"
      );

      document.querySelector(".previewCommentWriteDiv").style.display = "none";

      for (var i = 0; i < previewCommentContent.length; ++i) {
        if (i === index) {
          previewCommentContent[i].style.display = "none";
          modifyPreviewCommentInput[i].style.display = "block";
          modifyPreviewCommentDiv[i].style.display = "none";
          deletePreviewCommentDiv[i].style.display = "none";
          completeModifyPreviewCommentDiv[i].style.display = "block";
          modifyPreviewCommentInput[i].value = beforeModifyCommentValue;
          break;
        }
      }
    },
    completeModifyPreviewComment(index) {}
  },
  components: {
    PreviewWriter,
    ImgUploader,
    PreviewCommentWriter
  },
  mounted() {
    this.getPreviewList();
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
  margin-top: 1%;
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
  display: none;
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
  display: none;
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

.completeModifyPreviewDiv {
  display: none;
}

.previewComment {
  display: none;
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
}

.completeModifyPreviewCommentDiv {
  display: none;
}

.modifyPreviewCommentInner {
  width: 4em;
  height: 2em;
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
  height: 2em;
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
