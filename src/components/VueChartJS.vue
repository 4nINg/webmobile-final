<script>
import chart from "vue-chartjs";
import Vue from "vue";

Vue.prototype.EventBus = new Vue();

export default {
  name: "VueChartJS",
  props:['userInfoList', 'reviewList', 'previewList'],
  extends: chart.Line,
  data() {
    return {
      userInfoListLength : this.userInfoList.length,
      max: 0,
      mylabels: [],
      mydata: [],
      datacollection: {
        labels: ['4일전', '3일전', '2일전', '1일전', '오늘'], //날짜
        datasets: [
          //User
          {
            label: "User",
            backgroundColor: "rgba(255,255,0,0)",
            pointBackgroundColor: "black",
            borderWidth: 2,
            pointBorderColor: "black",
            borderColor: "gold",

            data: []
          },
          //Review
          {
            label: "Review",
            backgroundColor: "rgba(255,0,255,0)",
            pointBackgroundColor: "black",
            borderWidth: 2,
            pointBorderColor: "black",
            borderColor: "blue",

            data: []
          },
          //Preview
          {
            label: "Preview",
            backgroundColor: "rgba(0,255,255,0)",
            pointBackgroundColor: "black",
            borderWidth: 2,
            pointBorderColor: "black",
            borderColor: "red",
            data: []
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                min: 0,
                max: 10
              },
              gridLines: {
                display: true
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
        },
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  mounted() {
    var currentDate = new Date().getTime();

    // for(var i = 0; i < 5; i++){
    //   this.datacollection.labels[i] = currentDate;
    //   currentDate = new Date(currentDate).getTime() - (1 * 24 * 60 * 60 * 1000);
    // }
    this.reCount(this.userInfoList, 1);
    this.reCount(this.reviewList, 2);
    this.reCount(this.previewList, 3);

    // this.renderChart(this.datacollection, this.options);
  },
  methods: {
    reCount(list, type){
      if(list == null){
        return;
      }
      var currentDate = new Date();
      var recountMax = 0;
      if(type == 1){ //userInfoList
        var result = []
        for(var i = 0; i < 5; i++){
          var count = 0;
          for(var j = 0; j < list.length; j++){
            var tmpArr = (list[j].creationTime+"").split(" ");
            var curArr = (currentDate+"").split(" ");
            if(tmpArr[0] == curArr[0] &&
               tmpArr[1] == curArr[1] &&
               tmpArr[2] == curArr[2]){
                 count++
            }
          }
          result.push(count);
          currentDate.setDate(currentDate.getDate() - 1);
          // console.log(currentDate);
        }
        for(var i = 4; i >= 0; i--){
          if(recountMax < result[i]){
            recountMax = result[i];
          }
          this.datacollection.datasets[0].data.push(result[i]);
        }
      }else if(type == 2){  //reviewList
        var result = []
        for(var i = 0; i < 5; i++){
          var count = 0;
          for(var j = 0; j < list.length - 1; j++){
            var tmpArr = (list[j].created_at + "").split(" ");
            var curArr = (currentDate+"").split(" ");
            if(tmpArr[0] == curArr[0] &&
               tmpArr[1] == curArr[1] &&
               tmpArr[2] == curArr[2]){
                 count++
            }
          }
          result.push(count);
          currentDate.setDate(currentDate.getDate() - 1);
        }
        for(var i = 4; i >= 0; i--){
          if(recountMax < result[i]){
            recountMax = result[i];
          }
          this.datacollection.datasets[1].data.push(result[i]);
        }
      }else{  //previewList
        var result = []
        for(var i = 0; i < 5; i++){
          var count = 0;
          for(var j = 0; j < list.length - 1; j++){
            var tmpArr = (list[j].created_at + "").split(" ");
            var curArr = (currentDate+"").split(" ");
            if(tmpArr[0] == curArr[0] &&
               tmpArr[1] == curArr[1] &&
               tmpArr[2] == curArr[2]){
                 count++
            }
          }
          result.push(count);
          currentDate.setDate(currentDate.getDate() - 1);
        }
        for(var i = 4; i >= 0; i--){
          if(recountMax < result[i]){
            recountMax = result[i];
          }
          this.datacollection.datasets[2].data.push(result[i]);
        }

      }


      if(recountMax + 1 > this.options.scales.yAxes[0].ticks.max){
        this.options.scales.yAxes[0].ticks.max = recountMax+1;
      }
      this.reLoad();
    },
    reLoad() {
      // this.$data._chart.update();
      this.renderChart(this.datacollection, this.options);
    }
  },
  watch : {
    userInfoListLength:function(){
      this.reCount(this.userInfoList, 1);
    },
    reviewList:function(){
      this.reCount(this.reviewList, 2);
    },
    previewList:function(){
      this.reCount(this.previewList, 3);
    }
  }
};
</script>
