<template>
  <div class="loginMainDiv">
    <div class="loginbox">
      <span class="avatar">
        <i class="far fa-user-circle"></i>
      </span>
      <h1 class="loginFormTitle">Login</h1>
      <div class="loginFormInputArray">
        <p>Email</p>

        <input type="text" placeholder="Email" v-model="email" />
        <p>Password</p>
        <input type="password" placeholder="Password" v-model="password" />

      </div>
      <div class="loginFormButton">
        <span @click="userSignIn()">Login</span>
        <span @click="signUp()">Signup</span>
        <span @click="loginWithGoogle()" class="Google">
          <i class="fab fa-google"></i>&nbsp;Google
        </span>
        <span @click="loginWithFacebook()" class="Facebook">
          <i class="fab fa-facebook-f"></i>&nbsp;Facebook
        </span>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "LoginForm",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    userSignIn() {
      this.$store.dispatch("userSignIn", {
        email: this.email,
        password: this.password
      });
      // .finally(() => {
      //   this.changeSelectPage(0);
      //   // if(!this.$store.getters.isAdmin){
      //   //   document.querySelector("#adminPageBtn").style.display = "none";
      //   // }else{
      //   //   document.querySelector("#adminPageBtn").style.display = "block";
      //   // }
      // });
    },
    //google login
    loginWithGoogle() {
      this.$store.dispatch("userSignInWithGoogle", {});
      // .finally(() => {
      //   this.changeSelectPage(0);
      // });
    },
    //facebook login
    loginWithFacebook() {
      this.$store.dispatch("userSignInWithFacebook", {});
      // .finally(() => {
      //   this.changeSelectPage(0);
      // });
    },
    signUp() {
      this.changeSelectPage(5);
    },
    changeSelectPage(i) {
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
};
</script>
<style>
.loginMainDiv {
  width: 90%;
  height: 81%;
  margin-left: 10%;
  display: flex;
  align-items: center;
}
.loginbox {
  width: 30%;
  margin-bottom: 3%;
  background-color: rgb(255, 255, 255, 0.8);
  margin-left: 30%;
  box-sizing: border-box;
  font-family: sans-serif;
  box-shadow: 1px 1px 1px 1px rgb(212, 212, 212);
  letter-spacing: 0.05em;
  position: relative;
}
.avatar {
  font-size: 6vmax;
  color: rgb(0, 0, 0, 0.5);
  border-radius: 30%;
  margin-top: -6%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -5%;
}
.loginFormInputArray {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.loginFormInputArray p {
  margin-top: 1em;
  width: 80%;
  font-weight: bold;
  justify-content: flex-start;
}
.loginFormInputArray input {
  width: 80%;
  border: none;
  border-bottom: 1px solid #000;
  background: transparent;
  outline: none;
  height: 2em;
}
.loginFormTitle {
  text-align: center;
  font-size: 22px;
  margin-top: 13%;
}
.loginFormButton {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 10%;
}

.loginFormButton span {
  font-family: sans-serif;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.8em;
  width: 80%;
  border: none;
  outline: none;
  border: 1px solid rgb(184, 184, 184);
  background: transparent;
  height: 1.7em;
  font-size: 0.8em;
  font-weight: bold;
  box-shadow: 1px 1px 1px 1px rgb(119, 119, 119);
}
.fa-google {
  color: rgb(207, 61, 48);
}
.fa-facebook-f {
  color: rgb(46, 72, 122);
}
.loginFormButton span:nth-child(1):hover,
.loginFormButton span:nth-child(2):hover {
  background-color: black;
  color: white;
  transition: 1s;
}
.Google:hover {
  background-color: rgb(234, 67, 53);
  color: white;
  border: 1px solid rgb(234, 67, 53);
  transition: 1s;
}
.Facebook:hover {
  background-color: rgb(66, 103, 178);
  color: white;
  border: 1px solid rgb(66, 103, 178);
  transition: 1s;
}
</style>
