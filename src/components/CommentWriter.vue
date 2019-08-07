<template>
  <div class="commentWirteMainDiv">
    <input class="commentInputText" type="text" placeholder="댓글을 입력해주세요." v-model="commentBody" />
    <span @click="trans()" class="commentSubmitBtn">submit</span>
    
  </div>
</template>

<script>
import FirebaseService from "../services/FirebaseService";


export default {
  name: "CommentWriter",
  props: ["reviewId", "reviewCommentUsername", "reviewCommentContent", "reviewCommentUserUid"],
  components: {},
  data() {
    return {
      commentBody: ""
    };
  },
  mounted() {
    this.isSubmit = false;
  },
  methods: {
    trans: function() {
      if (this.commentBody !== "") {
        this.reviewCommentUsername.push(this.$store.state.user.username);
        this.reviewCommentContent.push(this.commentBody);
        this.reviewCommentUserUid.push(this.$store.state.user.uid);
        this.commentBody = "";
        document.querySelector(".commentInputText").value = "";
        FirebaseService.postReviewComment(
          this.reviewId,
          this.reviewCommentUsername,
          this.reviewCommentContent,
          this.reviewCommentUserUid
        );
        this.isSubmit = true;
        this.$emit("isSubmit", this.isSubmit);
      } else {
        alert("댓글을 입력하세요.");
      }
    }
  }
};
</script>
<style>
.commentInputText {
  width: 100%;
  border: 1px solid rgb(0, 0, 0, 0.3);
  border-radius: 0.3em;
  padding: 0.5em;
}

.commentInputText:focus {
  outline: none;
}

.commentSubmitBtn {
  cursor: pointer;
  padding: 0.3em;
  border: 1px solid rgb(0, 0, 0, 0.3);
  border-radius: 0.3em;
  margin-left: 2%;
}

.commentSubmitBtn:hover {
  box-shadow: 0.1em 0.1em 0.1em 0.1em rgb(0, 0, 0, 0.1);
}

.commentWirteMainDiv {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
