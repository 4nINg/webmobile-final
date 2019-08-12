<template>
<div id="adminMainContainer">
  <div id="adminSelectContainer">
    <span @click="changeSelect(1)" class="adminSelectBtn"><i class="fas fa-circle"></i></span>
    <span @click="changeSelect(2)" class="adminSelectBtn"><i class="fas fa-circle"></i></span>
    <span @click="changeSelect(3)" class="adminSelectBtn"><i class="fas fa-circle"></i></span>
  </div>
  <div id="adminPage_1">
  <div id="adminUserInfoContainer">
      <div class="adminUserHeader">
        <span class="adminUserHeaderForFirst">type</span>
        <span class="adminUserHeaderForSecond">username</span>
        <span class="adminUserHeaderForThird">grade</span>
        <span class="adminUserHeaderForForth">login time</span>
        <span class="adminUserHeaderForFifth">&nbsp;</span>
      </div>
      <div class="tableScrollDiv">
        <div v-for="user in userInfoList.length" :key="user"  class="tableScrollDivVFor">
          <span class="tableScrollDivVForFirst">
            <span v-if="userInfoList[user-1].grade == 1 && userInfoList[user-1].username == '관리자'" style="color : #ffd15e"><i class="fas fa-crown"></i></span>
            <span v-else-if="userInfoList[user-1].provide == 'google.com'" class="userInfoTableCol1"><i class="fab fa-google"></i></span>
            <span v-else-if="userInfoList[user-1].provide == 'facebook.com'" class="userInfoTableCol1" style="color : #3b5998"><i class="fab fa-facebook"></i></span>
            <span v-else style="color : #abaaa6"><i class="fas fa-envelope userInfoTableCol1"></i></span>
          </span>
          <span class="tableScrollDivVForSecond">
            {{userInfoList[user-1].username}}
          </span>
          <span class="tableScrollDivVForThird">
            <span v-if="userInfoList[user-1].email !== 'admin@admin.com'">
              <label><input type="radio" :name="'userGrade' + (user-1)" value="1" class="userGradeRadioBtn"><span><i class="fas fa-tree"></i></span></label>
              <label><input type="radio" :name="'userGrade' + (user-1)" value="2" class="userGradeRadioBtn"><span><i class="fab fa-pagelines"></i></span></label>
              <label><input type="radio" :name="'userGrade' + (user-1)" value="3" class="userGradeRadioBtn"><span><i class="fas fa-seedling"></i></span></label>
            </span>
            <span v-else style="font-size:1.5em">
              I'm the bo$$
            </span>
          </span>
          <span class="tableScrollDivVForForth">
            {{userInfoList[user-1].lastSignInTime}}
          </span>
          <span class="tableScrollDivVForFifth">
            <span v-if="userInfoList[user-1].email !== 'admin@admin.com'" @click="updataGrade(user-1)" id="userUpdateBtn"><i class="fas fa-wrench"></i></span>
            <span v-if="userInfoList[user-1].email !== 'admin@admin.com'" @click="deleteUser(user-1)" class="deleteBtn"><i class="fas fa-trash-alt"></i></span>
          </span>
        </div>
      </div>
  </div>
</div>
<div id="adminPage_2">
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
<div id="adminPage_3">
  <div id="adminReviewContainer">
    <div class="adminReviewHeader">
      <span class="adminReviewHeaderForFirst">제목</span>
      <span class="adminReviewHeaderForSecond">글쓴이</span>
      <span class="adminReviewHeaderForThird"></span>
    </div>
      <div class="tableScrollDiv">
        <div v-for="review in reviewList.length" :key="review" class="tableScrollDivVFor">
          <span class="tableScrollDivVForFirst">{{reviewList[review-1].title.length > 20 ? contentToSummary(reviewList[review-1].title) : reviewList[review-1].title}}</span>
          <span class="tableScrollDivVForSecond">{{reviewList[review-1].writer}}</span>
          <span @click="deleteReview(review-1)" class="deleteBtn tableScrollDivVForThird"><i class="fas fa-trash-alt"></i></span>
        </div>
      </div>
  </div>
  <div id="adminPreviewContainer">
      <div class="adminPreviewHeader">
        <span class="adminPreviewHeaderForFirst">제목</span>
        <span class="adminPreviewHeaderForSecond">글쓴이</span>
        <span class="adminPreviewHeaderForThird"></span>
      </div>
      <div class="tableScrollDiv">
        <div v-for="preview in previewList.length" :key="preview" class="tableScrollDivVFor">
          <span class="tableScrollDivVForFirst">{{previewList[preview-1].title > 20 ? contentToSummary(previewList[preview-1].title) : previewList[preview-1].title}}</span>
          <span class="tableScrollDivVForSecond">{{previewList[preview-1].writer}}</span>
          <span @click="deletePreview(preview-1)" class="deleteBtn tableScrollDivVForThird"><i class="fas fa-trash-alt"></i></span>
        </div>
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
      await this.getReview();
      await this.getPreview();
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
    async getReview() {
      this.reviewList = await FirebaseService.getReviewListForAdmin();
      this.numOfReview = this.reviewList.length;
    },
    async getPreview() {
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
        document.querySelector('#adminPage_1').style.visibility = 'visible';
        document.querySelector('#adminPage_2').style.visibility = 'hidden';
        document.querySelector('#adminPage_3').style.visibility = 'hidden';
      }else if(i == 2){
        document.querySelector('#adminPage_1').style.visibility = 'hidden';
        document.querySelector('#adminPage_2').style.visibility = 'visible';
        document.querySelector('#adminPage_3').style.visibility = 'hidden';
      }else if(i == 3){
        document.querySelector('#adminPage_1').style.visibility = 'hidden';
        document.querySelector('#adminPage_2').style.visibility = 'hidden';
        document.querySelector('#adminPage_3').style.visibility = 'visible';
      }
      this.select = i;
    },
     setLoadingTrue(){
        this.$store.state.loading = true;
      },
      setLoadingFalse(){
        this.$store.state.loading = false;
      },
      contentToSummary(content){
        var result = "";
        for(var i = 0; i < 20; i++){
          result += content.charAt(i);
        }
        return result+"...";
      },
      async deleteReview(index){
        var deleteCheck = confirm("해당 게시글을 삭제하시겠습니까?");
        if(!deleteCheck){
          return;
        }
        await FirebaseService.deleteReview(this.reviewList[index].id);
        this.reviewList = [];
        await this.getReview();
      },
      async deletePreview(index){
        var deleteCheck = confirm("해당 게시글을 삭제하시겠습니까?");
        if(!deleteCheck){
          return;
        }
        await FirebaseService.deletePreview(this.previewList[index].id);
        this.previewList = [];
        await this.getPreview();
      }
  }
}
</script>
<style>
#adminMainContainer {
  margin-left: 5%;
  width: 90%;
  height: 87%;
  position: relative;
  background: rgb(255,255,255,0.8);
}


