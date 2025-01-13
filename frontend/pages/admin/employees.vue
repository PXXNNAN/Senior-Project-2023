<template>
  <div>
    <h1>Dashboard</h1>
    <div class="container">
      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <line-chart
              :linechartdata="chartdata"
              :linechartoptions="chartoptions"
            />
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card>
            <bar-chart
              :barchartdata="bardata"
              :barchartoptions="chartoptions"
            />
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <line-chart
              v-if="loaded"
              :linechartdata="apidata"
              :linechartoptions="chartoptions"
            />
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card>
            <doughnut-chart
              v-if="sumsal_loaded"
              :doughnutchartdata="sumsal_apidata"
              :doughnutchartoptions="chartoptions"
            />
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
const url = "http://localhost:5000/api/employees";
const sumsal_url = "http://localhost:5000/api/sumsalary";

export default {
  data: () => ({
    loaded: false,
    apidata: {
      labels: [],
      datasets: []
    },
    sumsal_loaded: false,
    sumsal_apidata: {
      labels: [],
      datasets: []
    },
    chartdata: {
      labels: ["January", "February", "March", "April"],
      datasets: [
        {
          label: "Data One",
          //backgroundColor: "#lightsalmon",
          borderColor: "tomato",
          fill: false,
          data: [40, 20, 50, 10]
        }
      ]
    },
    chartoptions: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    },
    bardata: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ],
          borderWidth: 1
        }
      ]
    }
  }),
  methods: {
    async getSalary() {
      this.loaded = false;
      try {
        const res = await this.$axios.get(url);
        //console.log(res.data.response);
        var results = res.data.response;
        var templabels = [],
          tempdata = [];
        results.forEach(function(x) {
          templabels.push(x.emp_id);
          tempdata.push(x.salary);
        });
        //console.log(tempdata);
        var tempAPIdata = {
          labels: templabels,
          datasets: [
            {
              label: "Salay by Employee ID",
              backgroundColor: "Lavender",
              borderColor: "MediumPurple",
              data: tempdata
            }
          ]
        };
        this.apidata = tempAPIdata;
        //console.log(tempAPIdata);
        this.loaded = true;
      } catch (e) {
        console.error(e);
      }
    },
    async getSumSalary() {
      this.sumsal_loaded = false;
      try {
        const res = await this.$axios.get(sumsal_url);
        console.log(res.data.response);
        var results = res.data.response;
        var templabels = [],
          tempdata = [];
        results.forEach(function(x) {
          templabels.push(x.gender);
          tempdata.push(x.sum_salary);
        });
        //console.log(tempdata);
        var tempAPIdata = {
          labels: templabels,
          datasets: [
            {
              label: "Salay by Gender",
              backgroundColor: ["Lavender", "MediumPurple"],
              data: tempdata
            }
          ]
        };
        this.sumsal_apidata = tempAPIdata;
        console.log(tempAPIdata);
        this.sumsal_loaded = true;
      } catch (e) {
        console.error(e);
      }
    }
  },
  mounted() {
    this.getSalary();
    this.getSumSalary();
  }
};
</script>
