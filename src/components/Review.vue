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
            <h2>{{displayReviews[i-1].title}}</h2>
            <h3>{{displayReviews[i-1].body}}</h3>
            <span>{{displayReviews[i-1].writer}}</span>
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
        <div class="inModalreview">
          <div class="reviewModalTitle">
            <span class="reviewTitle">{{reviewTitle}}</span>
            <input type="text" class="modifyReviewTitleInput" />
          </div>
          <div class="reviewModalContent">
            <p class="reviewContent">{{reviewContent}}</p>
            <textarea class="modifyReviewContentInput"></textarea>
          </div>
          <div class="showCommentDiv">
            <!--  리뷰 수정 -->
            <div class="modifyReviewDiv" @click="modifyReview()" v-if="this.$store.state.user !== null && (this.$store.state.user.uid == reviewWriterUid || this.$store.state.user.grade == 1)">
              <div class="modifyBtninner">
                <span class="modifyReview">수정</span>
              </div>
            </div>
            <div class="completeModifyReviewDiv" @click="completeModify()">
              <div class="modifyCompleteInner">
                <span class="completeModifyReview">수정 완료</span>
              </div>
            </div>
            <!-- 리뷰 삭제 -->
            <div class="deleteReviewDiv" @click="deleteReview()"  v-if="this.$store.state.user !== null && (this.$store.state.user.uid == reviewWriterUid || this.$store.state.user.grade == 1)">
              <span>삭제</span>
            </div>
            <div class="showCommentBtn" @click="showReviewComment()">
              <span>
                <i class="far fa-comments"></i>댓글 보기
              </span>
            </div>
          </div>
        </div>
        <div class="comment">
          <div class="commentContainer">
            <div class="commentInnerDiv">
              <div v-for="i in reviewCommentUsername.length" :key="i" class="vForDiv">
                <h3>{{reviewCommentUsername[i-1]}}</h3>
                <p class="reviewCommentContentP">{{reviewCommentContent[i-1]}}</p>
                <input type="text" class="modifyCommentInput" />
                <div class="commentBtnContainerDiv">
                  <!--  댓글 수정 -->
                  <div class="modifyCommentwDiv" @click="modifyReviewComment(i-1)">
                    <div class="modifyCommentBtninner">
                      <span class="modifyComment">수정</span>
                    </div>
                  </div>
                  <div class="completeModifyCommentDiv" @click="completeModifyReviewComment(i-1)">
                    <div class="modifyCompleteCommentInner">
                      <span class="completeModifyComment">수정 완료</span>
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
              <CommentWriter
                :reviewId="reviewId"
                :reviewCommentUsername="reviewCommentUsername"
                :reviewCommentContent="reviewCommentContent"
                :reviewCommentUserUid="reviewCommentUserUid"
                @isSubmit="isSubmit"
              ></CommentWriter>
            </div>

            <span class="showInModalreview" @click="backToTheReviewContent()">
              <i class="fas fa-undo"></i>글 보기
            </span>
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
      displayReviews: [],
      showIdx: 0,
      reviewWriterUid: "", //리뷰 작성자 uid
      reviewId: "", //리뷰 식별자
      reviewTitle: "", //리뷰 제목
      reviewContent: "", //리뷰 내용
      reviewCommentContent: [], //리뷰 댓글 내용
      reviewCommentUsername: [], //리뷰 댓글 작성자
      reviewCommentUserUid: [], //리뷰 댓글 작성자 uid
      displayedReview: 0
    };
  },
  mounted() {
    this.getReviewList();
  },
  methods: {
    isSubmit() {
      this.getReviewList();
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
    reShowList() {
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
      this.reShowList();
    },
    preList() {
      this.showIdx -= 6;
      this.reShowList();
    },
    showReview(i) {
      this.displayedReview = i + this.showIdx;
      this.reviewWriterUid = this.displayReviews[i].writerUid;
      this.reviewId = this.displayReviews[i].id;
      this.reviewTitle = this.displayReviews[i].title;
      this.reviewContent = this.displayReviews[i].body;
      if (this.displayReviews[i].commentUsername !== null) {
        if (this.displayReviews[i].commentUsername.length === 0) {
          this.reviewCommentUsername = [];
          this.reviewCommentContent = [];
          this.reviewCommentUserUid = [];
        } else {
          this.reviewCommentUsername = this.displayReviews[i].commentUsername;
          this.reviewCommentContent = this.displayReviews[i].commentContent;
          this.reviewCommentUserUid = this.displayReviews[i].commentUserUid;
        }
      }

      document.querySelector(".comment").style.display = "none";
      document.querySelector(".inModalreview").style.display = "block";
      document.querySelector(".reviewModal").style.display = "block";
    },
    closeReviewModal() {
      document.querySelector(".reviewModal").style.display = "none";
    },
    showReviewComment() {
      document.querySelector(".inModalreview").style.display = "none";
      document.querySelector(".comment").style.display = "block";
    },
    backToTheReviewContent() {
      document.querySelector(".inModalreview").style.display = "block";
      document.querySelector(".comment").style.display = "none";
    },
    deleteReviewComment(index) {
      var tempCommentUsername = [];
      var tempCommentContent = [];
      var tempCommentUserUid = [];
      for (var i = 0; i < this.reviewCommentUsername.length; ++i) {
        if (i !== index) {
          tempCommentUsername.push(this.reviewCommentUsername[i]);
          tempCommentContent.push(this.reviewCommentContent[i]);
          tempCommentUserUid.push(this.reviewCommentUserUid[i]);
        }
      }
      var tempReview = FirebaseService.deleteReviewComment(
        this.reviewId,
        tempCommentUsername,
        tempCommentContent,
        tempCommentUserUid
      );
      this.getReviewList();
      this.reviewCommentContent = tempCommentContent;
      this.reviewCommentUsername = tempCommentUsername;
      this.reviewCommentUserUid = tempCommentUserUid;
    },
    showReviewWrite() {
      document.querySelector(".reviewWriteModal").style.display = "block";
    },
    modifyReviewComment(index) {
      var beforeModifyComment = this.reviewCommentContent[index];
      var modifyCommentwDiv = document.querySelectorAll(".modifyCommentwDiv"); //수정버튼
      var deleteCommentDiv = document.querySelectorAll(".deleteCommentDiv"); // 삭제버튼
      var completeModifyCommentDiv = document.querySelectorAll(
        ".completeModifyCommentDiv"
      ); // 수정완료버튼
      var modifyCommentInput = document.querySelectorAll(".modifyCommentInput");
      var reviewCommentContentP = document.querySelectorAll(
        ".reviewCommentContentP"
      );
      document.querySelector(".commentWriterDiv").style.display = "none"; // 댓글작성 창

      for (var i = 0; i < reviewCommentContentP.length; ++i) {
        if (i === index) {
          reviewCommentContentP[i].style.display = "none"; // 원래 내용 없앰
          modifyCommentInput[i].style.display = "block"; // 수정창 보임
          modifyCommentwDiv[i].style.display = "none"; // 수정버튼 없앰
          deleteCommentDiv[i].style.display = "none"; // 삭제버튼 없앰
          completeModifyCommentDiv[i].style.display = "block"; //수정완료버튼 보임
          modifyCommentInput[i].value = beforeModifyComment;
          break;
        }
      }
    },
    completeModifyReviewComment(index) {
      var modifyCommentwDiv = document.querySelectorAll(".modifyCommentwDiv"); //수정버튼
      var deleteCommentDiv = document.querySelectorAll(".deleteCommentDiv"); // 삭제버튼
      var completeModifyCommentDiv = document.querySelectorAll(
        ".completeModifyCommentDiv"
      ); // 수정완료버튼
      var modifyCommentInput = document.querySelectorAll(".modifyCommentInput");
      var reviewCommentContentP = document.querySelectorAll(
        ".reviewCommentContentP"
      );
      document.querySelector(".commentWriterDiv").style.display = "block"; // 댓글작성 창

      for (var i = 0; i < this.reviewCommentContent.length; ++i) {
        if (index === i) {
          this.reviewCommentContent[i] = modifyCommentInput[i].value;
          reviewCommentContentP[i].innerText = modifyCommentInput[i].value;
          reviewCommentContentP[i].style.display = "block"; // 원래 내용 없앰
          modifyCommentInput[i].style.display = "none"; // 수정창 보임
          modifyCommentwDiv[i].style.display = "block"; // 수정버튼 없앰
          deleteCommentDiv[i].style.display = "block"; // 삭제버튼 없앰
          completeModifyCommentDiv[i].style.display = "none"; //수정완료버튼 보임
          break;
        }
      }

      FirebaseService.modifyReviewComment(
        this.reviewId,
        this.reviewCommentContent
      );
    },
    modifyReview() {
      var beforeModifyTitle = document.querySelector(".reviewTitle").innerText;
      var beforeModifyContent = document.querySelector(".reviewContent")
        .innerText;
      document.querySelector(".reviewTitle").style.display = "none";
      document.querySelector(".modifyReviewTitleInput").style.display = "block";
      document.querySelector(
        ".modifyReviewTitleInput"
      ).value = beforeModifyTitle;
      document.querySelector(".reviewContent").style.display = "none";
      document.querySelector(".modifyReviewContentInput").style.display =
        "block";
      document.querySelector(
        ".modifyReviewContentInput"
      ).innerText = beforeModifyContent;
      document.querySelector(".modifyReviewDiv").style.display = "none";
      document.querySelector(".completeModifyReviewDiv").style.display =
        "block";
    },
    completeModify() {
      for (var i = 0; i < this.reviewList.length; ++i) {
        if (this.reviewList[i].id === this.reviewId) {
          this.reviewList[i].title = document.querySelector(
            ".modifyReviewTitleInput"
          ).value;
          this.reviewList[i].body = document.querySelector(
            ".modifyReviewContentInput"
          ).value;
          this.reviewTitle = this.reviewList[i].title;
          this.reviewContent = this.reviewList[i].body;
          break;
        }
      }
      document.querySelector(".reviewTitle").style.display = "block";
      document.querySelector(".modifyReviewTitleInput").style.display = "none";
      document.querySelector(".reviewContent").style.display = "block";
      document.querySelector(".modifyReviewContentInput").style.display =
        "none";
      document.querySelector(".modifyReviewDiv").style.display = "block";
      document.querySelector(".completeModifyReviewDiv").style.display = "none";
      FirebaseService.modifyReview(
        this.reviewId,
        this.reviewTitle,
        this.reviewContent
      );
      this.getReviewList();
    },
    deleteReview() {
      FirebaseService.deleteReview(this.reviewId);
      document.querySelector(".comment").style.display = "none";
      document.querySelector(".inModalreview").style.display = "none";
      document.querySelector(".reviewModal").style.display = "none";
      this.getReviewList();
    }
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
  border-bottom: 1px solid black;
  display: flex;
  justify-content: flex-end;
  position: absolute;
  top: 8%;
  right: 5%;
}

.writeBtnDiv span {
  cursor: pointer;
  font-size: 1.1em;
  margin-bottom: 2.5%;
}

.rightArrow {
  margin-right: 5%;
}

.ReviewsDiv {
  width: 85%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 1%;
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
  width: 80%;
  overflow: hidden;
  margin-left: 10%;
  margin-right: 10%;
}
.leftArrow,
.rightArrow {
  cursor: pointer;
  top: 50%;
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
  margin: 10% auto;
  height: 65%;
  width: 45%;
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
  display: none;
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
  display: none;
  width: 100%;
  margin-bottom: 1%;
  padding: 1.5% 1.5% 1.5% 1.5%;
}

.modifyReviewContentInput {
  display: none;
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

.completeModifyReviewDiv {
  display: none;
}

.modifyCommentInput,
.completeModifyCommentDiv {
  display: none;
}

.modifyCommentwDiv,
.deleteCommentDiv,
.completeModifyCommentDiv {
  cursor: pointer;
}

.commentBtnContainerDiv {
  margin-top: 2%;
  display: flex;
  justify-content: flex-end;
}
</style>
