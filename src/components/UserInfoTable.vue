<template>
<div id="adminMainContainer">
  <div>
    <span @click="changeSelect(1)" class="adminSelectBtn"><i class="fas fa-circle"></i></span>
    <span @click="changeSelect(2)" class="adminSelectBtn"><i class="fas fa-circle"></i></span>
  </div>
  <div id="adminUserInfoContainer">
    <table>
      <tr>
        <td>type</td>
        <td>username</td>
        <td>grade</td>
        <td>login time</td>
        <td></td>
      </tr>
      <tr v-if="userInfoList" v-for="i in userInfoList.length" :key="i">
        <td>
          <span v-if="userInfoList[i-1].grade == 1 && userInfoList[i-1].username == '관리자'" style="color : #ffd15e"><i class="fas fa-crown"></i></span>
          <span v-else-if="userInfoList[i-1].provide == 'google.com'" class="userInfoTableCol1"><i class="fab fa-google"></i></span>
          <span v-else-if="userInfoList[i-1].provide == 'facebook.com'" class="userInfoTableCol1" style="color : #3b5998"><i class="fab fa-facebook"></i></span>
          <span v-else style="color : #abaaa6"><i class="fas fa-envelope userInfoTableCol1"></i></span>
        </td>
        <td>
          {{userInfoList[i-1].username}}
        </td>
        <td>
          <span v-if="userInfoList[i-1].email !== 'admin@admin.com'">
            <label><input type="radio" :name="'userGrade' + (i-1)" value="1" class="userGradeRadioBtn"><span><i class="fas fa-tree"></i></span></label>
            <label><input type="radio" :name="'userGrade' + (i-1)" value="2" class="userGradeRadioBtn"><span><i class="fab fa-pagelines"></i></span></label>
            <label><input type="radio" :name="'userGrade' + (i-1)" value="3" class="userGradeRadioBtn"><span><i class="fas fa-seedling"></i></span></label>
          </span>
          <span v-else>
            I'm the bo$$
          </span>
        </td>
        <td>
          {{userInfoList[i-1].lastSignInTime}}
        </td>
        <td>
          <span v-if="userInfoList[i-1].email !== 'admin@admin.com'" @click="updataGrade(i-1)" id="userUpdateBtn"><i class="fas fa-wrench"></i></span>
          <span v-if="userInfoList[i-1].email !== 'admin@admin.com'" @click="deleteUser(i-1)" id="userDeleteBtn"><i class="fas fa-trash-alt"></i></span>
        </td>
      </tr>
    </table>
  </div>
  <div id="siteInfoContainer">
    <div id="siteInfoBoxContainer">
      <!-- numOfUser -->
      <div class="siteInfoBox" style="background:gold;">
        <div>USER</div>
        <hr>
        <div>{{numOfUser}}</div>
      </div>
      <!-- numOfReview -->
      <div class="siteInfoBox" style="background:blue;">
        <div>REVIEW</div>
        <hr>
        <div>{{numOfReview}}</div>
      </div>
      <!-- numOfPreview -->
      <div class="siteInfoBox" style="background:red;">
        <div>PREVIEW</div>
        <hr>
        <div>{{numOfPreview}}</div>
      </div>
    </div>
    <div id="chart_div">
      <graph
        :userInfoList="userInfoList"
        :reviewList="reviewList"
        :previewList="previewList"
      ></graph>
    </div>
  </div>
</div>
</template>
<script>
import FirebaseService from '../services/FirebaseService';
import firebase from 'firebase';
import graph from './VueChartJS';

