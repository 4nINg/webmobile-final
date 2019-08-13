<template>
  <div class="reviewMainDiv">
    <!-- 글쓰기! -->
    <div class="writeBtnDiv">
      <span @click="showReviewWrite()" v-if="this.$store.state.user !== null">
        <i class="far fa-edit"></i>글쓰기
      </span>
      <span v-else style="cursor:default !important;">&nbsp;</span>
    </div>
    <span class="leftArrow" v-show="showIdx !== 0" @click="preList()">
      <i class="fas fa-chevron-left"></i>
    </span>
    <div class="ReviewsDiv">
      <div v-for="i in displayReviews.length" :key="i" class="review">
        <div class="hoverDiv" @click="showReview(i-1)">
          <div class="hoverInnerDiv">
            <span>
              <i class="far fa-plus-square"></i>
            </span>
          </div>
        </div>
        <div class="reviewContentDiv">
          <div>
            <h2 class="ellipsisReviewTitle">{{displayReviews[i-1].title}}</h2>
            <h3 class="ellipsisReviewContent">{{displayReviews[i-1].body}}</h3>
            <span class="ellipsisReviewWriter">{{displayReviews[i-1].writer}}</span>
          </div>
        </div>
      </div>
    </div>
    <span class="rightArrow" v-show="showIdx+6 < reviewList.length" @click="nextList()">
      <i class="fas fa-chevron-right"></i>
    </span>

    <div class="reviewModal">
      <div class="reviewModalContainer">
        <span class="closeReview" @click="closeReviewModal()">&times;</span>
        <div class="inModalreview" v-if="!isComment">
          <div class="reviewModalTitle">
            <span class="reviewTitle" v-if="!isReviewModify">{{reviewTitle}}</span>
            <input
              type="text"
              class="modifyReviewTitleInput"
              :value="reviewTitle"
              v-if="isReviewModify"
            />
          </div>
          <div class="reviewModalContent">
            <p class="reviewContent" v-if="!isReviewModify">{{reviewContent}}</p>
            <textarea class="modifyReviewContentInput" :value="reviewContent" v-if="isReviewModify"></textarea>
          </div>
          <div class="showCommentDiv">
            <!--  리뷰 수정 -->
            <div
              class="modifyReviewDiv"
              @click="modifyReview()"
              v-if="this.$store.state.user !== null && (this.$store.state.user.uid == reviewWriterUid || this.$store.state.user.grade == 1) && !isReviewModify"
            >
              <div class="modifyBtninner">
                <span class="modifyReview">수정</span>
              </div>
            </div>
            <div class="completeModifyReviewDiv" @click="completeModify()" v-if="isReviewModify">
              <div class="modifyCompleteInner">
                <span class="completeModifyReview">수정 완료</span>
              </div>
            </div>
            <!-- 리뷰 삭제 -->
            <div
              class="deleteReviewDiv"
              @click="deleteReview()"
              v-if="this.$store.state.user !== null && (this.$store.state.user.uid == reviewWriterUid || this.$store.state.user.grade == 1) && !isReviewModify"
            >
              <span>삭제</span>
            </div>
            <div
              class="showCommentBtn"
              @click="showReviewComment()"
              v-if="!isComment && !isReviewModify"
            >
              <span>
                <i class="far fa-comments"></i>댓글 보기
              </span>
            </div>
          </div>
        </div>
        <div class="comment" v-if="isComment">
          <div class="commentContainer">
            <div class="commentInnerDiv">
              <div v-for="i in reviewComment.length" :key="i" class="vForDiv">
                <h3>{{reviewComment[i-1].username}}</h3>
                <p class="reviewCommentContentP">{{reviewComment[i-1].content}}</p>
                <input type="text" class="modifyCommentInput" />
                <div class="commentBtnContainerDiv" v-if="checkSession(reviewComment[i-1].userUid)">
                  <!--  댓글 수정 -->
                  <div class="modifyCommentwDiv" @click="modifyReviewComment(i-1)">
                    <div class="modifyCommentBtninner">
                      <span class="modifyComment">수정</span>
                    </div>
                  </div>
                  <div class="completeModifyCommentDiv" @click="completeModifyReviewComment(i-1)">
                    <div class="modifyCompleteCommentInner">
                      <span>수정 완료</span>
                    </div>
                  </div>
                  <!--  댓글 삭제 -->
                  <div class="deleteCommentDiv" @click="deleteReviewComment(i-1)">
                    <span>삭제</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 댓글 작성 -->
            <div class="commentWriterDiv" v-if="this.$store.state.user !== null">
              <CommentWriter :reviewId="reviewId" @isSubmit="isSubmit"></CommentWriter>
            </div>
            <div class="showInModalreview" @click="backToTheReviewContent()" v-if="isComment">
              <span>
                <i class="fas fa-undo"></i>글 보기
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="reviewWriteModal">
      <div class="reviewWriteModalContent">
        <ReviewWriter @isSubmit="isSubmit"></ReviewWriter>
      </div>
    </div>
  </div>
