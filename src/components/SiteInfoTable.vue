<template>
<!-- <div>
  리뷰 : {{numOfReview}}<br>
  프리뷰 : {{numOfPreview}}<br>
  유저 : {{numOfUser}}<br>
</div> -->
</template>

<script>
import FirebaseService from "../services/FirebaseService";
export default {
  name:'SiteInfoTable',
  data() {
    return {

    }
  },
  mounted(){

  },
  methods : {

    getNumOfUser(){
      this.$on('numOfUser', function(cnt){
        this.numOfUser = cnt;
      })
    }
  }
}
</script>
