<template>
  <v-col cols="12" md="12">
    <v-container>
      <v-div>
        <h2>ประวัติการยืม-คืน</h2>
      </v-div>
      <br />

      <v-card-title>
        List
        <v-spacer></v-spacer>
        <div class="text-right">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </div>
      </v-card-title>

      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="desserts"
        :items-per-page="10"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:item.Status="{ item }">
          <div v-if="item.Status === 0" class="d-flex align-center">
            <v-badge bordered inline dot color="red"></v-badge>
            Pending
          </div>

          <div v-else-if="item.Status === 1" class="d-flex align-center">
            <v-badge bordered inline dot color="success"></v-badge>
            Accept
          </div>

          <div v-else-if="item.Status === 2" class="d-flex align-center">
            <v-badge bordered inline dot color="yellow"></v-badge>
            Reject
          </div>

          <div v-else-if="item.Status === 3" class="d-flex align-center">
            <v-badge bordered inline dot color="grey darken-3"></v-badge>
            Returned
          </div>

          <div v-else class="d-flex align-center">
            <v-badge bordered inline dot color="blue"></v-badge>
            Delivered
          </div>
        </template>

        <template v-slot:item.User_ID="{ item }">
          {{user_id}}
        </template>
      </v-data-table>
    </v-container>
  </v-col>
</template>

<script>
const url = "http://localhost:5000/api/history";
export default {
  middleware: "auth-user",
  data() {
    return {
      user_id: "",
      localUserData: { data: null },

      search: "",
      selected: [],
      headers: [
        /*{
          text: "No",
          align: "start",
          sortable: false,
          value: "no"
        },*/
        /*{ text: "Staff ID", value: "Staff_ID" },*/
        { text: "User ID", value: "User_ID" },
        { text: "Invenroty Number", value: "inventory_number" },
        { text: "Date_start", value: "Date_start" },
        { text: "Date_End", value: "Date_End" },
        { text: "Detail", value: "Detail" },
        { text: "Status", value: "Status" },
        // { text: "Staff ID", value: "Staff_ID" }
      ],
      desserts: []
    };
  },

  async mounted() {
    console.log("test");
    this.localUserData.data = JSON.parse(localStorage.getItem("userData"));
    if (this.localUserData.data !== null) {
      this.user_id = this.localUserData.data.Staff_ID;
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      const res = await this.$axios.get(url);
      this.desserts = res.data.response;
    }
  }
};
</script>