#adminSelectContainer{
  height: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2%;
}
.adminSelectBtn{
  cursor: pointer;
  opacity: 0.3;
  color: #535c68;
  font-size: 1.3em;
}
.adminSelectBtn:not(:first-child){
  margin-left: 5px;
}
.adminSelectBtn:first-child{
  opacity: 1;
  color: #535c68;
}


#adminPage_1 {
  width:100%;
  height: 80%;
  position: absolute;
  display: flex;
  justify-content: center;
}
#adminPage_2{
  visibility: hidden;
  width:100%;
  position: absolute;
  display: flex;
  justify-content: center;
}
#adminPage_3{
  visibility: hidden;
  position: absolute;
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: space-around;
}


#adminUserInfoContainer{
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 90%;
  align-items: flex-start;
}

.adminUserHeader{
  width: 100%;
  height: 10%;
  display: flex;
  align-items: center;
  text-align: center;
  
  border-bottom: 1px solid black;
}

#adminUserInfoContainer .tableScrollDiv{
  width: 100%;
  height: 82%;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.adminUserHeaderForFirst,
#adminUserInfoContainer .tableScrollDivVForFirst
{
  width: 5%;
  text-align: center;
}

.adminUserHeaderForSecond,
#adminUserInfoContainer .tableScrollDivVForSecond
{
  width: 15%;
  text-align: center;
}

.adminUserHeaderForThird,
#adminUserInfoContainer .tableScrollDivVForThird
{
  width: 30%;
  text-align: center;
}

.adminUserHeaderForForth,
#adminUserInfoContainer .tableScrollDivVForForth
{
  width: 40%;
  text-align: center;
}

.adminUserHeaderForFifth,
#adminUserInfoContainer .tableScrollDivVForFifth
{
  width: 10%;
  text-align: center;
}

#adminReviewContainer, #adminPreviewContainer{
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 45%;
  align-items: flex-start;
}

.adminReviewHeader, .adminPreviewHeader{
  width: 100%;
  height: 10%;
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 1%;
  border-bottom: 1px solid black;
}

#adminReviewContainer .tableScrollDiv, #adminPreviewContainer .tableScrollDiv{
  width: 100%;
  height: 70%;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.tableScrollDivVFor{
  width: 100%;
  height: 10%;
  display: flex;
  text-align: center;
  align-items: center;
  margin-bottom: 0.5%;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.tableScrollDivVFor:last-child{
  border-bottom: 0px;
}

.tableScrollDivVForFirst{
  text-align: left;
}

.adminReviewHeaderForFirst,
.adminPreviewHeaderForFirst,
#adminReviewContainer .tableScrollDivVForFirst,
#adminPreviewContainer .tableScrollDivVForFirst{
  width: 70%;
}

.adminReviewHeaderForSecond,
.adminPreviewHeaderForSecond,
#adminReviewContainer .tableScrollDivVForSecond,
#adminPreviewContainer .tableScrollDivVForSecond{
  width: 15%;
}

.adminReviewHeaderForThird,
.adminPreviewHeaderForThird,
#adminReviewContainer .tableScrollDivVForThird,
#adminPreviewContainer .tableScrollDivVForThird{
  width: 15%;
}


#siteInfoContainer{
  width: 80%;
}

#siteInfoBoxContainer{
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



#userUpdateBtn {
  font-size:1.2em;
  cursor: pointer;
  margin-right: 10px;
}

.deleteBtn {
  font-size:1.2em;
  cursor: pointer;
}


.userGradeRadioBtn + span{
  color: rgb(106, 176, 76, 0.3);
}
.userGradeRadioBtn + span:not(:first-child) {
  margin-left: 5px;
}
.userGradeRadioBtn:checked + span{
  color: rgb(106, 176, 76, 1);
}


</style>
