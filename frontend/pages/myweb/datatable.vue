<template>
  <v-container>
    <v-div>
      <h2>รายการครุภัณฑ์ที่ขอยืม</h2>
    </v-div>
    <br />
    <v-card-title>
      List
    </v-card-title>
    <template>
      <v-data-table :headers="headers" :items="itemsInCart" class="elevation-1">
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
</template>

<script>
export default {
  middleware: ['auth-user', 'middle-user'],
  data() {
    return {
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
      const data = this.transformItemsInCard(this.itemsInCart);
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
    transformItemsInCard(items) {
      // console.log("items", items);
      return items.reduce(
        (r, c, i) => [
          ...r,
          {
            User_ID: "46360076",
            inventory_number: c.Inventory_Number,
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
