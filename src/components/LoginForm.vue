<template>
<div id="loginForm">
  <form style="display:inline">
    <div><span>E-Mail</span><input type="text" placeholder="ID" id="loginID" v-model="email" required></div>
    <div><span>Password</span><input type="password" placeholder="Password" id="loginPW" v-model="password" required></div>
    <button @click="userSignIn()">SignIn</button>
  </form>
  <button @click="signUp()">SignUp</button>
  <button @click="loginWithGoogle()">Google</button>
  <button @click="loginWithFacebook()">Facebook</button>
  <SignUpForm></SignUpForm>
</div>
</template>
<script>
import FirebaseService from "../services/FirebaseService"
import SignUpForm from "@/components/SignUpForm"

export default {
  name: "LoginForm",
  components:{
    SignUpForm
  },
  data(){
    return{
      email: "",
      password: ""
    }
  },
  methods : {
    async userSignIn(){
      await this.$store.dispatch("userSignIn", {
        email: this.email,
        password: this.password
      });
      this.email = "";
      this.password = "";
      document.querySelector("#loginForm").style.display = "none";
      document.querySelector("#signUpForm").style.display = "none";
    },
    //google login
    loginWithGoogle() {
      this.$store.dispatch("userSignInWithGoogle", {});
    },
    //facebook login
    loginWithFacebook() {
      this.$store.dispatch("userSignInWithFacebook", {});
    },
    signUp(){
      document.querySelector("#signUpForm").style.display = "block";
    }
  },
  computed: {
    error() {
      return this.$store.state.error;
    },
    loading() {
      return this.$store.state.loading;
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
}
</script>
<style>

#loginForm{
  margin-left: 30%;
  margin-top: 30%;
}
#loginForm button{
  margin-right:5px;
}
</style>
