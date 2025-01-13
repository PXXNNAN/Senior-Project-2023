<template>
  <v-container>
    <v-div>
      <h2>ผู้รับผิดชอบห้อง</h2>
    </v-div>
    <br />
    <!--<v-container fluid>
            <v-row align="center">
                <h4>ปีการศึกษา 2564</h4>
            </v-row>
        </v-container> -->

    <div class="text-right">
      <v-btn color="green" class="ma-2 white--text" @click="ondialog('open')"
        >Add
        <v-icon right dark> mdi-plus </v-icon>
      </v-btn>
      <v-dialog
        transition="dialog-bottom-transition"
        width="70%"
        v-model="dialog"
      >
        <template>
          <v-card>
            <v-toolbar color="#303F9F" dark
              >Add
              <v-spacer />
            </v-toolbar>

            <div class="d-flex" cols="12" sm="4">
              <v-col class="d-flex" cols="8" sm="3">
                <v-select
                  v-model="addItem.names"
                  :items="items.names"
                  menu-props="auto"
                  single-line
                  label="Name"
                  dense
                  outlined
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="8" sm="3">
                <v-select
                  v-model="addItem.builds"
                  :items="items.builds"
                  menu-props="auto"
                  single-line
                  label="building"
                  dense
                  outlined
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="8" sm="3">
                <v-select
                  v-model="addItem.rooms"
                  :items="items.rooms"
                  menu-props="auto"
                  single-line
                  label="room"
                  dense
                  outlined
                  :disabled="building == ''"
                ></v-select>
              </v-col>
            </div>
            <v-card-actions class="justify-end">
              <v-btn text @click="saveData" color="green">Save</v-btn>
              <v-btn text @click="ondialog('close')" color="#F44336"
                >Close</v-btn
              >
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </div>
    <template v-slot:item.Edit>
      <v-row justify="space-around">
        <v-col cols="auto">
          <v-dialog transition="dialog-bottom-transition" width="80%">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" v-bind="attrs" v-on="on">Edit</v-btn>
            </template>
          </v-dialog>
        </v-col>
      </v-row>
    </template>

    <v-card-title>
      <!--List -->
      <v-spacer></v-spacer>
      <div class="text-right">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        >
        </v-text-field>
      </div>
    </v-card-title>

    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="users"
      :items-per-page="10"
      :search="search"
      class="elevation-2"
    >
      <template v-slot:item.role_asset="{ item }">
        <div v-if="item.role_asset === 0">
          USER
        </div>
        <div v-if="item.role_asset === 1">
          STAFF
        </div>
        <div v-if="item.role_asset === 2">
          ADMIN
        </div>
      </template>

      <template v-slot:item.Edit="{ item }">
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import Axios from "axios";
import { create } from "domain";
const url = "http://localhost:5000/api/staff/";
const url_item = "http://localhost:5000/api/item/";
const url_role_3 = "http://localhost:5000/api/role_3/";
import XLSX from "xlsx";
export default {
  data() {
    return {
      search: "",
      selected: [],
      items: {
        names: [],
        builds: [],
        rooms: []
      },
      addItem: {
        names: "",
        builds: "",
        rooms: ""
      },
      headers: [
        { text: "ID", value: "Staff_ID" },
        { text: "Full Name", value: "FullName_THAI" },
        { text: "Building", value: "Building" },
        { text: "ROOM", value: "Room" },
        //{ text: "Role", value: "role_asset"},
        { text: "Delete", value: "Edit", sortable: false }
      ],
      users: [],
      resXLSX: {},
      dialog: false
    };
  },
  async created() {
    await this.initialize();
  },
  methods: {
    async initialize() {
      const res = await Axios.get(url_role_3);
      this.users = res.data.response;

      const res2 = await Axios.get(url_item);
      this.item = res2.data.response;

      const res3 = await Axios.get(url);
      this.staff = res3.data.response;

      let name = [];
      this.staff.forEach(el => {
        el.FullName_THAI != null ? name.push(el.FullName_THAI) : "";
      });
      this.items.names = [...new Set(name)];
      console.log(name)

      let build = [];
      this.item.forEach(el => {
        el.Location != null ? build.push(el.Location) : "";
      });
      this.items.builds = [...new Set(build)];
      console.log(build)

      let room = [];
      this.item.forEach(el => {
        el.Room != null ? room.push(el.Room) : "";
      });
      this.items.rooms = [...new Set(room)];
      console.log(room)
    },

    async onfilter(type) {
      if (type == "build") {
        let room = [];
        this.item.forEach(el => {
          if (el.Location == this.building) {
            el.Room != null ? room.push(el.Room) : "";
          }
        });
        this.items.rooms = [...new Set(room)];
        const filbuild = this.item.filter(el => el.Location == this.building);
        this.item = filbuild;
      } else if (type == "room") {
        const filroom = this.item.filter(el => el.Room == this.room);
        this.item = filroom;
      }
    },

    ondialog(action) {
      if (action == "close") {
        this.dialog = false;
      } else {
        this.dialog = true;
      }
    },
    preview(file) {
      if (file) {
        var reader = new FileReader();
        // var index = new Number();
        reader.onload = () => {
          var data = reader.result;
          // อ่านข้อมูลในไฟล์
          var work = XLSX.read(data, {
            type: "array"
          });
          // อ่านชีทแรก [0]
          let sheetName = work.SheetNames[0];
          let workSheet = work.Sheets[sheetName];
          // แปลง ชีท เป็น json
          let dataXLSX = XLSX.utils.sheet_to_json(workSheet);
          this.resXLSX = dataXLSX;
          console.log(this.resXLSX);
          // console.log(this.resXLSX[index]);
        };
        reader.readAsArrayBuffer(file);
        file = [];
      }
    },
    async save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },
    refreshPage() {
      location.reload();
    },
    async saveData() {
      console.log("something");
      await this.$axios.post(
        "http://localhost:5000/api/staff/update",
        { 
          Building: this.addItem.builds, 
          Room: this.addItem.rooms,
          FullName_THAI:  this.addItem.names, 
        }
      );
      this.refreshPage()
    },
    async deleteItem(items) {
      await this.$axios.post(
        "http://localhost:5000/api/staff/update",
        { 
          Building: "", 
          Room: "",
          FullName_THAI:  items.FullName_THAI, 
        }
      );
      this.refreshPage()
    }
  }
};
</script>

<style>
v-input.v-input--switch--inset .v-input--switch__track:after {
  content: "On";
  color: #000000;
  font-size: 13px;
}

.v-input.v-input--switch--inset.v-input--is-label-active.v-input--is-dirty
  .v-input--switch__track:after {
  content: "Off";
  color: #ffffff;
  font-size: 13px;
}

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
