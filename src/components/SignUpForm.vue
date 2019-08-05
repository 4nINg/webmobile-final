<template>
  <div id="signUpForm">
    <div>
      <span>E-Mail</span>
      <input type="text" placeholder="ID" id="signUpID" v-model="email" required />
    </div>
    <div>
      <span>Password</span>
      <input type="password" placeholder="Password" id="signUpPW" v-model="password" required />
    </div>
    <div>
      <span>Check Password</span>
      <input
        type="password"
        placeholder="Check Password"
        id="signUpCheckPW"
        v-model="passwordCheck"
        :rules="[comparePasswords]"
        required
      />
    </div>
    <div>
      <span>Username</span>
      <input type="text" placeholder="Username" id="signUpUsername" v-model="username" required />
    </div>
    <button @click="userSignUp()">회원가입</button>
    <button @click="userSignUpCancle()">취소</button>
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
  methods: {
    props: ["changeSelectPage"],
    userSignUp() {
      //회원가입
      if (this.comparePasswords !== true) {
        return;
      }
      this.$store
        .dispatch("userSignUp", {
          email: this.email,
          username: this.username,
          password: this.password
        })
        .finally(() => {
          this.changeSelectPage(0);
        });
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
#signUpForm {
  /* margin-left: 30%;
  margin-top: 30%; */
  position: relative;
  top: 25%;
  left: 40%;
}

#signUpForm button {
  margin-right: 5px;
}
</style>
