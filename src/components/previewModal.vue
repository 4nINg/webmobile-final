<template>
  <div class="previewModal">
    <div class="previewModalContainer">
      <span class="closePreview" @click="closeReviewModal()">&times;</span>
      <div class="inModalPreview">
        <div>
          <div>img!!!!</div>
          <div>
            <div class="previewModalTitle">
              <span class="previewTitle">{{previewTitle}}</span>
              <input type="text" class="modifyPreviewTitleInput" />
            </div>
            <div class="previewModalContent">
              <span class="previewContent">{{previewContent}}</span>
              <textarea class="modifyPreviewContentInput"></textarea>
            </div>
          </div>
        </div>
        <div class="commentBtnListDiv">
          <div>
            <div>
              <span>수정</span>
            </div>
          </div>
          <div>
            <div>
              <span>수정 완료</span>
            </div>
          </div>
          <div>
            <span>삭제</span>
          </div>
          <div>
            <span>댓글 보기</span>
          </div>
        </div>
      </div>
      <div class="comment">
        <div class="commentContainer">
          <div class="commentInnerDiv">
            <div v-for="i in reviewCommentUser.length" :key="i" class="vForDiv">
              <h3>{{reviewCommentUser[i-1]}}</h3>
              <p class="reviewCommentContentP">{{reviewCommentContent[i-1]}}</p>
              <input type="text" class="modifyCommentInput" />
              <div class="modifyCommentwDiv">
                <div>
                  <span @click="modifyComment(i-1)" class="completeModifyComment">수정</span>
                </div>
              </div>
              <div class="completeModifyCommentDiv">
                <div>
                  <span @click="completeModifyComment(i-1)" class="completeModifyComment">수정 완료</span>
                </div>
              </div>
              <div class="deleteCommentDiv">
                <span @click="deleteComment(i-1)">삭제</span>
              </div>
            </div>
          </div>
          <div class="commentWriterDiv">
            <CommentWriter
              :reviewId="reviewId"
              :reviewCommentUser="reviewCommentUser"
              :reviewCommentContent="reviewCommentContent"
            ></CommentWriter>
          </div>

          <span class="showInModalreview" @click="backToTheComment()">
            <i class="fas fa-undo"></i>글 보기
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PreviewWriter from "@/components/PreviewWriter";
export default {
  props: ["displayedPreview"],
  data() {
    return {
      previewTitle: "",
      previewContent: "",
      previewImg: ""
    };
  },
  methods: {
    closeReviewModal() {}
  },
  mounted() {
    this.previewTitle = this.displayedPreview.title;
    this.previewContent = this.displayedPreview.content;
    this.previewImg = this.displayedPreview.img;
  },
  components: {
    PreviewWriter
  }
};
</script>
