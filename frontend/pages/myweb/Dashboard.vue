<template>
  <div>
    <h1>Dashboard</h1>
    <div class="container">
      <v-row>
        <!-- <v-col cols="12" md="6">
          <v-card>
            <line-chart
              v-if="loaded"
              :linechartdata="apidata"
              :linechartoptions="chartoptions"
            />
          </v-card>
        </v-col> -->
        <v-col cols="12" md="6">
          <v-card>
            <doughnut-chart
              v-if="sumsal_loaded"
              :doughnutchartdata="sumsal_apidata"
              :doughnutchartoptions="chartoptions"
            />
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card>
            <bar-chart
              v-if="count_location"
              :barchartdata="countdate_apidata"
              :barchartoptions="chartoptions"
            />
          </v-card>
        </v-col>
<!--
        <v-col cols="12" md="6">
          <v-card>
            <line-chart
              v-if="inventory_loaded"
              :linechartdata="inventory_apidata"
              :linechartoptions="chartoptions"
            />
          </v-card>
        </v-col> -->

      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  data: vm => ({
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    dateFormatted: vm.formatDate(
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10)
    ),
    menu1: false,
    menu2: false
  }),

  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    }
  },

  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
    }
  },

  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }
};
</script>

<script>
const url = "http://localhost:5000/api/countstatus";
const sumsal_url = "http://localhost:5000/api/countborrow";
const location_url = "http://localhost:5000/api/countlocation";
const inventory_url = "http://localhost:5000/api/countinventory";

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
    count_location: false,
    countdate_apidata: {
      labels: [],
      datasets: []
    },
    inventory_loaded: false,
    inventory_apidata: {
      labels: [],
      datasets: []
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
    }
  }),
  methods: {
    async getSalary() {
      this.loaded = false;
      try {
        const res = await this.$axios.get(sumsal_url);
        //console.log(res.data.response);
        var results = res.data.response;
        var templabels = [],
          tempdata = [];
        results.forEach(function(x) {
          templabels.push(x.inventory_number);
          tempdata.push(x.Count_Borrow);
        });
        //console.log(tempdata);
        var tempAPIdata = {
          labels: templabels,
          datasets: [
            {
              label: "Count by Status",
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
        const res = await this.$axios.get(url);
        console.log(res.data.response);
        var results = res.data.response;
        var templabels = [],
          tempdata = [];
        results.forEach(function(x) {
          templabels.push(x.Status);
          tempdata.push(x.Count_Item);
        });
        //console.log(tempdata);
        var tempAPIdata = {
          labels: ['Pending','Accept'],
          datasets: [
            {
              label: "Count Item",
              backgroundColor: [
                "Lavender",
                "MediumPurple",
                "silver",
                "red",
                "gold"
              ],
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
    },

    async getcountlocation() {
      this.count_location = false;
      try {
        const res = await this.$axios.get(location_url);
        console.log(res.data.response);
        var results = res.data.response;
        var templabels = [],
          tempdata = [];
        results.forEach(function(x) {
          templabels.push(x.Location);
          tempdata.push(x.Count_Location);
        });
        console.log(tempdata);
        var tempAPIdata = {
          labels: templabels,
          datasets: [
            {
              label: "Count Borrow By Location",
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
              borderWidth: 1,
              data: tempdata
            }
          ]
        };
        this.countdate_apidata = tempAPIdata;
        console.log(tempAPIdata);
        this.count_location = true;
      } catch (e) {
        console.error(e);
      }
    },
    async get_inventory() {
      this.loaded = false;
      try {
        const res = await this.$axios.get(inventory_url);
        //console.log(res.data.response);
        var results = res.data.response;
        var templabels = [],
          tempdata = [];
        results.forEach(function(x) {
          templabels.push(x.inventory_number);
          tempdata.push(x.Count_Item );
        });
        //console.log(tempdata);
        var tempAPIdata = {
          labels: templabels,
          datasets: [
            {
              label: "Count by Inventory",
              backgroundColor: "Lavender",
              borderColor: "blue",
              data: tempdata
            }
          ]
        };
        this.inventory_apidata = tempAPIdata;
        //console.log(tempAPIdata);
        this.inventory_loaded = true;
      } catch (e) {
        console.error(e);
      }
    },
  },
  mounted() {
    this.getSalary();
    this.getSumSalary();
    this.getcountlocation();
    this.get_inventory();
  }
};
</script>
