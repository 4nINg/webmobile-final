<template>
  <div class="errorPageMain">
    <div class="page-error">
      <div class="errorcontainer">
        <span class="closeSpan" @click="closeErrorModal()"><i class="erroricon fas fa-times"></i></span>
        <h3 style="color:lightcoral;">Error</h3>
        <h4>{{this.$store.state.error > 50? contentToSummary(this.$store.state.error) : this.$store.state.error}}</h4>
        <h2 style="color:lightcoral;">확인 후 다시 시도하세요</h2>
        <p style="color:gray;">이 결과가 지속되면 관리자에게 <strong style="color:lightcoral;">문의(T:1234-1234)</strong>해주세요</p>
      </div>
    </div>
  </div>
</template>
<script>
export default{
  name : 'Error',
  methods : {
    closeErrorModal(){
      this.$store.state.error = null;
      // alert("끕니다.");
    },
    contentToSummary(content){
      var result = "";
      for(var i = 0; i < 20; i++){
        result += content.charAt(i);
      }
      return result+"...";
    }
  }
}
</script>
<style>
    /* page-loading */
.errorPageMain{
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 1;
  background-color: rgba(0,0,0,0.5);
}

.page-error {
    width: 40%;
    height: 40%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: whitesmoke;
    z-index: 9999;
    text-align: center;
}

.closeSpan{
  position: absolute;
  top: 5%;
  right: 5%;
  cursor: pointer;
}

.page-error i{
    vertical-align: middle;
    text-align: center;
    display: table-cell;
    font-size: 60px;
}
.erroricon {
    color: lightcoral;
    padding : 2%;
}

.errorcontainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
    /* margin-top: 20%; */
    font-family: 'Nanum Gothic', sans-serif;
}
</style>
