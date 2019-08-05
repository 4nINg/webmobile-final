<template>
  <div class="imgUploaderMainDiv">
    <input
      type="text"
      placeholder="Select Image"
      @click="pickFile"
      :value="imageName"
      id="imageName"
      class="inImgUploaderInput"
    />
    <input
      type="file"
      class="inImgUploaderFile"
      ref="image"
      style="display:none"
      accept="image/*"
      @change=" onFilePicked"
    />
  </div>
</template>
<script>
export default {
  name: "ImgUploader",
  data() {
    return {
      imageName: "",
      imageUrl: "",
      imageFile: ""
    };
  },
  methods: {
    pickFile() {
      this.$refs.image.click();
    },
    onFilePicked(e) {
      const files = e.target.files;

      var typeCheck = [
        "image/gif",
        "image/png",
        "image/jpeg",
        "image/bmp",
        "image/webp"
      ];
      for (var i = 0; i < typeCheck.length; i++) {
        if (files[0].type == typeCheck[i]) {
          break;
        } else if (i == typeCheck.length - 1) {
          if (files[0].type !== "") {
            alert("gif, png, jpeg, bmp, webp 파일만 업로드 가능합니다.");
            this.imageName = "";
            this.imageUrl = "";
            this.imageFile = "";
          }
          return;
        }
      }
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        // document.querySelector("#imageName").value = this.imageName;
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result;
          this.imageFile = files[0];
        });
      } else {
        this.imageName = "";
        this.imageFile = "";
        this.imageUrl = "";
      }
    }
  }
};
</script>
<style>
.imgUploaderMainDiv {
  width: 100%;
  height: 10%;
}

.imgUploaderMainDiv > input {
  width: 98.5%;
  height: 100%;
  padding: 0.5%;
}
</style>
