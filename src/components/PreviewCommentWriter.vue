<template>
  <div class="previewCommentWriterMainDiv">
    <input
      type="text"
      class="previewCommentInputText"
      placeholder="댓글을 입력해주세요"
      v-model="previewCommentBody"
    />
    <span @click="transComment()" class="previewCommentSubmitBtn">Submit</span>
  </div>
</template>
<script>
import FirebaseService from "../services/FirebaseService";
export default {
  props: [
    "previewId",
    "previewCommentUserName",
    "previewCommentContent",
    "previewCommentUserUid"
  ],
  data() {
    return {
      previewCommentBody: ""
    };
  },
  mounted() {
    this.isSubmit = false;
  },
  methods: {
    transComment() {
      if (this.previewCommentBody !== "") {
        this.previewCommentUserName.push(this.$store.state.user.username);
        this.previewCommentContent.push(this.previewCommentBody);
        this.previewCommentUserUid.push(this.$store.state.user.uid);
        this.previewCommentBody = "";
        FirebaseService.postPreviewComment(
          this.previewId,
          this.previewCommentUserName,
          this.previewCommentContent,
          this.previewCommentUserUid
        );
        this.isPreviewCommentSubmit = true;
        this.$emit("isSubmit", this.isSubmit);
      } else {
        alert("댓글을 입력하세요.");
      }
    }
  }
};
</script>
<style>
.previewCommentWriterMainDiv {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.previewCommentInputText {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 0.3em;
  padding: 0.5em;
}

.previewCommentInputText:focus {
  outline: none;
}

.previewCommentSubmitBtn {
  cursor: pointer;
  padding: 0.3em;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 0.3em;
  margin-left: 2%;
}

.previewCommentSubmitBtn:hover {
  box-shadow: 0.1em 0.1em 0.1em 0.1em rgb(0, 0, 0, 0.1);
}
</style>
