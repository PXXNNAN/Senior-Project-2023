<template>
  <v-container>
    <v-div>
      <h2>รายการครุภัณฑ์ทั้งหมด</h2>
    </v-div>
    <br />
    <v-container fluid>
      <v-row align="center">
        <h4>เลือกตึก</h4>
        <v-col class="d-flex" cols="8" sm="3">
          <v-select v-model="building" :items="items.builds" menu-props="auto" single-line label="building" dense
            outlined @change="onfilter('build')"></v-select>
        </v-col>
        <h4>เลือกห้อง</h4>
        <v-col class="d-flex" cols="8" sm="3">
          <v-select v-model="room" :items="items.rooms" menu-props="auto" single-line label="room" dense outlined
            :disabled="building == ''" @change="onfilter('room')"></v-select>
        </v-col>
      </v-row>
    </v-container>

    <v-card-title>
      <!--List -->
      <v-spacer></v-spacer>
      <div class="text-right">
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
      </div>
    </v-card-title>

    <v-data-table v-model="selected" :headers="headers" :items="item" :items-per-page="10" :search="search"
      class="elevation-1">
      <template v-slot:item.Status="{ item }">
        <div v-if="!item.Status || !item.Borrow_Status" class="d-flex align-center">
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
    </v-data-table>
  </v-container>
</template>

<script>
import Axios from "axios";
import { create } from "domain";
const url = "http://localhost:5000/api/item/";
import XLSX from "xlsx";
export default {
  data() {
    return {
      building: "",
      room: "",
      search: "",
      selected: [],
      notifications: false,
      sound: true,
      widgets: false,
      //items: ["AV","AS","C1","E1","E2","E3-A","E3-B","F2","S1","S3", "S7-A", "S7-B"],
      //items1: ["201","211","213","303","304","320","322","306","310","314","315","318"],
      items: {
        builds: [],
        rooms: []
      },
      headers: [
        {
          text: "Invenroty Number",
          value: "Inventory_Number"
        },
        {
          text: "Asset Description",
          value: "Asset_Description"
        },
        {
          text: "Status",
          value: "Status"
        },
        {
          text: "Image",
          value: "Image"
        }
      ],

      item: [],
      resXLSX: {},
      dialog: false
    };
  },
  async created() {
    await this.initialize();
  },
  methods: {
    async initialize() {
      const res = await Axios.get(url + "2564");
      this.item = res.data.response;

      let build = [];
      this.item.forEach(el => {
        el.Location != null ? build.push(el.Location) : "";
      });
      this.items.builds = [...new Set(build)];
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
    async saveXLSX() {
      await Axios.post(url, {
        xlsx: this.resXLSX
      })
        .then(res => {
          this.dialog = false;
          this.initialize();
        })
        .catch(err => {
          alert("data error");
          this.dialog = false;
        });
    }
  }
};
</script>

<style scoped>
v-input.v-input--switch--inset .v-input--switch__track:after {
  content: "On";
  color: #000000;
  font-size: 13px;
}

.v-input.v-input--switch--inset.v-input--is-label-active.v-input--is-dirty .v-input--switch__track:after {
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
