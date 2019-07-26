<template>
  <div class="tableMainDiv">
    <div class="searchBox">
      <input type="text" placeholder="Search" class="searchTxt" />
      <i class="fas fa-search searchBtn"></i>
      <i class="far fa-calendar-alt calendarBtn" @click="openModal()"></i>
    </div>
    <div class="tableDiv">
      <div class="partDiv">
        <img src="@/assets/cgv.png" />
        <div class="partInnerDiv">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            <br />Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            <br />Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>
      <div class="partDiv">
        <img src="@/assets/megabox.png" />
        <div class="partInnerDiv">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            <br />Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            <br />Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>
      <div class="partDiv">
        <img src="@/assets/lotte.png" />
        <div class="partInnerDiv">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            <br />Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            <br />Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>
    </div>
    <div id="myModal" class="modal">
      <div class="modal-content">
        <span class="close">&times;</span>
        <div class="container col-sm-4 col-md-7 col-lg-4 mt-5">
          <div class="card">
            <h3 class="card-header" id="monthAndYear"></h3>
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

            <div class="form-inline">
              <button
                class="btn btn-outline-primary col-sm-6"
                id="previous"
                @click="previous()"
              >Previous</button>

              <button class="btn btn-outline-primary col-sm-6" id="next" @click="next()">Next</button>
            </div>
            <br />
            <form class="form-inline">
              <label class="lead mr-2 ml-2" for="month">Jump To:</label>
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
                <option value="1990">1990</option>
                <option value="1991">1991</option>
                <option value="1992">1992</option>
                <option value="1993">1993</option>
                <option value="1994">1994</option>
                <option value="1995">1995</option>
                <option value="1996">1996</option>
                <option value="1997">1997</option>
                <option value="1998">1998</option>
                <option value="1999">1999</option>
                <option value="2000">2000</option>
                <option value="2001">2001</option>
                <option value="2002">2002</option>
                <option value="2003">2003</option>
                <option value="2004">2004</option>
                <option value="2005">2005</option>
                <option value="2006">2006</option>
                <option value="2007">2007</option>
                <option value="2008">2008</option>
                <option value="2009">2009</option>
                <option value="2010">2010</option>
                <option value="2011">2011</option>
                <option value="2012">2012</option>
                <option value="2013">2013</option>
                <option value="2014">2014</option>
                <option value="2015">2015</option>
                <option value="2016">2016</option>
                <option value="2017">2017</option>
                <option value="2018">2018</option>
                <option value="2019">2019</option>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029</option>
                <option value="2030">2030</option>
              </select>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      today: null,
      currentMont: null,
      currentYear: null,
      selectYear: null,
      selectMonth: null,
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
      monthAndYear: null
    };
  },
  mounted() {
    this.today = new Date();
    this.currentMonth = this.today.getMonth();
    this.currentYear = this.today.getFullYear();
    this.selectYear = document.getElementById("year");
    this.selectMonth = document.getElementById("month");
    this.monthAndYear = document.getElementById("monthAndYear");
    this.showCalendar(this.currentMonth, this.currentYear);
  },
  methods: {
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
            cell.appendChild(cellText);
            row.appendChild(cell);
            date++;
          }
        }

        tbl.appendChild(row); // appending each row into calendar body.
      }
    },
    openModal() {
      alert("!!@!@!@!@!@!@");
      document.getElementById("myModal").style.display = "block";
    }
  }
};
</script>
<style>
.tableMainDiv {
  display: flex;
  flex-direction: column;
  height: 80vh;
  background-color: rgb(255, 255, 255, 0.7);
}

.searchBox {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.searchBox * {
  /* margin-left: 5%; */
  /* margin-right: 2%; */
  /* margin-bottom: 3%; */
  /* transform: translateY(-170%); */
  font-size: 1.4em;
}

.searchBtn {
  cursor: pointer;
}

.searchTxt {
  width: 35%;
  padding: 0.6%;
  box-sizing: border-box;
  /* border: 1px solid rgb(240, 240, 240); */
  border: 1px solid black;
  border-radius: 0.7em;
  background-color: rgb(150, 150, 150, 0.9);
  color: white;
}

::-webkit-input-placeholder {
  color: white;
}

.searchBtn {
  margin-left: -1.9%;
  margin-bottom: 0.8%;
}

.tableDiv {
  display: flex;
  justify-content: space-evenly;
  height: 75vh;
  margin-left: 1%;
}
.partDiv {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  /* margin-top: 5%; */
}

.partInnerDiv {
  width: 100%;
  /* margin-top: 5%; */
  /* margin-bottom: 5%; */
  height: 40em;
  /* padding: 1% 1%; */
  border: 1px solid rgb(0, 0, 0, 0.1);
  /* border: 1px solid red; */
  overflow: auto;
}

.partDiv img {
  width: 30%;
  height: 7%;
  background-size: cover;
  margin-bottom: 3%;
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
  margin-left: 1.5%;
  margin-bottom: 1%;
}

.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 50%; /* Could be more or less, depending on screen size */
}
/* The Close Button */
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}
.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>

