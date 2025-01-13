<template>
  <v-container>
    <v-div>
      <h2>รายการครุภัณฑ์ที่ดูแล</h2>
    </v-div>
    <br />
    <v-container fluid>
      <v-row align="center">
        <v-col class="d-flex" cols="8" sm="3"
          ><v-select :items="items" label="building" dense outlined></v-select>
        </v-col>

        <v-col class="d-flex" cols="8" sm="3"
          ><v-select :items="items1" label="room" dense outlined></v-select>
        </v-col>

        <v-col class="d-flex" cols="8" sm="2"> </v-col>
        <v-col class="d-flex" cols="8" sm="2"> </v-col>

        <!-- <v-col class="d-flex" cols="8" sm="2"
          ><v-btn
            :loading="loading3"
            :disabled="loading3"
            color="blue-grey"
            class="ma-2 white--text"
            @click="loader = 'loading3'"
          >
            Upload
            <v-icon right dark>
              mdi-cloud-upload
            </v-icon>
          </v-btn>
        </v-col> -->
      </v-row>
    </v-container>
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
      <!-- 57 :single-select="singleSelect"-->
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="desserts"
        :items-per-page="10"
        :search="search"
        item-key="no"
      >
        <!-- -->
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
        </template>

        <template v-slot:item.Reject="{ item }">
          <v-btn
            class="ma-2 white--text"
            color="red"
            :disabled="item.Borrow_Status !== 1"
            @click="Disable(item)"
          >
            DisABLE
          </v-btn>
        </template>

        <template v-slot:item.Accept="{ item }">
          <v-btn
            class="ma-2 white--text"
            color="success"
            :disabled="item.Borrow_Status !== 6"
            @click="Enable(item)"
          >
            ENABLE
          </v-btn>
        </template>

        <template v-slot:item.number_date="{ item }">
          5
        </template>

        <template v-slot:item.Status="{ item }">
          <div v-if="item.Borrow_Status === 0" class="d-flex align-center">
            <v-badge bordered inline dot color="blue"></v-badge>
            Borrow
          </div>

          <div v-else-if="item.Borrow_Status === 1" class="d-flex align-center">
            <v-badge bordered inline dot color="success"></v-badge>
            Enable
          </div>

          <div v-else class="d-flex align-center">
            <v-badge bordered inline dot color="red"></v-badge>
            Disable
          </div>
        </template>

        <template v-slot:item.note="props">
          <!-- 129 @input="getdata" -->
          <v-text-field
            v-model="props.item.note"
            name="no"
            outlined
            type="text"
          ></v-text-field>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      loader: null,
      loading: false
    };
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 3000);

      this.loader = null;
    }
  }
};
</script>

<script>
const url = "http://localhost:5000/api/item/2564";
export default {
  middleware: ['auth-user', 'middle-user'],
  data() {
    return {
      items: ["S7A", "C3", "E3", "S1"],
      items1: ["301", "302", "303", "304"],
      search: "",
      selected: [],
      headers: [
        { text: "Year", value: "Year", width: "7%" },
        { text: "Inventory_Number", value: "Inventory_Number", width: "10%" },
        { text: "Asset_Description", value: "Asset_Description", width: "15%" },
        { text: "Disable", value: "Reject", sortable: false, width: "12%" },
        { text: "Enable", value: "Accept", sortable: false, width: "12%" },
        /*{ text: "Status", value: "status", width: "7%" },*/
        { text: "Number_date", value: "number_date", width: "15%" },
        { text: "Status", value: "Status", width: "15%" },
        { text: "Building", value: "Location", width: "10%" },
        { text: "Room", value: "Room", width: "5%" }
        /*{ text: "Note", value: "note", width: "10%" }*/
        /*{ text: "Actions", value: "actions", sortable: false, width: "5%" }*/
      ],
      desserts: [
        /*{
          code: 159,
          image: "",
          name: "computer",
          status: "ว่าง",
          number_date: "",
          Note: ""
        }*/
      ],
      watch: {
        dialog(val) {
          val || this.close();
        },
        dialogDelete(val) {
          val || this.closeDelete();
        }
      }
    };
  },
  async asyncData({ $axios }) {
    const data = await JSON.parse(localStorage.getItem("userData"));
    const res = await $axios.get('http://localhost:5000/api/item/filter',{ params: { year: 2564 , id: data.Staff_ID} });
    return { desserts: res.data.response };
  },

  methods: {
    async Enable(item) {
      const url = "http://localhost:5000/api/item/Enablestatus";
      const Enableurl = url + "/" + item.Inventory_Number;
      try {
        const res = await this.$axios.post(Enableurl);
      } catch (e) {
        console.log(e);
      }
      await this.$nuxt.refresh();
    },

    async Disable(item) {
      const url2 = "http://localhost:5000/api/item/Disablestatus";
      const delurl = url2 + "/" + item.Inventory_Number;
      try {
        const res = await this.$axios.post(delurl);
      } catch (e) {
        console.log(e);
      }
      await this.$nuxt.refresh();
    },

    async handleBorrowResponse(item, status) {
      if (!item || !status) return;

      try {
        const res = await this.$axios.post("/item/update_borrow_status_item", {
          inventoryNumber: item.inventory_number,
          newStatus: status,
          updateItem: true
        });

        if (res.status !== 200) throw new Error("status not 200");
        const itemsArr = await this.$axios.get("/item/2564");
        if (itemsArr.status !== 200) throw new Error("status not 200");
        await this.$nuxt.refresh();
      } catch (err) {
        console.log("An error has occured:", err);
      }
    }
  }
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
