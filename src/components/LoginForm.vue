<template>
<div id="loginForm">
  <div><span>E-Mail</span><input type="text" placeholder="ID" id="loginID" v-model="email" required></div>
  <div><span>Password</span><input type="password" placeholder="Password" id="loginPW" v-model="password" required></div>
  <button @click="userSignIn()">SignIn</button>
  <button @click="signUp()">SignUp</button>
  <button @click="loginWithGoogle()">Google</button>
  <button @click="loginWithFacebook()">Facebook</button>
</div>
</template>
<script>
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
    userSignIn(){
      this.$store.dispatch("userSignIn", {
        email: this.email,
        password: this.password
      })
      .finally(()=>{
        this.changeSelectPage(0);
        // if(!this.$store.getters.isAdmin){
        //   document.querySelector("#adminPageBtn").style.display = "none";
        // }else{
        //   document.querySelector("#adminPageBtn").style.display = "block";
        // }
      });
    },
    //google login
    loginWithGoogle() {
      this.$store.dispatch("userSignInWithGoogle", {})
      .finally(()=>{
        this.changeSelectPage(0);
      });
    },
    //facebook login
    loginWithFacebook() {
      this.$store.dispatch("userSignInWithFacebook", {})
      .finally(()=>{
        this.changeSelectPage(0);
      });
    },
    signUp(){
      this.changeSelectPage(5);
    },
    changeSelectPage(i){
      this.$emit("inLoginSelectPage", i);
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
