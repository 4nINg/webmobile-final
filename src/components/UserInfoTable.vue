<template>
<div id="adminMainContainer">
  <div id="adminSelectContainer">
    <span @click="changeSelect(1)" class="adminSelectBtn"><i class="fas fa-circle"></i></span>
    <span @click="changeSelect(2)" class="adminSelectBtn"><i class="fas fa-circle"></i></span>
  </div>
  <div id="adminUserInfoContainer_fake">
  <div id="adminUserInfoContainer">
    <table>
      <tr>
        <td>type</td>
        <td>username</td>
        <td>grade</td>
        <td>login time</td>
        <td></td>
      </tr>

      <tr v-for="user in userInfoList.length" :key="user">
        <td>
          <span v-if="userInfoList[user-1].grade == 1 && userInfoList[user-1].username == '관리자'" style="color : #ffd15e"><i class="fas fa-crown"></i></span>
          <span v-else-if="userInfoList[user-1].provide == 'google.com'" class="userInfoTableCol1"><i class="fab fa-google"></i></span>
          <span v-else-if="userInfoList[user-1].provide == 'facebook.com'" class="userInfoTableCol1" style="color : #3b5998"><i class="fab fa-facebook"></i></span>
          <span v-else style="color : #abaaa6"><i class="fas fa-envelope userInfoTableCol1"></i></span>
        </td>
        <td>
          {{userInfoList[user-1].username}}
        </td>
        <td>
          <span v-if="userInfoList[user-1].email !== 'admin@admin.com'">
            <label><input type="radio" :name="'userGrade' + (user-1)" value="1" class="userGradeRadioBtn"><span><i class="fas fa-tree"></i></span></label>
            <label><input type="radio" :name="'userGrade' + (user-1)" value="2" class="userGradeRadioBtn"><span><i class="fab fa-pagelines"></i></span></label>
            <label><input type="radio" :name="'userGrade' + (user-1)" value="3" class="userGradeRadioBtn"><span><i class="fas fa-seedling"></i></span></label>
          </span>
          <span v-else>
            I'm the bo$$
          </span>
        </td>
        <td>
          {{userInfoList[user-1].lastSignInTime}}
        </td>
        <td>
          <span v-if="userInfoList[user-1].email !== 'admin@admin.com'" @click="updataGrade(user-1)" id="userUpdateBtn"><i class="fas fa-wrench"></i></span>
          <span v-if="userInfoList[user-1].email !== 'admin@admin.com'" @click="deleteUser(user-1)" id="userDeleteBtn"><i class="fas fa-trash-alt"></i></span>
        </td>
      </tr>
    </table>
  </div>
  <div id="adminReviewContainer">
    <table>
      <tr>
        <td>제목</td>
        <td>글쓴이</td>
        <td></td>
      </tr>
      <tr v-for="review in reviewList.length" :key="review">
        <td>{{reviewList[review-1].title}}</td>
        <td>{{reviewList[review-1].writer}}</td>
        <td><span @click="deleteReview(review-1)" id="ReviewDeleteBtn"><i class="fas fa-trash-alt"></i></span></td>
      </tr>
    </table>
  </div>
  <div id="adminPreviewContainer">
    <table>
      <tr>
        <td>제목</td>
        <td>글쓴이</td>
        <td></td>
      </tr>
      <tr v-for="preview in previewList.length" :key="preview">
        <td>{{previewList[preview-1].title}}</td>
        <td>{{previewList[preview-1].writer}}</td>
        <td><span @click="deletePreview(preview-1)" id="PreviewDeleteBtn"><i class="fas fa-trash-alt"></i></span></td>
      </tr>
    </table>
  </div>
