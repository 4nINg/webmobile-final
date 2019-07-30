<template>
<div style="width:80%">
  <h2>리뷰 등록</h2>
    <form>
      <input type="text" placeholder="제목을 입력해주세요." v-model="writerTitle" style="width:100%; height:15px;"></input>
      <input type="text" placeholder="내용을 입력해주세요." v-model="writerBody" style="width:100%; height:100px;"></input>
      <button @click="submit()" style="display:block">submit</button>
    </form>
</div>
</template>

<script>
import FirebaseService from '../services/FirebaseService';

export default {
  name: "ReviewWriter",
  components: {
    
  },
  data() {
    return {
      writerTitle: '',
      writerBody: '',
    }
  },
  methods: {
    checkForm: function(){
      if(this.writerTitle == ''){
        alert("제목을 입력하세요.");
        return false;
      }else if(this.writerBody == ''){
        alert("내용을 입력하세요.");
        return false;
      }
      return true;
    },
    submit: function() {
      if(this.checkForm()){
        FirebaseService.postReview(this.writerTitle, this.writerBody, "test");
        // FirebaseService.postInfo(this.title, this.body, this.$store.state.Username);
      }
    }
  }
};
</script>