export default {
  name: "UserInfoTable",
  components :{
    graph
  },
  data() {
    return {
      select: 1,
      userInfoList: null,
      reviewList: null,
      previewList: null,
      userGrade: [],
      numOfUser: 0,
      numOfReview: 0,
      numOfPreview: 0
    }
  },
  mounted() {
    this.getUserList();
    this.getNumOfReview();
    this.getNumOfPreview();
  },
  methods: {
    async getUserList() {
      const getUserListFunc = firebase.functions().httpsCallable('getUserList');
      await getUserListFunc().then((result) => {
        var list = result.data.users;

        this.userInfoList = [];
        for (var i = 0; i < list.length; i++) {
          // console.log(list[i])

          this.userInfoList.push({
            provide: list[i].providerData[0].providerId,
            email: list[i].email,
            uid: list[i].uid,
            username: list[i].displayName,
            creationTime: new Date(list[i].metadata.creationTime),
            lastSignInTime: new Date(list[i].metadata.lastSignInTime).toLocaleString(),
            grade: list[i].customClaims == null ? 3 : list[i].customClaims.grade
          })
        }

        this.numOfUser = this.userInfoList.length;
      })
      for (var i = 0; i < this.userInfoList.length; i++) {
        if(this.userInfoList[i].email == "admin@admin.com") continue;
        var radio = document.getElementsByName('userGrade' + i);
        if (this.userInfoList[i].grade == 1) { //관리자
          radio[0].checked = true;
        } else if (this.userInfoList[i].grade == 2) { //일반회원
          radio[1].checked = true;
        } else { //새싹회원
          radio[2].checked = true;
        }
      }
    },
    updataGrade(index) {
      var radio = document.getElementsByName('userGrade' + index);
      var grade;

      for (var i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
          if(radio[i].value == this.userInfoList[index].grade){
            return;
          }
          grade = radio[i].value;
        }
      }
      FirebaseService.setUserGrade(this.userInfoList[index].uid, grade);
      this.userInfoList[index].grade = grade;
      alert("변경완료!");
    },
    async deleteUser(index) {
      var deleteCheck = confirm(this.userInfoList[index].username + "님의 계정을 삭제하시겠습니까?");
      if(!deleteCheck){
        return;
      }
      await FirebaseService.deleteUser(this.userInfoList[index].uid);
      this.userInfoList = [];
      this.getUserList();
    },
    async getNumOfReview() {
      this.reviewList = await FirebaseService.getNumOfReview();
      this.numOfReview = this.reviewList[this.reviewList.length - 1];
    },
    async getNumOfPreview() {
      this.previewList = await FirebaseService.getNumOfPreview();
      this.numOfPreview = this.previewList[this.previewList.length - 1];
    },
    changeSelect(i){
      // console.log(this.select)
      var adminSelectBtn = document.querySelectorAll(".adminSelectBtn");
      // for(var i = 0; i < adminSelectBtn.length; i++){
      //   if()
      // }
      adminSelectBtn[this.select-1].style.color="black";
      adminSelectBtn[this.select-1].style.opacity="0.3";
      adminSelectBtn[i-1].style.color="blue";
      adminSelectBtn[i-1].style.opacity="1";
      if(i == 1){
        //adminUserInfoContainer siteInfoContainer
        document.querySelector('#adminUserInfoContainer').style.visibility = 'visible';
        document.querySelector('#siteInfoContainer').style.visibility = 'hidden';
      }else if(i == 2){
        document.querySelector('#adminUserInfoContainer').style.visibility = 'hidden';
        document.querySelector('#siteInfoContainer').style.visibility = 'visible';
      }
      this.select = i;
    }
  },

}
</script>
<style>
#adminMainContainer {
  margin-left: 10%;
  width: 90%;
  height: 81vh;
  position: relative;
}
#adminUserInfoContainer {
  width:70%;
  background: white;
  border-radius: 15px;
  position: absolute;;
}
#siteInfoContainer{
  visibility: hidden;
  width:70%;
  position: absolute;
}
#adminUserInfoContainer table{
  text-align: center;
  align-items: center;
  width:95%;
  border-collapse: collapse;
}
#adminUserInfoContainer table tr:not(:last-child){
  line-height:30px;
  border-bottom: 1px solid #e0e0e0;
}

.userInfoTableMainDiv>div {
  width: 50%;
}

#siteInfoBoxContainer {
  width: 70%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.siteInfoBox>div {
  text-align: center;
}

.siteInfoBox {
  width: 100px;
  border: 2px solid black;
  border-radius: 5px;
}

.userGradeRadioBtn {
  width: 0;
  height: 0;
  opacity: 0;
}

label {
  font-size:1.5em;
  cursor: pointer;
}

.userGradeRadioBtn + span:not(:first-child) {
  margin-left: 5px;
}

#userUpdateBtn {
  font-size:1.2em;
  cursor: pointer;
  margin-right: 10px;
}

#userDeleteBtn {
  font-size:1.2em;
  cursor: pointer;
}
.adminSelectBtn{
  cursor: pointer;
}
.userGradeRadioBtn:checked + span{
  color: red;
}
.adminSelectBtn{
  opacity: 0.3;
}
.adminSelectBtn:first-child{
  opacity: 1;
  color: blue;
}
</style>