</div>
<div id="siteInfoContainer_fake">
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
        v-if="graphInit"
        :userInfoList="userInfoList"
        :reviewList="reviewList"
        :previewList="previewList"
      ></graph>
    </div>
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
      userInfoList: [],
      userGrade: [],
      numOfUser: 0,
      numOfReview: 0,
      numOfPreview: 0,
      reviewList: [],
      previewList: [],
      graphInit: false
    }
  },
  mounted() {
    this.adminPageInit();
  },
  methods: {
    async adminPageInit(){
      await this.setLoadingTrue();
      await this.getUserList();
      await this.getNumOfReview();
      await this.getNumOfPreview();
      await this.setLoadingFalse();
      this.graphInit = true;
    },
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
    async updataGrade(index) {
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
      await FirebaseService.setUserGrade(this.userInfoList[index].uid, grade);
      await this.getUserList();
    },
    async deleteUser(index) {
      var deleteCheck = confirm(this.userInfoList[index].username + "님의 계정을 삭제하시겠습니까?");
      if(!deleteCheck){
        return;
      }
      await FirebaseService.deleteUser(this.userInfoList[index].uid);
      this.userInfoList = [];
      await this.getUserList();
    },
    async getNumOfReview() {
      this.reviewList = await FirebaseService.getReviewListForAdmin();
      this.numOfReview = this.reviewList.length;
    },
    async getNumOfPreview() {
      this.previewList = await FirebaseService.getPreviewListForAdmin();
      this.numOfPreview = this.previewList.length;
    },
    changeSelect(i){
      // console.log(this.select)
      var adminSelectBtn = document.querySelectorAll(".adminSelectBtn");
      // for(var i = 0; i < adminSelectBtn.length; i++){
      //   if()
      // }
      adminSelectBtn[this.select-1].style.opacity="0.3";
      adminSelectBtn[i-1].style.opacity="1";
      if(i == 1){
        //adminUserInfoContainer siteInfoContainer
        document.querySelector('#adminUserInfoContainer_fake').style.visibility = 'visible';
        document.querySelector('#siteInfoContainer_fake').style.visibility = 'hidden';
      }else if(i == 2){
        document.querySelector('#adminUserInfoContainer_fake').style.visibility = 'hidden';
        document.querySelector('#siteInfoContainer_fake').style.visibility = 'visible';
      }
      this.select = i;
    },
     setLoadingTrue(){
        this.$store.state.loading = true;
      },
      setLoadingFalse(){
        this.$store.state.loading = false;
      }
  }
}
</script>
<style>
#adminMainContainer {
  margin-left: 5%;
  width: 90%;
  height: 81vh;
  position: relative;
}
#adminSelectContainer{
  display: flex;
  justify-content: center;
}
#adminUserInfoContainer_fake {
  width:100%;
  height: 80%;
  position: absolute;
}
#siteInfoContainer_fake{
  visibility: hidden;
  width:100%;
  position: absolute;
  display: flex;
  justify-content: center;
}
#adminUserInfoContainer, #adminReviewContainer, #adminPreviewContainer {
  display: flex;
  width:80%;
  justify-content: center;
  align-items: flex-start;
  background: white;
  border-radius: 15px;
  height: 50%;
  overflow: auto;
  /* text-overflow:ellipsis; */
}
#siteInfoContainer{
  width: 60%;
}
#adminUserInfoContainer table{
  height: 300px;
  overflow: scroll;
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

#siteInfoBoxContainer{
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
}

.siteInfoBox>div {
  text-align: center;
}

.siteInfoBox {
  width: 100px;
  border-radius: 5px;
}

.siteInfoBox hr{
  width:70px;
  margin: 0 auto;
  border: 0.5px solid black;

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
.userGradeRadioBtn + span{
  color: rgb(106, 176, 76, 0.3);
}
.userGradeRadioBtn:checked + span{
  color: rgb(106, 176, 76, 1);
}
.adminSelectBtn{
  cursor: pointer;
  opacity: 0.3;
  color: #535c68;
}
.adminSelectBtn:not(:first-child){
  margin-left: 5px;
}
.adminSelectBtn:first-child{
  opacity: 1;
  color: #535c68;
}
</style>
