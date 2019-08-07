<template>
  <div class="reviewWriteMainDiv">
    <div>
      <div class="reviewWriteHeader">
        <span class="reviewWriteTitle">Review Writing</span>
        <span class="closeReviewWriter" @click="closeReviewWriteModal()">&times;</span>
      </div>
      <div class="reviewWriteFormDiv">
        <div class="titleInputDiv">
          <input type="text" placeholder="Please Enter The Title" class="titleInput" />
        </div>
        <div class="contentInputDiv">
          <textarea type="text" placeholder="Please Enter The Content" class="contentInput" />
        </div>
      </div>
      <div class="writerBtnDiv">
        <div @click="submit()">
          <span>Submit</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FirebaseService from "../services/FirebaseService";

export default {
  data() {
    return {
      isSubmit: false
    };
  },
  mounted() {
    this.isSubmit = false;
  },
  methods: {
    checkForm: function() {
      if (this.writerTitle == "") {
        alert("제목을 입력하세요.");
        return false;
      } else if (this.writerBody == "") {
        alert("내용을 입력하세요.");
        return false;
      }
      return true;
    },
    submit: function() {
      if (this.checkForm()) {
        FirebaseService.postReview(
          document.querySelector(".titleInput").value,
          document.querySelector(".contentInput").value,
          this.$store.state.user.username,
          this.$store.state.user.uid
        );
        this.isSubmit = true;
        this.$emit("isSubmit", this.isSubmit);

        this.closeReviewWriteModal();
      }
    },
    closeReviewWriteModal() {
      document.querySelector(".titleInput").value = "";
      document.querySelector(".contentInput").value = "";
      document.querySelector(".contentInput").innerText = "";
      document.querySelector(".reviewWriteModal").style.display = "none";
    }
  }
};
</script>
<style>
.reviewWriteHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2%;
  margin-top: 2%;
}
.closeReviewWriter {
  cursor: pointer;
  font-size: 1.6em;
  margin-right: 5%;
}
.reviewWriteMainDiv {
  width: 75%;
  height: 75%;
  background-color: #fefefe;
  display: flex;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  /* justify-content: space-around; */
}

.reviewWriteMainDiv > div {
  width: 85%;
  height: 90%;
  /* margin: 7% auto; */
  /* border: 1px solid rgb(0, 0, 0, 0.1); */
}

.titleInputDiv {
  margin-top: 2%;
  margin-bottom: 2%;
  padding-bottom: 1%;
  width: 100%;
  height: 14%;
  border-bottom: 1px solid black;
}

.titleInput {
  width: 90%;
  height: 90%;
  margin-left: 5%;
  margin-right: 5%;
}

.contentInputDiv {
  width: 100%;
  height: 70%;
}

.contentInput {
  width: 90%;
  height: 100%;
  margin-left: 5%;
  margin-right: 5%;
}

.reviewWriteTitle {
  font-size: 1em;
  margin-left: 5%;
}

.reviewWriteFormDiv {
  border-top: 1px solid black;
  width: 100%;
  height: 75%;
  display: flex;
  flex-direction: column;
}

.writerBtnDiv {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.writerBtnDiv > div {
  width: 5em;
  height: 2em;
  /* margin-right: 5%; */
  /* margin-bottom: 5%; */
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgb(0, 0, 0, 0.5);
  border-radius: 1em;
  cursor: pointer;
}

.writerBtnDiv > div:hover {
  box-shadow: 0.1em 0.1em 0.1em 0.1em rgb(0, 0, 0, 0.1);
}

.writerBtnDiv span {
  text-transform: uppercase;
}
</style>
