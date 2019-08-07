<template>
  <div class="previewWriterMainDiv">
    <div class="previewWriteInnerDiv">
      <div class="previewWriteHeader">
        <span class="previewWriteTitle">Preview Writing</span>
        <span class="closePreviewWrite" @click="closePreview()">&times;</span>
      </div>
      <div class="previewWriteFormDiv">
        <input
          type="text"
          class="previewTitleInput"
          placeholder="Please Enter The Title"
          v-model="writeTitle"
        />
        <textarea
          class="previewTitleContent"
          placeholder="Please Enter The Content"
          v-model="writeBody"
        />
        <ImgUploader ref="uploader" class="imgUploader"></ImgUploader>
      </div>
      <div class="previewWriteBtnDiv">
        <span @click="submit()" class="previewWriteBtn">Submit</span>
      </div>
    </div>
  </div>
</template>

<script>
import FirebaseService from "../services/FirebaseService";
import ImgUploader from "../components/ImgUploader";

export default {
  name: "PreviewWriter",
  components: {
    ImgUploader
  },
  data() {
    return {
      writeTitle: "",
      writeBody: "",
      imageUrl: "",
      imageFile: "",
      imageName: "",
      imageList: [],
      isSubmit: false
    };
  },
  mounted() {
    this.isSubmit = false;
  },
  methods: {
    closePreview() {
      document.querySelector(".previewTitleInput").value = "";
      this.writeTitle = "";
      document.querySelector(".previewTitleContent").value = "";
      this.writeBody = "";
      document.querySelector(".inImgUploaderInput").value = "";
      var inImgUploaderFile = document.querySelector(".inImgUploaderFile");
      if (inImgUploaderFile !== null) {
        inImgUploaderFile.value = "";
      }
      document.querySelector(".previewWriteModal").style.display = "none";
    },
    async getPreviewImages() {
      this.imageList = await FirebaseService.getPreviewImages();
    },
    checkForm: function() {
      if (this.writeTitle == "") {
        alert("제목을 입력하세요.");
        return false;
      } else if (this.writeBody == "") {
        alert("내용을 입력하세요.");
        return false;
      } else if (this.imageName == "") {
        alert("포스터를 등록하세요.");
        return false;
      }
      return true;
    },
    submit() {
      this.imageUrl = this.$refs.uploader.imageUrl;
      this.imageFile = this.$refs.uploader.imageFile;
      this.imageName = this.$refs.uploader.imageName;
      for (var i = 0; i < this.imageList.length; i++) {
        if (this.imageName == this.imageList[i]) {
          alert("이미 등록된 사진 이름입니다.");
          this.$refs.uploader.imageUrl = "";
          this.$refs.uploader.imageFile = "";
          this.$refs.uploader.imageName = "";
          return;
        } else if (this.imageFile.size > 716800) {
          alert("700KB 이하의 파일만 업로드 가능합니다.");
          this.$refs.uploader.imageUrl = "";
          this.$refs.uploader.imageFile = "";
          this.$refs.uploader.imageName = "";
          return;
        }
      }
      if (this.checkForm()) {
        var storageRef = FirebaseService.getFirestorage().ref();
        var mountainsRef = storageRef.child(`previewImages/${this.imageName}`);
        mountainsRef.put(this.imageFile).then(snapshot => {
          snapshot.ref.getDownloadURL().then(downloadURL => {
            this.imageUrl = downloadURL;
          });
        });
        FirebaseService.postPreview(
          this.writeTitle,
          this.$store.state.user.uid,
          this.$store.state.user.username,
          this.writeBody,
          this.imageUrl,
          this.imageName
        );
        document.querySelector(".previewWriteModal").style.display = "none";
        this.$emit("isSubmit", this.isSubmit);
      }
    }
  }
};
</script>
<style>
.previewWriterMainDiv {
  display: flex;
  width: 75%;
  height: 75%;
  background-color: #fefefe;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
}

.previewWriteInnerDiv {
  width: 85%;
  height: 90%;
}

.previewWriteHeader {
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin-bottom: 2%;
  font-size: 1.6em;
  padding-bottom: 2%;
  border-bottom: 1px solid rgb(0, 0, 0, 0.5);
  margin-top: 2%;
}

.closePreviewWrite {
  cursor: pointer;
  margin-right: 1%;
}

.previewWriteFormDiv {
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: column;
}

.previewTitleInput {
  margin-bottom: 2%;
  padding: 0.5%;
  width: 98.5%;
  height: 7%;
}

.previewTitleContent {
  margin-bottom: 2%;
  padding: 0.5%;
  width: 98.5%;
  height: 60%;
}

.previewWriteBtnDiv {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 10%;
}

.previewWriteBtn {
  cursor: pointer;
  font-size: 1.3em;
  text-transform: uppercase;
  border: 1px solid rgb(0, 0, 0, 0.7);
  padding: 0.3em;
  border-radius: 0.5em;
  margin-top: 5%;
}

.previewWriteBtn:hover {
  box-shadow: 0.1em 0.1em 0.1em 0.1em rgb(0, 0, 0, 0.1);
}
</style>
