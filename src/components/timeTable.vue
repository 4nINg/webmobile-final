<template>
  <div class="tableMainDiv">
    <div class="searchBox">
      <div @click="openModal()" class="calendarBtn">
        <span>
          <i class="far fa-calendar-alt"></i>
        </span>
      </div>
      <div class="searchTextBox">
        <input type="text" v-model="searchKeyword" placeholder="Search" class="searchTxt" />
        <div class="searchSuggetDiv">
          <ul>
            <li v-for="i in searchSuggestList.length" :key="i">
              <div
                @click="selectSearchSuggest(i-1)"
                class="searchSuggest"
              >{{searchSuggestList[i-1]}}</div>
            </li>
          </ul>
        </div>
      </div>
      <div @click="searchMovie()" class="searchBtn">
        <span>
          <i class="fas fa-search"></i>
        </span>
      </div>
    </div>
    <div class="searchResult">
      <div class="searchResultImg"></div>
      <div class="searchResultContent">
        <div class="searchResultTitle">{{searchMovieTitle}}</div>
        <div class="searchResultOverview">{{searchMovieOverview}}</div>
      </div>
    </div>
    <div class="tableDiv">
      <div class="partDiv cgvDiv">
        <div class="cgvInner" v-if="cgvResult.length === 0">현재 상영 정보가 없습니다.</div>
        <div v-for="q in cgvResult.length" :key="q" class="cgvInner">{{cgvResult[q-1]}}</div>
      </div>
      <div class="partDiv megaboxDiv">
        <div class="cgvInner" v-if="megaboxResult.length === 0">현재 상영 정보가 없습니다.</div>
        <div v-for="w in megaboxResult.length" :key="w" class="megaboxInner">{{megaboxResult[w-1]}}</div>
      </div>
      <div class="partDiv lotteDiv">
        <div class="cgvInner" v-if="lotteResult.length === 0">현재 상영 정보가 없습니다.</div>
        <div v-for="e in lotteResult.length" :key="e" class="lotteInner">{{lotteResult[e-1]}}</div>
      </div>
    </div>
    <div id="myModal" class="modal">
      <div class="modal-content">
        <div class="container col-sm-4 col-md-7 col-lg-4 mt-5 modalContainer">
          <div class="card">
            <div class="modalHeader">
              <span @click="previous()">
                <i class="fas fa-caret-left"></i>
              </span>
              <h3 class="card-header" id="monthAndYear"></h3>
              <span @click="next()">
                <i class="fas fa-caret-right"></i>
              </span>
            </div>
            <table class="table table-bordered table-responsive-sm" id="calendar">
              <thead>
                <tr>
                  <th>Sun</th>
                  <th>Mon</th>
                  <th>Tue</th>
                  <th>Wed</th>
                  <th>Thu</th>
                  <th>Fri</th>
                  <th>Sat</th>
                </tr>
              </thead>

              <tbody id="calendar-body"></tbody>
            </table>
            <br />
            <form class="form-inline jumpDiv">
              <select class="form-control col-sm-4" name="month" id="month" @change="jump()">
                <option value="0">Jan</option>
                <option value="1">Feb</option>
                <option value="2">Mar</option>
                <option value="3">Apr</option>
                <option value="4">May</option>
                <option value="5">Jun</option>
                <option value="6">Jul</option>
                <option value="7">Aug</option>
                <option value="8">Sep</option>
                <option value="9">Oct</option>
                <option value="10">Nov</option>
                <option value="11">Dec</option>
              </select>

              <label for="year"></label>
              <select class="form-control col-sm-4" name="year" id="year" @change="jump()">
                <option value="2018">2018</option>
                <option value="2019">2019</option>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
              </select>
            </form>
          </div>
          <span class="close" @click="closeModal()">&times;</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      today: null,
      currentMont: null,
      currentYear: null,
      selectYear: null,
      selectMonth: null,
      selectDay: null,
      months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      monthAndYear: null,
      megaboxDate: [],
      megaboxList: [],
      megaboxResult: [],
      lotteDate: [],
      lotteList: [],
      lotteResult: [],
      cgvDate: [],
      cgvList: [],
      cgvResult: [],
      searchKeyword: "",
      totalMovieList: [],
      searchMovieTitle: "",
      searchMovieImgUrl: "",
      searchMovieOverview: "",
      searchSuggestList: []
    };
  },
  mounted() {
    this.crawlingData();
    this.today = new Date();
    this.currentMonth = this.today.getMonth();
    this.currentYear = this.today.getFullYear();
    this.selectYear = document.getElementById("year");
    this.selectMonth = document.getElementById("month");
    this.monthAndYear = document.getElementById("monthAndYear");
    this.showCalendar(this.currentMonth, this.currentYear);
  },
  methods: {
    selectSearchSuggest(i) {
      var searchSuggest = document.querySelectorAll(".searchSuggest");
      this.searchKeyword = searchSuggest[i].innerText;
      this.searchSuggestList = [];
    },
    searchSuggest() {
      this.searchSuggestList = [];
      if (this.searchKeyword !== "") {
      }
    },
    next() {
      this.currentYear === 11 ? this.currentYear + 1 : this.currentYear;
      this.currentMonth = (this.currentMonth + 1) % 12;
      this.showCalendar(this.currentMonth, this.currentYear);
    },
    previous() {
      this.currentYear =
        this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
      this.currentMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
      this.showCalendar(this.currentMonth, this.currentYear);
    },
    jump() {
      this.currentYear = parseInt(this.selectYear.value);
      this.currentMonth = parseInt(this.selectMonth.value);
      this.showCalendar(this.currentMonth, this.currentYear);
    },
    showCalendar(month, year) {
      var self = this;
      let firstDay = new Date(year, month).getDay();
      let daysInMonth = 32 - new Date(year, month, 32).getDate();

      let tbl = document.getElementById("calendar-body"); // body of the calendar

      // clearing all previous cells
      tbl.innerHTML = "";

      // filing data about month and in the page via DOM.
      this.monthAndYear.innerHTML = this.months[month] + " " + year;
      this.selectYear.value = year;
      this.selectMonth.value = month;

      // creating all cells
      let date = 1;
      for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
          if (i === 0 && j < firstDay) {
            let cell = document.createElement("td");
            let cellText = document.createTextNode("");
            cell.appendChild(cellText);
            row.appendChild(cell);
          } else if (date > daysInMonth) {
            break;
          } else {
            let cell = document.createElement("td");
            let cellText = document.createTextNode(date);
            if (
              date === this.today.getDate() &&
              year === this.today.getFullYear() &&
              month === this.today.getMonth()
            ) {
              cell.classList.add("bg-info");
            } // color today's date
            cell.classList.add("selectDay");
            cell.addEventListener("click", () => {
              self.selectDay =
                "" +
                year +
                "-" +
                (month + 1 < 10 ? "0" + (month + 1) : month + 1) +
                "-" +
                (cell.innerHTML < 10 ? "0" + cell.innerHTML : cell.innerHTML);
              var selectedDay = document.querySelectorAll(".selectedDay");
              for (var z = 0; z < selectedDay.length; ++z) {
                selectedDay[z].classList.remove("selectedDay");
              }
              cell.classList.add("selectedDay");
              document.getElementById("myModal").style.display = "none";
            });
            cell.appendChild(cellText);
            row.appendChild(cell);
            date++;
          }
        }
        tbl.appendChild(row); // appending each row into calendar body.
      }
    },
    openModal() {
      document.getElementById("myModal").style.display = "block";
    },
    closeModal() {
      document.querySelector(".searchSuggetDiv").style.display = "block";
      document.getElementById("myModal").style.display = "none";
    },
    crawlingData() {
      this.crawMegabox();
      this.crawLotte();
      this.crawCgv();
    },
    crawMegabox() {
      var self = this;
      axios
        .get("http://192.168.100.81:8888/megabox", {
          headers: {
            "Access-Control-Allow-Origin": "*"
          }
        })
        .then(response => {
          var byDate = response.data.info.split("&&"); //날짜별;
          var date = [];
          var movieList = [];
          var temp = null;
          for (var i = 0; i < byDate.length; ++i) {
            temp = byDate[i].split("*"); //날짜와 영화들 분리
            if (temp[1] === "@") {
              continue;
            }
            date.push(temp[0]);
            movieList.push(temp[1]);
          }
          self.megaboxDate = date;
          self.megaboxList = movieList;

          var byMovie = null;
          var byTitle = null;
          var flag = true;
          var byTitleTime = null;
          for (var q = 0; q < movieList.length; ++q) {
            // if (movieList[q] === "@") {
            //   continue;
            // }
            byMovie = movieList[q].split(",,");
            for (var j = 0; j < byMovie.length; j++) {
              flag = true;
              byTitleTime = byMovie[j].split("/");
              for (var k = 0; k < self.totalMovieList.length; ++k) {
                if (self.totalMovieList[k] === byTitleTime[0]) {
                  flag = false;
                  break;
                }
              }
              if (flag) {
                self.totalMovieList.push(byTitleTime[0]);
              }
            }
          }
        });
    },
    crawLotte() {
      var self = this;
      axios
        .get("http://192.168.100.81:8888/lottecinema", {
          headers: {
            "Access-Control-Allow-Origin": "*"
          }
        })
        .then(response => {
          var byDate = response.data.info.split("&&"); //날짜별;
          var date = [];
          var movieList = [];
          var temp = null;
          for (var i = 0; i < byDate.length; ++i) {
            temp = byDate[i].split("*");
            if (temp[1] === "@") {
              continue;
            }
            date.push(temp[0]);
            movieList.push(temp[1]);
          }
          self.lotteDate = date;
          self.lotteList = movieList;

          var byMovie = null;
          var byTitle = null;
          var flag = true;
          var byTitleTime = null;
          for (var q = 0; q < movieList.length; ++q) {
            // if (movieList[q] === "@") {
            //   continue;
            // }
            byMovie = movieList[q].split(",,");
            for (var j = 0; j < byMovie.length; j++) {
              flag = true;
              byTitleTime = byMovie[j].split("/");
              for (var k = 0; k < self.totalMovieList.length; ++k) {
                if (self.totalMovieList[k] === byTitleTime[0]) {
                  flag = false;
                  break;
                }
              }
              if (flag) {
                self.totalMovieList.push(byTitleTime[0]);
              }
            }
          }
        });
    },
    crawCgv() {
      var self = this;
      axios
        .get("http://192.168.100.81:8888/cgv", {
          headers: {
            "Access-Control-Allow-Origin": "*"
          }
        })
        .then(response => {
          var byDate = response.data.info.split("&&"); //날짜별;
          var date = [];
          var movieList = [];
          var temp = null;
          for (var i = 0; i < byDate.length; ++i) {
            temp = byDate[i].split("*");
            if (temp[1] === "@") {
              continue;
            }
            date.push(temp[0]);
            movieList.push(temp[1]);
          }
          self.cgvDate = date;
          self.cgvList = movieList;

          var byMovie = null;
          var byTitle = null;
          var flag = true;
          var byTitleTime = null;
          for (var q = 0; q < movieList.length; ++q) {
            // if (movieList[q] === "@") {
            //   continue;
            // }
            byMovie = movieList[q].split(",,");
            for (var j = 0; j < byMovie.length; j++) {
              flag = true;
              byTitleTime = byMovie[j].split("/");
              for (var k = 0; k < self.totalMovieList.length; ++k) {
                if (self.totalMovieList[k] === byTitleTime[0]) {
                  flag = false;
                  break;
                }
              }
              if (flag) {
                self.totalMovieList.push(byTitleTime[0]);
              }
            }
          }
        });
    },
    searchMovie() {
      if (this.selectDay == null) {
        alert("날짜를 선택해주세요!");
        return;
      }
      if (this.searchKeyword === null || this.searchKeyword === "") {
        alert("검색어를 입력해주세요!");
        return;
      }
      this.searchMovieImgUrl = "";
      this.searchMegabox();
      this.searchLotte();
      this.searchCgv();
      for (var i = 0; i < this.totalMovieList.length; ++i) {
        if (this.totalMovieList[i].includes(this.searchKeyword)) {
          this.searchResultKeyword = this.totalMovieList[i];
          break;
        }
      }
      this.movieDetail();
    },
    async movieDetail() {
      this.searchSuggestList = [];
      // this.$store.state.loading = true;
      var self = this;
      var searchResult = null;
      var finalKeyword = this.searchKeyword.replace(" (우리말녹음)", "");
      await axios
        .get(
          "https://api.themoviedb.org/3/search/movie?api_key=584467f43959cb7bd6c03220e9d02eb7&language=ko&query=" +
            finalKeyword +
            "&page=1&include_adult=true&region=kr&year=2019&primary_release_year=2019"
        )
        .then(response => {
          searchResult = response.data;
          try {
            document.querySelector(".searchResultImg").style.backgroundImage =
              "url(https://image.tmdb.org/t/p/w200" +
              searchResult.results[0].poster_path;
            self.searchMovieTitle = searchResult.results[0].title;
            self.searchMovieOverview = searchResult.results[0].overview;
          } catch (error) {
            this.searchMovieImgUrl = "";
          }
          // this.$store.state.loading = false;
        });
      this.searchKeyword = "";
      this.searchSuggestList = [];
    },
    searchLotte() {
      var lotteDiv = document.querySelector(".lotteDiv");
      this.lotteResult = [];
      var result = [];
      var bfsplit = null;
      for (var i = 0; i < this.lotteDate.length - 1; ++i) {
        if (this.lotteDate[i] == this.selectDay) {
          bfsplit = this.lotteList[i];
          break;
        }
      }

      var afsplit = bfsplit.split(",");
      var temp = null;
      var final = null;
      for (var i = 0; i < afsplit.length - 1; ++i) {
        temp = afsplit[i].split("/");
        if (temp[0] === this.searchKeyword) {
          final = temp[1].split("|");
          this.lotteResult = final;
          break;
        }
      }
    },
    searchMegabox() {
      var megaboxDiv = document.querySelector(".megaboxDiv");
      this.megaboxResult = [];
      var result = [];
      var bfsplit = null;

      for (var i = 0; i < this.megaboxDate.length - 1; ++i) {
        if (this.megaboxDate[i] == this.selectDay) {
          bfsplit = this.megaboxList[i];
          break;
        }
      }
      var afsplit = bfsplit.split(",");
      var temp = null;
      var final = null;
      for (var i = 0; i < afsplit.length - 1; ++i) {
        temp = afsplit[i].split("/");
        if (temp[0] === this.searchKeyword) {
          final = temp[1].split("|");
          this.megaboxResult = final;
          break;
        }
      }
    },
    searchCgv() {
      var cgvDiv = document.querySelector(".cgvDiv");
      this.cgvResult = [];
      var result = [];
      var bfsplit = null;
      for (var i = 0; i < this.cgvDate.length - 1; ++i) {
        if (this.cgvDate[i] == this.selectDay) {
          bfsplit = this.cgvList[i];
          break;
        }
      }

      var afsplit = bfsplit.split(",");
      var temp = null;
      var final = null;
      for (var i = 0; i < afsplit.length - 1; ++i) {
        temp = afsplit[i].split("/");
        if (temp[0] === this.searchKeyword) {
          final = temp[1].split("|");
          this.cgvResult = final;
          break;
        }
      }
    }
  },
  watch: {
    searchKeyword: function() {
      if (this.searchKeyword === "") {
        this.searchSuggestList = [];
      } else {
        this.searchSuggestList = [];
        for (var i = 0; i < this.totalMovieList.length; ++i) {
          if (this.totalMovieList[i].includes(this.searchKeyword)) {
            this.searchSuggestList.push(this.totalMovieList[i]);
          }
        }
        this.searchSuggestList.sort();
      }
    }
  }
};
</script>

