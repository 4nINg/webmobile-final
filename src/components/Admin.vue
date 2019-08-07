<template>
  <UserInfoTable id="userInfoTable"></UserInfoTable>
  <!-- <SiteInfoTable></SiteInfoTable> -->
</template>
<script>
import UserInfoTable from "./UserInfoTable"
// import SiteInfoTable from "./SiteInfoTable"
export default{
  name: "Admin",
  components:{
    UserInfoTable,
    // SiteInfoTable
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
