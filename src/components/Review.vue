<template>
  <div class="reviewMainDiv">
    <div class="writeBtnDiv">
      <span @click="showReviewWrite()">
        <i class="far fa-edit"></i>글쓰기
      </span>
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
            <h1>{{reviewTitle}}</h1>
          </div>
          <div class="reviewModalContent">
            <p>{{reviewContent}}</p>
          </div>
          <div class="showCommentDiv">
            <span class="showCommentBtn" @click="showComment()">
              <i class="far fa-comments"></i>댓글 보기
            </span>
          </div>
        </div>
        <div class="comment">
          <div class="commentContainer">
            <div class="commentInnerDiv">
              <div v-for="i in reviewCommentUser.length" :key="i" class="vForDiv">
                <h3>{{reviewCommentUser[i-1]}}</h3>
                <p>{{reviewCommentContent[i-1]}}</p>
                <button @click="deleteComment(reviewCommentUser[i-1].reviewId)">삭제</button>
              </div>
              <div class="commentWriterDiv">
<<<<<<< HEAD
                <CommentWriter :reviewId="reviewId" :comments="comments" :reviewCommentUser="reviewCommentUser" :reviewCommentContent="reviewCommentContent"></CommentWriter>
=======
                <CommentWriter
                  :reviewId="reviewId"
                  :reviewCommentUser="reviewCommentUser"
                  :reviewCommentContent="reviewCommentContent"
                ></CommentWriter>
>>>>>>> jg
              </div>
            </div>
            <div>
              <span class="showInModalreview" @click="backToTheComment()">
                <i class="fas fa-undo"></i>글 보기
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="reviewWriteModal">
      <div class="reviewWriteModalContent">
        <ReviewWriter></ReviewWriter>
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
      reviewId: "",
      reviewTitle: "",
      reviewContent: "",
      reviewCommentContent: [],
      reviewCommentUser: [],
      comments: [],
    };
  },
  mounted() {
    this.getReviewList();
  },
  methods: {
    async getReviewList() {
      this.reviewList = await FirebaseService.getReviewList();
      this.showList();
    },
    showList() {
      this.displayReviews = [];
      for (var i = this.showIdx; i < this.showIdx + 6; ++i) {
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
      this.reviewId = this.displayReviews[i].id;
<<<<<<< HEAD
      // console.log("dfdf : "+this.reviewId );
=======
      console.log("dfdf : " + this.reviewId);
>>>>>>> jg
      this.reviewTitle = this.displayReviews[i].title;
      this.reviewContent = this.displayReviews[i].body;
      if (this.displayReviews[i].userid !== null) {
        this.reviewCommentUser = this.displayReviews[i].userId;
        this.reviewCommentContent = this.displayReviews[i].comment;
      }

      document.querySelector(".comment").style.display = "none";
      document.querySelector(".inModalreview").style.display = "block";
      document.querySelector(".reviewModal").style.display = "block";
    },
    closeReviewModal() {
      document.querySelector(".reviewModal").style.display = "none";
    },
    showComment() {
      document.querySelector(".inModalreview").style.display = "none";
      document.querySelector(".comment").style.display = "block";
    },
    backToTheComment() {
      document.querySelector(".inModalreview").style.display = "block";
      document.querySelector(".comment").style.display = "none";
    },
<<<<<<< HEAD
    deleteComment(reviewId) {
      // FirebaseService.deleteComment(reviewId);
=======
    showReviewWrite() {
      document.querySelector(".reviewWriteModal").style.display = "block";
>>>>>>> jg
    }
  },
  watch: {}
};
</script>
<style>
.reviewMainDiv {
  width: 90%;
  height: 81vh;
  margin-left: 10%;
  margin-right: 10%;
  display: flex;
  justify-content: space-around;
  align-items: center;

  /* position: relative; */
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
  /* position: absolute; */
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
  background-color: rgb(255, 255, 255, 0.7);
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
  border-bottom: 1px solid black;
}

.reviewModalContent {
  width: 100%;
  height: 80%;
  margin-bottom: 5%;
  border-bottom: 1px solid black;
  overflow-wrap: break-word;
}

.showCommentDiv {
  float: right;
}

.showCommentBtn {
  cursor: pointer;
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
  height: 100%;
  overflow: scroll;
}

.showInModalreview {
  cursor: pointer;
}

.comment {
  display: none;
  height: 75%;
  width: 70%;
}

.commentContainer {
  width: 100%;
  height: 100%;
}

.showInModalreview {
  float: right;
}

.vForDiv {
  margin-top: 1%;
  padding-bottom: 3%;
  border-bottom: 1px solid rgb(0, 0, 0, 0.1);
  width: 100%;
}
</style>
