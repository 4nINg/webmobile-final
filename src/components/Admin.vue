<template>
  <UserInfoTable></UserInfoTable>
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

</style>