<style>
.tableMainDiv {
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
  height: 87%;
  width: 93%;
  margin-left: 7%;
  background-color: rgb(255, 255, 255, 0.7);
}

.searchBox {
  position: absolute;
  top: 4.5%;
  margin-left: 15%;
  width: 60%;
  height: 5%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-size: 1.4em;
  /* margin-bottom: 2%; */
}

.searchBtn {
  cursor: pointer;
  /* background-color: red; */
  margin-top: 0.3%;
  margin-left: 1%;
}
.searchTextBox {
  width: 35%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.searchTxt {
  background-color: rgb(0, 0, 0, 0.1);
  width: 94.5%;
  height: 100%;
  padding: 3% 3%;
  border: none;
  border-top-left-radius: 0.5em;
  border-top-right-radius: 0.5em;
  color: black;
}

.searchTxt:focus {
  outline: none;
}

.searchSuggetDiv {
  border: 1px solid rgb(0, 0, 0, 0.1);
  border-bottom-left-radius: 0.5em;
  border-bottom-right-radius: 0.5em;
  background-color: white;
  width: 100%;
  z-index: 9999999999999999;
}

.searchSuggetDiv li {
  list-style: none;
  font-size: 0.6em;
  /* margin-bottom: 1%; */
  padding-top: 1%;
  margin-left: 1%;
  padding-bottom: 1%;
  border-bottom: 1px solid rgb(0, 0, 0, 0.1);
}

::-webkit-input-placeholder {
  color: black;
}

.tableDiv {
  display: flex;
  justify-content: space-around;
  height: 29vh;
  width: 100%;
  /* margin-left: 1%; */
}
.partDiv {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  border: 1px solid rgb(0, 0, 0, 0.1);
  overflow: auto;
}

::-webkit-scrollbar-track {
  width: 0.1%;
  background-color: white;
}

::-webkit-scrollbar {
  width: 0.1em;
}

::-webkit-scrollbar-thumb {
  border-radius: 15%;
  background-color: black;
}

.calendarBtn {
  cursor: pointer;
  margin-right: 1.5%;
  margin-top: 0.3%;
}

.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: hidden; /* Enable scroll if needed */
  /* background-color: rgb(0, 0, 0); Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
  display: flex;
  justify-content: center;
  text-align: center;
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 25%; /* Could be more or less, depending on screen size */
}

