<template>
  <UserInfoTable id="userInfoTable"></UserInfoTable>
</template>
<script>
import UserInfoTable from "./UserInfoTable"
export default{
  name: "Admin",
  components:{
    UserInfoTable
  },
  data(){
    return {

    }
  }
}
</script>
<style>
#userInfoTable{
  position: relative;
  top:10%;
  left:15%;
}
</style>
