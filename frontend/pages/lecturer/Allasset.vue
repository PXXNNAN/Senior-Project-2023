<template>
  <v-container>
    <v-col cols="12" md="12"> </v-col>
    <v-card>
      <v-data-table :headers="headers" :items="itemlist" :search="search">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>รายการครุภัณฑ์ทั้งหมด</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <div class="text-left">
              <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                hide-details></v-text-field>
            </div>
          </v-toolbar>
        </template>

        <template v-slot:item.note="props">
          <v-text-field v-model="props.item.note" name="no" outlined @input="getdata" type="text"></v-text-field>
        </template>

        <template v-slot:item.Status="{ item }">
          <div v-if="item.Borrow_Status != 1" class="d-flex align-center">
            <v-badge bordered inline dot color="red"></v-badge>
            Unavailable
          </div>

          <div v-else class="d-flex align-center">
            <v-badge bordered inline dot color="success"></v-badge>
            Available
          </div>
        </template>

        <template v-slot:item.Image="{ item }">
          <v-row justify="space-around">
            <v-col cols="auto">
              <v-dialog transition="dialog-bottom-transition" width="80%">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" v-bind="attrs" v-on="on">Image</v-btn>
                </template>
                <template v-slot:default="dialog">
                  <v-card>
                    <v-toolbar color="primary" dark>Image</v-toolbar>
                    <div class="text-h2 pa-12">
                      <img width="10%" :src="'image/asset/' + item.Image" />
                    </div>
                    <v-card-actions class="justify-end">
                      <v-btn text @click="dialog.value = false">Close</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </v-col>
          </v-row>
        </template>

        <template v-slot:item.Add="{ item, index }">
          <v-btn class="ma-2" text icon color="success lighten-2" :disabled="item.Borrow_Status !== 1"
            @click="handleAddItem(item, index)">
            <v-icon color="success">mdi-plus-box</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
const url = "http://localhost:5000/api/item/2564";
export default {
  middleware: ['auth-user', 'middle-user'],
  data: () => ({
    search: "",
    notifications: false,
    sound: true,
    widgets: false,

    headers: [
      { text: "Year", value: "Year", width: "7%" },
      { text: "Inventory_Number", value: "Inventory_Number", width: "10%" },
      { text: "Asset_Description", value: "Asset_Description", width: "15%" },
      { text: "Model", value: "Model", width: "10%" },
      { text: "Location", value: "Location", width: "10%" },
      { text: "Room", value: "Room", width: "5%" },
      { text: "Status", value: "Status", width: "8%" },
      { text: "Image", value: "Image", width: "10%" },
      //{ text: "Image", value: "Image", align: "center" },
      { text: "Add", value: "Add", align: "center", width: "3%" }
    ],
    itemlist: [],
    editedIndex: -1,
    editedItem: {
      Year: "",
      Email_user: "",
      Email_assigner: "",
      Role: ""
    },
    defaultItem: {
      Year: "",
      Email_user: "",
      Email_assigner: "",
      Role: ""
    }
  }),

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      // If state exist don't call API
      let res, itemsArr;
      if (!this.$store.state.asset.items?.length > 0) {
        res = await this.$axios.get(url);

        itemsArr = res.data.response;
      } else {
        itemsArr = this.$store.state.asset.items;
      }

      this.itemlist = itemsArr;

      // Commit to state
      this.$store.commit("asset/ADD_ITEMS", itemsArr);
    },

    handleAddItem(item) {
      console.log("item:", item);
      this.$store.commit("asset/ADD_CART", item);
      // console.log("index add item", index);

      this.$store.commit("asset/UPDATE_ITEM_BORROW_STATUS", { item, data: 0 });
    }
  }
};
</script>