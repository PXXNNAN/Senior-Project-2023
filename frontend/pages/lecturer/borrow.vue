<template>
    <v-container>
      <v-div>
        <h2>คำขอยืมครุภัณฑ์</h2>
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
  
        <v-data-table :headers="headers" :items="borrowData" :search="search">
          <template v-slot:items="props">
            <td>{{ props.item.no }}</td>
            <td class="text-xs-right">{{ props.item.borrow_id }}</td>
            <td class="text-xs-right">{{ props.item.Staff_ID }}</td>
            <td class="text-xs-right">{{ props.item.User_ID }}</td>
            <td class="text-xs-right">{{ props.item.inventory_number }}</td>
            <td class="text-xs-right">{{ props.item.Date_start }}</td>
            <td class="text-xs-right">{{ props.item.Date_End }}</td>
            <td class="text-xs-right">{{ props.item.Detail }}</td>
          </template>
          <template v-slot:no-results>
            <v-alert :value="true" color="error" icon="Warning">
              Your Search For "{{ search }}" Found No Results.
            </v-alert>
          </template>
  
          <template v-slot:item.Reject="{ item }">
            <v-row justify="center">
              <v-dialog v-model="dialog" persistent max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="ma-2 white--text"
                    color="red"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Reject
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">Do you want to Reject</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field label="Note" required></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="ma-2" color="red" dark @click="dialog = false">
                      Cancle
                      <v-icon dark right>
                        mdi-cancel
                      </v-icon>
                    </v-btn>
                    <v-btn
                      class="ma-2"
                      color="primary"
                      dark
                      @click="handleBorrowResponse(item, 2, 1), (dialog = false)"
                    >
                      Confirm
                      <v-icon dark right>
                        mdi-checkbox-marked-circle
                      </v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
          </template>
  
          <template v-slot:item.Accept="{ item }">
            <v-btn
              class="ma-2 white--text"
              color="success"
              :disabled="item.Status !== 0"
              @click="handleBorrowResponse(item, 1)"
            >
              Accept
            </v-btn>
          </template>
  <!--
          <template v-slot:item.Delivered="{ item }">
            <v-btn
              class="ma-2 white--text"
              color="indigo accent-2"
              :disabled="item.Status !== 1"
              @click="handleBorrowResponse(item, 4)"
            >
              Delivered
            </v-btn>
          </template> -->
        </v-data-table>
      </v-card>
    </v-container>
  </template>
  
  <script>
  const url = "http://localhost:5000/api/borrow_history";
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
          { text: "User ID", value: "Staff_ID", width: "15%" },
          { text: "Invenroty Number", value: "inventory_number", width: "20%" },
          { text: "Date_start", value: "Date_start", width: "15%" },
          { text: "Date_End", value: "Date_End", width: "15%" },
          { text: "Detail", value: "Detail", width: "10%" },
          { text: "Reject", value: "Reject", sortable: false, width: "15%" },
          { text: "Accept", value: "Accept", sortable: false, width: "15%" },
          //{ text: "Delivered", value: "Delivered", sortable: false, width: "12%" }
  
          //{ text: "Delivered", value: "Delivered" }
        ],
        desserts: []
      };
    },
    async asyncData({ $axios }) {
      const data = await JSON.parse(localStorage.getItem("userData"));
      const res = await $axios.get(url, { params: { id: data.Staff_ID, location: data.Building, room: data.Room }});
      return { borrowData: res.data.response };
    },
    methods: {
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
  