</template>
<script>
import FirebaseService from "@/services/FirebaseService";
import CommentWriter from "@/components/CommentWriter";
import ReviewWriter from "@/components/ReviewWriter";

export default {
  components: {
    CommentWriter,
    ReviewWriter
  },
  data() {
    return {
      reviewList: [],
      commentList: [],
      displayReviews: [],
      showIdx: 0,
      reviewWriterUid: "", //리뷰 작성자 uid
      reviewId: "", //리뷰 식별자
      reviewTitle: "", //리뷰 제목
      reviewContent: "", //리뷰 내용
      reviewComment: [],
      displayedReview: 0,
      isReviewModify: false, //리뷰를 수정하나요?
      isComment: false // 댓글을 보고 있나요
    };
  },
  mounted() {
    this.reviewPageInit();
  },
  methods: {
    async reviewPageInit(){
      await this.setLoadingTrue();
      await this.getReviewList();
      await this.getReviewCommentList();
      await this.setLoadingFalse();
    },
    isSubmit() {
      this.getReviewList();
      this.getReviewCommentList();
    },
    async getReviewCommentList() {
      this.commentList = await FirebaseService.getReviewCommentList();
      if (this.reviewId !== null || this.reviewId !== "") {
        this.reviewComment = [];
        for (var j = 0; j < this.commentList.length; ++j) {
          if (this.commentList[j].reviewId === this.reviewId) {
            this.reviewComment.push(this.commentList[j]);
          }
        }
      }
    },
    async getReviewList() {
      this.reviewList = await FirebaseService.getReviewList();
      this.showList();
    },
    showList() {
      this.displayReviews = [];
      for (
        var i = this.showIdx;
        i <
        (this.showIdx + 6 > this.reviewList.length
          ? this.reviewList.length
          : this.showIdx + 6);
        ++i
      ) {
        this.displayReviews.push(this.reviewList[i]);
      }
    },
    nextList() {
      this.showIdx += 6;
      this.showList();
    },
    preList() {
      this.showIdx -= 6;
      this.showList();
    },
    showReview(i) {
      this.displayedReview = i + this.showIdx;
      this.reviewWriterUid = this.displayReviews[i].writerUid;
      this.reviewId = this.displayReviews[i].id;
      this.reviewTitle = this.displayReviews[i].title;
      this.reviewContent = this.displayReviews[i].body;
      this.reviewComment = [];
      for (var j = 0; j < this.commentList.length; ++j) {
        if (this.commentList[j].reviewId === this.reviewId) {
          this.reviewComment.push(this.commentList[j]);
        }
      }
      this.isComment = false;
      this.isReviewModify = false;
      document.querySelector(".reviewModal").style.display = "block";
    },
    closeReviewModal() {
      this.isComment = false;
      this.isReviewModify = false;
      document.querySelector(".reviewModal").style.display = "none";
    },
    showReviewComment() {
      this.isComment = true;
    },
    backToTheReviewContent() {
      this.isComment = false;
    },
    deleteReviewComment(index) {
      if (confirm("댓글을 삭제하시겠습니까?")) {
        FirebaseService.deleteReviewComment(this.reviewComment[index].id);
        this.getReviewCommentList();
      }
    },
    showReviewWrite() {
      document.querySelector(".reviewWriteModal").style.display = "block";
    },
    modifyReviewComment(index) {
      var beforeModifyComment = this.reviewComment[index].content;
      var modifyCommentDiv = document.querySelectorAll(".modifyCommentwDiv"); //수정버튼
      var deleteCommentDiv = document.querySelectorAll(".deleteCommentDiv"); // 삭제버튼
      var completeModifyCommentDiv = document.querySelectorAll(
        ".completeModifyCommentDiv"
      ); // 수정완료버튼
      var modifyCommentInput = document.querySelectorAll(".modifyCommentInput"); // 댓글 수정 인풋
      var reviewCommentContentP = document.querySelectorAll(
        ".reviewCommentContentP"
      ); // 원래 댓글 내용
      document.querySelector(".commentWriterDiv").style.display = "none"; // 댓글작성 창
      reviewCommentContentP[index].style.display = "none"; // 원래 내용 없앰
      modifyCommentInput[index].style.display = "block"; // 수정창 보임
      modifyCommentDiv[index].style.display = "none"; // 수정버튼 없앰
      deleteCommentDiv[index].style.display = "none"; // 삭제버튼 없앰
      completeModifyCommentDiv[index].style.display = "block"; //수정완료버튼 보임
      modifyCommentInput[index].value = beforeModifyComment;
    },
    completeModifyReviewComment(index) {
      var modifyCommentwDiv = document.querySelectorAll(".modifyCommentwDiv"); //수정버튼
      var deleteCommentDiv = document.querySelectorAll(".deleteCommentDiv"); // 삭제버튼
      var completeModifyCommentDiv = document.querySelectorAll(
        ".completeModifyCommentDiv"
      ); // 수정완료버튼
      var modifyCommentInput = document.querySelectorAll(".modifyCommentInput"); // 댓글 수정 인풋
      var reviewCommentContentP = document.querySelectorAll(
        ".reviewCommentContentP"
      ); // 원래 댓글 내용
      document.querySelector(".commentWriterDiv").style.display = "block"; // 댓글작성 창
      FirebaseService.modifyReviewComment(
        this.reviewComment[index].id,
        modifyCommentInput[index].value
      );
      this.getReviewCommentList();
      reviewCommentContentP[index].style.display = "block"; // 원래 내용 보임
      modifyCommentInput[index].style.display = "none"; // 수정창 없앰
      modifyCommentwDiv[index].style.display = "block"; // 수정버튼 보임
      deleteCommentDiv[index].style.display = "block"; // 삭제버튼 보임
      completeModifyCommentDiv[index].style.display = "none"; //수정완료버튼 없앰
    },
    modifyReview() {
      var beforeModifyTitle = document.querySelector(".reviewTitle").innerText;
      var beforeModifyContent = document.querySelector(".reviewContent")
        .innerText;
      this.isReviewModify = true;
    },
    completeModify() {
      for (var i = 0; i < this.reviewList.length; ++i) {
        if (this.reviewList[i].id === this.reviewId) {
          this.reviewList[i].title = this.reviewTitle;
          this.reviewList[i].body = document.querySelector(
            ".modifyReviewContentInput"
          ).value;
          this.reviewTitle = this.reviewList[i].title;
          this.reviewContent = this.reviewList[i].body;
          break;
        }
      }
      this.isReviewModify = false;
      FirebaseService.modifyReview(
        this.reviewId,
        this.reviewTitle,
        this.reviewContent
      );
      this.getReviewList();
    },
    deleteReview() {
      if (confirm("게시글을 삭제하시겠습니까?")) {
        FirebaseService.deleteReview(this.reviewId);
        this.isComment = false;
        document.querySelector(".reviewModal").style.display = "none";
        this.getReviewList();
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
  }
};
</script>
<style>
.reviewMainDiv {
  width: 90%;
  height: 81vh;
  margin-left: 10%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.reviewMainDiv > span {
  font-size: 2em;
  opacity: 0.6;
}

.writeBtnDiv {
  width: 70%;
  /* border-bottom: 1px solid black; */
  display: flex;
  justify-content: flex-end;
  position: absolute;
  top: 5.5%;
  right: 100px;
}

.writeBtnDiv span {
  cursor: pointer;
  font-size: 1.1em;
  margin-bottom: 1.5%;
}

.rightArrow {
  margin-right: 5%;
}

.ReviewsDiv {
  width: 85%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 5%;
}

.review {
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

.review:hover .hoverDiv {
  display: block;
}

.review:nth-child(4) {
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

.hoverDiv {
  cursor: pointer;
  position: absolute;
  width: 100%;
  height: 100%;
  display: none;
}

.reviewContentDiv {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(255, 255, 255, 0.5);
}

.reviewContentDiv span {
  margin-top: 10%;
  float: right;
}

.reviewContentDiv div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: space-between;
  width: 80%;
  height: 80%;
  overflow: hidden;
  margin-left: 10%;
  margin-right: 10%;
}
.leftArrow,
.rightArrow {
  cursor: pointer;
  top: 50%;
  color: white;
}

.reviewModal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.4);
}

.reviewWriteModal {
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

.reviewModalContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fefefe;
  height: 80%;
  width: 60%;
  margin-left: 20%;
  margin-top: 5%;
  position: relative;
  border: 1px solid black;
}

.reviewWriteModalContent {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  border: 1px solid black;
}

.inModalreview {
  height: 75%;
  width: 70%;
}

.reviewModalTitle {
  width: 100%;
  margin-bottom: 5%;
  padding-bottom: 3%;
  border-bottom: 1px solid black;
  font-size: 1.2em;
  font-weight: 600;
}

.reviewModalContainer {
  overflow: auto;
}

.reviewModalContent {
  width: 100%;
  height: 70%;
  margin-bottom: 5%;
  border-bottom: 1px solid black;
}

.reviewModalContent p {
  width: 100%;
  height: 90%;
  overflow: scroll;
}

.showCommentDiv {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5%;
}

.showCommentDiv > div:hover {
  box-shadow: 0.2em 0.2em 0.2em 0.2em rgb(0, 0, 0, 0.1);
}

.modifyCompleteCommentInner,
.modifyCommentBtninner,
.modifyBtninner,
.modifyCompleteInner {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.closeReview {
  cursor: pointer;
  position: absolute;
  top: 5%;
  right: 5%;
  font-size: 2em;
}

.commentInnerDiv {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 80%;
  overflow: scroll;
}

.showInModalreview {
  cursor: pointer;
  position: absolute;
  bottom: 0;
  right: 0;
}

.comment {
  height: 75%;
  width: 70%;
}

.commentContainer {
  width: 100%;
  height: 100%;
  position: relative;
}

.vForDiv {
  margin-top: 1%;
  padding-bottom: 3%;
  border-bottom: 1px solid rgb(0, 0, 0, 0.1);
  width: 100%;
}

.modifyReviewTitleInput {
  width: 97%;
  margin-bottom: 1%;
  padding: 1.5% 1.5% 1.5% 1.5%;
}

.modifyReviewContentInput {
  width: 100%;
  height: 90%;
}

.modifyReviewDiv,
.completeModifyReviewDiv,
.deleteReviewDiv,
.showCommentBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-align: center;
  width: 7em;
  height: 2.5em;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 1em;
}

.completeModifyCommentDiv,
.deleteCommentDiv,
.modifyCommentwDiv {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-align: center;
  width: 5em;
  height: 1.5em;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 1em;
}

.modifyCommentInput {
  display: none;
  margin-top: 1%;
  width: 90%;
  padding: 0.5% 0.5%;
  font-size: 1em;
}

.modifyCommentwDiv,
.deleteCommentDiv,
.completeModifyCommentDiv {
  cursor: pointer;
}

.completeModifyCommentDiv {
  display: none;
}

.commentBtnContainerDiv {
  margin-top: 2%;
  display: flex;
  justify-content: flex-end;
}

.ellipsisReviewContent {
  height: 40%;
}

.ellipsisReviewTitle,
.ellipsisReviewContent,
.ellipsisReviewWriter {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ellipsisReviewWriter {
  text-align: right;
}

.ellipsisReviewTitle {
  margin-bottom: 5%;
}

.previewCommentVForDivTitle {
  font-weight: bold;
  font-size: 1.2em;
}

.previewCommentBtnContainer,
.completeModifyPreviewCommentDiv,
.deletePreviewCommentDiv {
  cursor: pointer;
}
</style>
