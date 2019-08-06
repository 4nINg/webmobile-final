<template>
  <div class="userInfoTableMainDiv">
    <div class="userInfoTableHeader">
      <div>
        <span class="userInfoTableCol1">가입경로</span>
      </div>
      <div>
        <span class="userInfoTableCol2">회원명</span>
      </div>
      <div>
        <span class="userInfoTableCol3">등급</span>
      </div>
      <div>
        <span class="userInfoTableCol4">최근 로그인 시간</span>
      </div>
    </div>

    <div v-for="i in userInfoList.length" :key="i">
      <span v-if="userInfoList[i-1].provide == 'google.com'" class="userInfoTableCol1" style="color : red"><i class="fab fa-google"></i></span>
      <span v-else-if="userInfoList[i-1].provide == 'facebook.com'" class="userInfoTableCol1" style="color : blue"><i class="fab fa-facebook"></i></span>
      <span v-else><i class="fas fa-envelope userInfoTableCol1"></i></span>
      <span class="userInfoTableCo2">{{userInfoList[i-1].username}}</span>
      <span class="userInfoTableCo3">
        <!-- <input type="radio" name="test1" id="test1" :value="userGrade[i-1]">
        <label for="test1"><i class="fas fa-seedling"></i></label> -->
        <label><input type="radio" :name="'userGrade' + (i-1)" value="1" class="userGradeRadioBtn"><img src="../../public/img/icons/tree.png" class="gradeIcon"></label>
        <label><input type="radio" :name="'userGrade' + (i-1)" value="2" class="userGradeRadioBtn"><img src="../../public/img/icons/flower.png" class="gradeIcon"></label>
        <label><input type="radio" :name="'userGrade' + (i-1)" value="3" class="userGradeRadioBtn"><img src="../../public/img/icons/seed.png" class="gradeIcon"></label>
      </span>
      <span class="userInfoTableCol4">{{userInfoList[i-1].lastSignInTime}}</span>
      <span v-if="userInfoList[i-1].email !== 'admin@admin.com'" @click="updataGrade(i-1)" id="userUpdateBtn">변경</span>
      <span v-if="userInfoList[i-1].email !== 'admin@admin.com'" @click="deleteUser(i-1)" id="userDeleteBtn">삭제</span>
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
      userInfoList : [],
      userGrade: []
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
          this.userInfoList.push({
            provide : list[i].providerData[0].providerId,
            email : list[i].email,
            uid : list[i].uid,
            username : list[i].displayName,
            lastSignInTime : new Date(list[i].metadata.lastSignInTime).toLocaleString(),
            grade : list[i].customClaims == null ? 3 : list[i].customClaims.grade
          })
        }
      })
      for(var i = 0; i < this.userInfoList.length; i++){
        var radio = document.getElementsByName('userGrade'+i);
        if(this.userInfoList[i].grade == 1){ //관리자
          radio[0].checked = true;
        }else if(this.userInfoList[i].grade == 2){ //일반회원
          radio[1].checked = true;
        }else{ //새싹회원
          radio[2].checked = true;
        }
      }
    },
    updataGrade(index){
      var radio = document.getElementsByName('userGrade' + index);
      var grade;
      for(var i = 0; i < radio.length; i++){
        if(radio[i].checked){
          grade = radio[i].value;
        }
      }
      FirebaseService.setUserGrade(this.userInfoList[index].uid, grade);
      alert("변경완료!");
    },
    async deleteUser(index){
      await FirebaseService.deleteUser(this.userInfoList[index].uid);
      this.userInfoList = [];
      this.getUserList();
    }
  }
}
</script>
<style>
.userInfoTableMainDiv>div{
  width: 50%;
}
.userInfoTableHeader{
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.userInfoTableCol1{
  width:20px;
}

.userInfoTableCol2{

}

.userInfoTableCol3{

}

.userInfoTableCol4{

}

.gradeIcon{
  height:20px;
  width:20px;
}
.userGradeRadioBtn{
  width: .1;
  height: .1;
}

label{
  cursor: pointer;
}

.userGradeRadioBtn:checked{
  transform: scale(1.5);
}

#userUpdateBtn{
  cursor: pointer;
  margin-right: 10px;
}

#userDeleteBtn{
  cursor: pointer;
}
</style>
