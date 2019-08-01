<template>
<div>
      <input type="text" placeholder="댓글을 입력해주세요." v-model="commentBody" style="width:100%; height:100px;">
      <button @click="trans()">submit</button>
</div>
</template>

<script>
import FirebaseService from '../services/FirebaseService';

export default {
  name : "CommentWriter",
  props:
      ["reviewId", "reviewCommentUser", "reviewCommentContent"]
  ,
  components: {
  },
  data() {
    return {
      // reviewId: this.reviewId,
      commentBody: '',
    };
  },
  methods: {
    trans: function() {
       if(this.commentBody !== '') {
        //   alert(this.$store.state.user.username);
          console.log("확인 : "+this.reviewId, this.reviewCommentUser, this.reviewCommentContent)
          this.reviewCommentUser.push(this.$store.state.user.username);
          this.reviewCommentContent.push(this.commentBody);
          FirebaseService.postComment(this.reviewId, this.reviewCommentUser, this.reviewCommentContent);
          alert("작성완료!");
      }else{
          alert("댓글을 입력하세요.");
      }
    }
  }
}

</script>