.modalContainer {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
}

.modalContainer .card {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.modal-content td,
.modal-content th {
  padding-left: 2%;
  padding-right: 2%;
  width: 2em;
}

#calendar-body td {
  cursor: pointer;
}
/* The Close Button */
.close {
  position: absolute;
  top: 0;
  right: 0;
  transform: translateY(-50%);
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
}
.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.preNextDiv {
  margin-top: 6%;
  display: flex;
  justify-content: space-evenly;
}

.jumpDiv {
  display: flex;
  justify-content: center;
}

.bg-info {
  transform: scale(1.2);
  font-weight: 600;
}

.selectDay:hover,
.selectedDay {
  background-color: rgb(255, 98, 0);
}

.megaboxInner,
.lotteInner,
.cgvInner {
  width: 80%;
  padding-bottom: 4%;
  margin-top: 4%;
  font-size: 1.1em;
  border-bottom: 1px solid rgb(0, 0, 0, 0.1);
  text-align: center;
}

.modalHeader {
  display: flex;
  justify-content: center;
  align-items: center;
}

.modalHeader span {
  cursor: pointer;
  margin-left: 1em;
  margin-right: 1em;
  font-size: 1.2em;
}

.cgvDiv,
.megaboxDiv,
.lotteDiv {
  position: relative;
}

