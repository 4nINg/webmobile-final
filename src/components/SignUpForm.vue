<template>
  <div class="SignupMainDiv">
    <div class="signupbox">
      <span class="avatar">
        <!-- <i class="fas fa-user-plus"></i> -->
      </span>
      <h1 class="signupFormTitle">Sign Up</h1>
      <div class="signupFormInputArray">
        <p>Email</p>
        <input type="text" placeholder="Email" id="signUpID" v-model="email" required />
        <p>Username</p>
        <input
          type="text"
          placeholder="Username"
          id="signUpUsername"
          v-model="username"
          maxlength="10"
          required
        />
        <p>Password</p>
        <input type="password" placeholder="Password" id="signUpPW" v-model="password" required />
        <p>Password Confirm</p>
        <input
          type="password"
          placeholder="Password Confirm"
          id="signUpCheckPW"
          v-model="passwordCheck"
          :rules="[comparePasswords]"
          required
        />
      </div>
      <div class="signupFormButton">
        <span @click="userSignUp()">회원가입</span>
        <span @click="userSignUpCancle()">취소</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "SignUpForm",
  data() {
    return {
      email: "",
      username: "",
      password: "",
      passwordCheck: "",
      alert: false,
      dialog: false
    };
  },
  computed: {
    comparePasswords() {
      return this.password === this.passwordCheck
        ? true
        : "Passwords don't match";
    },
    error() {
      return this.$store.state.error;
    },
    loading() {
      return this.$store.state.loading;
    }
  },
  props: ["changeSelectPage"],
  methods: {
    //회원가입
    userSignUp() {
      if (this.email == "") {
        alert("email을 입력하세요.");
      }
      if (this.username == "") {
        alert("username을 입력하세요.");
        return;
      } else if (this.username.length >= 11) {
        alert("username은 10자 이내로 가능합니다.");
        return;
      }
      if (this.comparePasswords !== true) {
        alert("비밀번호를 다시 확인하세요.");
        return;
      }

      this.$store.dispatch("userSignUp", {
        email: this.email,
        username: this.username,
        password: this.password
      });
      // .finally(() => {
      //   this.changeSelectPage(0);
      // });
    },
    userSignUpCancle() {
      //회원가입 취소
      this.email = "";
      this.password = "";
      this.passwordCheck = "";
      this.username = "";
      this.changeSelectPage(4);
    },
    changeSelectPage(i) {
      this.$emit("inSignUpSelectPage", i);
    }
  },
  watch: {
    error(value) {
      if (value) {
        this.alert = true;
      }
    },
    alert(value) {
      if (!value) {
        this.$store.commit("setError", null);
      }
    }
  }
};
</script>
<style>
.SignupMainDiv {
  /* position: relative; */
  width: 90%;
  height: 81%;
  margin-top: -2%;
  margin-left: 10%;
  display: flex;
  align-items: center;
}
.signupbox {
  width: 30%;
  background-color: rgba(255, 255, 255, 0.8);
  margin-left: 30%;
  box-sizing: border-box;
  /* border-box: 테두리 기준으로 크기 정함. */
  font-family: sans-serif;
  box-shadow: 1px 1px 1px 1px rgba(212, 212, 212);
  letter-spacing: 0.05em;
  position: relative;
}
.signupFormInputArray {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 0.8em;
  margin-bottom: 4%;
}

.signupFormInputArray p {
  margin-top: 1em;
  width: 80%;
  font-weight: bold;
  justify-content: flex-start;
}
.signupFormInputArray input {
  width: 80%;
  border: none;
  border-bottom: 1px solid #000;
  background: transparent;
  outline: none;
  height: 2em;
}
.signupFormTitle {
  text-align: center;
  font-size: 22px;
  margin-top: 5%;
  margin-bottom: 2%;
  font-size: 4vmin;
}
.signupFormButton {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 6%;
  font-size: 0.8em;
}

.signupFormButton span {
  font-family: sans-serif;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: auto;
  width: 80%;
  border: none;
  outline: none;
  border: 1px solid rgba(184, 184, 184);
  background: transparent;
  height: 1.7em;
  font-size: 0.8em;
  font-weight: bold;
  box-shadow: 1px 1px 1px 1px rgba(119, 119, 119);
}
.signupFormButton span:nth-child(1):hover,
.signupFormButton span:nth-child(2):hover {
  background-color: black;
  color: white;
  transition: 1s;
}

.signupFormButton span:nth-child(2) {
  margin-top: 4%;
}
</style>
