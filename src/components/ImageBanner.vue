<template>
  <div class="imgBanner">
    <div class="searchBox">
      <input type="text" name placeholder="Search" class="searchTxt" />
      <span class="searchBtn" @click="search()">
        <i class="fas fa-search"></i>
      </span>
      <span class="calendarBtn">
        <input type="text" id="datepicker" />
        <!-- <i class="far fa-calendar-alt"></i> -->
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    search() {
      var posterDiv = document.querySelector(".posterDiv");
      posterDiv.classList.toggle("visible");
    }
  }
};
</script>

<style>
.imgBanner {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5em;
  margin-top: 1em;
  width: 90%;
  height: 30em;
  background-image: url("../assets/moon.png");
  background-size: cover;
}

.searchBox {
  position: relative;
  display: flex;
  top: 36%;
  left: 0%;
  background: #2f3640;
  opacity: 0.8;
  height: 2em;
  border-radius: 1em;
  padding: 0.6em;
}

.searchBtn {
  cursor: pointer;
  color: rgb(44, 62, 80);
  float: right;
  width: 2em;
  height: 2em;
  border-radius: 80%;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.6s;
}

.searchTxt {
  border: none;
  background: none;
  outline: none;
  float: left;
  padding: 0;
  color: white;
  font-size: 1em;
  transition: 0.6s;
  line-height: 2em;
  width: 30em;
  padding: 0 0.5em;
}

.calendarBtn {
  cursor: pointer;
  color: rgb(44, 62, 80);
  float: right;
  width: 2em;
  height: 2em;
  border-radius: 80%;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.6s;
  margin-left: 2%;
}

.calendarBtn input {
  visibility: hidden;
}

.calendarBtn img {
  width: 1.3em;
  margin-right: 10.1em;
}
</style>

