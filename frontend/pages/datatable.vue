<template>
  <v-col cols="12" md="12">
    <v-container>
      <v-div>
        <h2>รายการครุภัณฑ์ที่ขอยืม</h2>
      </v-div>
      <br />
      <v-card-title>
        List
      </v-card-title>
      <template>
        <v-data-table
          :headers="headers"
          :items="itemsInCart"
          class="elevation-1"
        >
          <template v-slot:header.="{ header }">
            {{ header.text.toUpperCase() }}
          </template>

          <template v-slot:item.no="props">
            {{ props.index + 1 }}
          </template>

          <template v-slot:item.Detail="props">
            <v-text-field
              v-model="textFields[props.index]"
              name="no"
              outlined
              type="text"
              hide-details
              dense
            ></v-text-field>
          </template>

          <template v-slot:item.Image="{ item }">
            <v-row justify="space-around">
              <v-col cols="auto">
                <v-dialog transition="dialog-bottom-transition" width="80%">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="mr-2" v-bind="attrs" v-on="on">
                      mdi-image-multiple-outline
                    </v-icon>
                  </template>
                  <template v-slot:default="dialog">
                    <v-card>
                      <v-toolbar color="primary" dark>Detail</v-toolbar>
                      <div class="text-h2 pa-12">
                        <img width="50%" :src="'image/asset/' + item.Image" />
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

          <template v-slot:item.start_date="{ item }">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Picker in menu"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(date)">
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </template>

          <template v-slot:item.end_date="{ item }">
            <v-menu
              ref="menu2"
              v-model="menu2"
              :close-on-content-click="false"
              :return-value.sync="date2"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date2"
                  label="Picker in menu"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date2" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu2 = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="$refs.menu2.save(date2)">
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </template>

          <template v-slot:item.delete="{ item, index }">
            <v-btn
              class="ma-2"
              color="red"
              dark
              @click="handleRemoveItem(item, index)"
            >
              <v-icon dark left> mdi-minus-circle </v-icon>Delete
            </v-btn>
          </template>
        </v-data-table>
        <br />
        <template>
          <div class="text-center">
            <v-btn color="success" @click="doSave">Request</v-btn>
          </div>
        </template>
      </template>
    </v-container>
  </v-col>
</template>

<script>
export default {
  middleware: ['auth-user', 'middle-user'],
  data() {
    return {
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      menu: false,
      date2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      menu2: false,
      items: [
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me 2" }
      ],
      headers: [
        {
          text: "No",
          align: "start",
          value: "no",
          width: "6%"
        },
        { text: "Inventory_Number", value: "Inventory_Number", width: "5%" },
        { text: "Image", value: "Image", width: "10%" },
        { text: "Name", value: "Asset_Description", width: "10%" },
        { text: "Start_date", value: "start_date", width: "10%" },
        { text: "End_date", value: "end_date", width: "10%" },
        { text: "Delete", value: "delete", width: "10%" },
        { text: "Note", value: "Detail", width: "10%" }
      ],
      textFields: []
    };
  },
  methods: {
    handleRemoveItem(item) {
      this.$store.commit("asset/REMOVE_CART", item);

      this.$store.commit("asset/UPDATE_ITEM_BORROW_STATUS", { item, data: 1 });
    },
    async doSave() {
      // this.$store.commit("asset/Request", item);
      const data = await this.transformItemsInCard(this.itemsInCart);
      // console.log(data);
      const res = await this.$axios.post("/borrow_history", {
        data
      });

      if (res.status === 200) {
        this.$store.commit("asset/CLEAR_CART");
        return;
      } else if (res.status === 302) {
        // Already borrowed sorry
      } else {
        throw new Error("Failed to submit");
      }
      this.$store.commit("asset/CLEAR_ITEMS");
      return;
    },
    async transformItemsInCard(items) {
      // console.log("items", items);
      const data = await JSON.parse(localStorage.getItem("userData"));
      return items.reduce(
        (r, c, i) => [
          ...r,
          {
            User_ID: data.Staff_ID,
            FullName_THAI: data.FullName_THAI,
            inventory_number: c.Inventory_Number,
            start_date: this.date,
            end_date: this.date2,
            Detail: !this.textFields[i] ? "" : this.textFields[i]
          }
        ],
        []
      );
    }
  },
  computed: {
    itemsInCart() {
      return this.$store.state.asset.cart;
    }
  }
};
</script>
