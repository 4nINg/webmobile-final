<template>
<div>
      <input type="text" placeholder="댓글을 입력해주세요." v-model="comment.body" style="width:100%; height:100px;">
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
      comment: {
        id: '',
        userName: '',
        body: '',
      }
    //   reviewId1: this.reviewId,
    //   reviewCommentUser1: this.reviewCommentUser,
    //   reviewCommentContent1: this.reviewCommentContent
    };
  },
  methods: {
    trans: function() {
      if(this.comment.body !== '') {
          console.log(this.$store)
          alert(this.$store.state.user.userName);
          // console.log("확인 : "+this.reviewId, this.reviewCommentUser, this.reviewCommentContent)
          this.comment = {
            id: 1,
            userName: this.$store.state.user.userName,
            body: this.body,
          }
          // this.reviewCommentUser.push(this.$store.state.user.userName);
          // this.reviewCommentContent.push(this.commentBody);
          // FirebaseService.postComment(this.reviewId, this.reviewCommentUser, this.reviewCommentContent);
          FirebaseService.postComment(this.reviewId, this.comment);
          alert("작성완료!");
      }else{
          alert("댓글을 입력하세요.");
      }
    }
  }
}

</script>