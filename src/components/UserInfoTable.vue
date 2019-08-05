<template>
  <div>
    <div>
      <span class="userInfoTableCol">회원명</span><span class="userInfoTableCol">등급</span><span class="userInfoTableCol">최근 로그인 시간</span>
    </div>
    <div v-for="i in userInfoList.length" :key="i">
      <span class="userInfoTableCol">{{userInfoList[i-1].username}}</span><span class="userInfoTableCol">{{userInfoList[i-1].grade}}</span><span class="userInfoTableCol">{{userInfoList[i-1].lastSignInTime}}</span>
    </div>
  </div>
</template>
<script>
import FirebaseService from '../services/FirebaseService';
import firebase from 'firebase';

export default{
  name : "UserInfoTable",
  data(){
    return {
      userInfoList : []
    }
  },
  mounted(){
    this.getUserList();
  },
  methods : {
    async getUserList(){
      const getUserListFunc = firebase.functions().httpsCallable('getUserList');
      await getUserListFunc().then((result) => {
        var list = result.data.users;
        for(var i = 0; i < list.length; i++){
          console.log(list[i])
          this.userInfoList.push({
            username : list[i].displayName,
            lastSignInTime : new Date(list[i].metadata.lastSignInTime).toLocaleString(),
            grade : list[i].customClaims == null ? 3 : list[i].customClaims.grade
          })
        }
      })
    }
  }
}
</script>
<style>
.userInfoTableCol{
  padding-right : 20px;
}
</style>