.megaboxDiv::after {
  width: 100%;
  height: 100%;
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  background-image: url("../assets/megabox.png");
  background-repeat: no-repeat;
  background-position: center;
  background-origin: content-box;
  background-size: 100%;
  opacity: 0.5 !important;
}

.lotteDiv::after {
  width: 100%;
  height: 100%;
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  background-image: url("../assets/lotte.png");
  background-repeat: no-repeat;
  background-position: center;
  background-origin: content-box;
  background-size: 100%;
  opacity: 0.5 !important;
}

.cgvDiv::after {
  width: 100%;
  height: 100%;
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  background-image: url("../assets/cgv.png");
  background-repeat: no-repeat;
  background-position: center;
  background-origin: content-box;
  background-size: 100%;
  opacity: 0.5 !important;
}

.searchResult {
  width: 100%;
  height: 38vh;
  margin-bottom: 1%;
  display: flex;
  justify-content: center;
}

.searchResultContent {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-right: 9.3%;
  margin-left: 5%;
}

.searchResultImg {
  width: 20%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  margin-left: 10%;
}

.searchResultTitle {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 2em;
}

.searchResultOverview {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  overflow: auto;
  /* margin-bottom: 5%; */
}

.searchSuggest {
  width: 100%;
  cursor: pointer;
}
</style>
