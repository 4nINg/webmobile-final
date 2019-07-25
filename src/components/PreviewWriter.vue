<template>
<div style="width:80%">
  <h2>시사회 등록</h2>
    <form>
      <input type="text" placeholder="제목을 입력해주세요." v-model="writerTitle" style="width:100%; height:15px;"></input>
      <input type="text" placeholder="내용을 입력해주세요."v-model="writerBody" style="width:100%; height:100px;"></input>
      <ImgUploader ref="uploader"></ImgUploader>
      <button @click="submit()">submit</button>
    </form>
</div>
</template>

<script>
import FirebaseService from '../services/FirebaseService';
import ImgUploader from '../components/ImgUploader';

export default {
  name: "PreviewWriter",
  components: {
    ImgUploader
  },
  data() {
    return {
      writerTitle: '',
      writerBody: '',
      imageUrl:'',
      imageFile:'',
      imageName:'',
      imageList:[]
    }
  },
  mounted(){
    this.getPreviewImages();
  },
  methods: {
    async getPreviewImages() {
      this.imageList = await FirebaseService.getPreviewImages();
    },
    checkForm: function(){
      if(this.writerTitle == ''){
        alert("제목을 입력하세요.");
        return false;
      }else if(this.writerBody == ''){
        alert("내용을 입력하세요.");
        return false;
      }else if(this.imageName == ''){
        alert("포스터를 등록하세요.");
        return false;
      }
      return true;
    },
    submit: function() {
      this.imageUrl = this.$refs.uploader.imageUrl;
      this.imageFile = this.$refs.uploader.imageFile;
      this.imageName = this.$refs.uploader.imageName;
      for(var i = 0; i < this.imageList.length; i++){
        if(this.imageName == this.imageList[i]){
          alert("이미 등록된 사진 이름입니다.");
          this.$refs.uploader.imageUrl = "";
          this.$refs.uploader.imageFile = "";
          this.$refs.uploader.imageName = "";
          return;
        }else if(this.imageFile.size > 716800){
          alert("700KB 이하의 파일만 업로드 가능합니다.");
          this.$refs.uploader.imageUrl = "";
          this.$refs.uploader.imageFile = "";
          this.$refs.uploader.imageName = "";
          return;
        }
      }

      if(this.checkForm()){
        var storageRef = FirebaseService.getFirestorage().ref();
        var mountainsRef = storageRef.child(`previewImages/${this.imageName}`);

        mountainsRef.put(this.imageFile).then(snapshot => {
          snapshot.ref.getDownloadURL().then(downloadURL => {
            this.imageUrl = downloadURL;
          });
        });
        FirebaseService.postPreview(this.writerTitle, this.writerBody, "test")
        // FirebaseService.postPreview(this.writerTitle, this.writerBody, this.imageUrl, this.imageName, this.$store.state.nickname)
      }
    }
  }
};
</script>
