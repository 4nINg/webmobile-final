<template>
<div id="adminMainContainer">
  <div id="adminUserInfoContainer">
    <table>
      <tr>
        <td>type</td>
        <td>username</td>
        <td>grade</td>
        <td>login time</td>
        <td></td>
      </tr>
      <tr v-for="i in userInfoList.length" :key="i">
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
      <div class="siteInfoBox">
        <div>USER</div>
        <hr>
        <div>{{numOfUser}}</div>
      </div>
      <!-- numOfReview -->
      <div class="siteInfoBox">
        <div>REVIEW</div>
        <hr>
        <div>{{numOfReview}}</div>
      </div>
      <!-- numOfPreview -->
      <div class="siteInfoBox">
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
      userInfoList: [],
      reviewList: [],
      previewList: [],
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
    this.getChart();
  },
  methods: {
    async getUserList() {
      const getUserListFunc = firebase.functions().httpsCallable('getUserList');
      await getUserListFunc().then((result) => {
        var list = result.data.users;
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
          grade = radio[i].value;
        }
      }
      FirebaseService.setUserGrade(this.userInfoList[index].uid, grade);
      alert("변경완료!");
    },
    async deleteUser(index) {
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
    async getChart(){

    }
  },

}
</script>
<style>
#adminMainContainer {
  margin-left: 10%;
  width: 90%;
  height: 81vh;
}
#adminUserInfoContainer {
  width:70%;
  background: white;
  border-radius: 15px;
}
#siteInfoContainer{
  width:70%;
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
  cursor: pointer;
}

#userUpdateBtn {
  cursor: pointer;
  margin-right: 10px;
}

#userDeleteBtn {
  cursor: pointer;
}

.userGradeRadioBtn:checked + span{
  color: red;
}
</style>
