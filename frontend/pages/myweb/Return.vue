<template>
  <v-container>
    <v-div>
      <h2>คืนครุภัณฑ์</h2>
    </v-div>
    <br />
    <v-card>
      <v-card-title>
        List
        <v-spacer></v-spacer>
        <div class="text-left">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </div>
      </v-card-title>
      <v-data-table :headers="headers" :items="desserts" :search="search">
        <template v-slot:item.note="props">
          <v-text-field
            v-model="props.item.note"
            name="no"
            outlined
            @input="getdata"
            type="text"
          ></v-text-field>
        </template>

        <template v-slot:item.Detail="{ item }">
          <v-text-field
            name="no"
            outlined
            @input="getdata"
            type="text"
          ></v-text-field>
        </template>

        <template v-slot:item.return="{ item }">
          <v-btn
            class="ma-2"
            color="warning"
            dark
            @click="handleBorrowResponse(item, 3, 1)"
          >
            Return
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
const url = "http://localhost:5000/api/Accept";
export default {
  middleware: ['auth-user', 'middle-user'],
  data() {
    return {
      dialog: false,
      search: "",
      headers: [
        {
          align: "left",
          sortable: false,
          value: "number"
        },

        { text: "User ID", value: "Staff_ID" },
        // { text: "User ID", value: "User_ID", width:"10%"},
        { text: "Invenroty Number", value: "inventory_number" },
        { text: "Date_start", value: "Date_start" },
        { text: "Date_End", value: "Date_End" },
        { text: "Detail", value: "Detail" },
        //{ text: "Status", value: "Status" },
        { text: "Return", value: "return" }
      ],
      desserts: []
    };
  },
  /*created() {
    this.initialize();
  },*/
  async asyncData({ $axios }) {
    const res = await $axios.get(url);
    return { desserts: res.data.response };
  },
  methods: {
    sendRequest(rowData) {
      console.log(rowData);
    },
    getdata() {
      console.log(this.desserts[0].Note);
    },
    /*async initialize() {
      const res = await this.$axios.get(url);
      this.desserts = res.data.response;
    },*/
    async handleBorrowResponse(item, status, status1) {
      if (!item || !status) return;

      try {
        const res = await this.$axios.post("/borrow_history/update", {
          newStatus: status,
          borrowId: item.borrow_id,
          updateItem: true
        });
        const res1 = await this.$axios.post(
          "/borrow_history/update_borrow_status_item",
          {
            inventoryNumber: item.inventory_number,
            newStatus: status1,
            updateItem: true
          }
        );

        if (res.status !== 200) throw new Error("status not 200");
        const itemsArr = await this.$axios.get("/item/2564");
        if (itemsArr.status !== 200) throw new Error("status not 200");
        this.$store.commit("asset/ADD_ITEMS", itemsArr.data.response);
        await this.$nuxt.refresh();
      } catch (err) {
        console.log("An error has occured:", err);
      }
    }
  }
};
</script>
