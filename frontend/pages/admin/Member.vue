<template>
  <v-container>
    <v-div>
      <h2>รายการสมาชิก</h2>
    </v-div>
    <br />
    <!--<v-container fluid>
        <v-row align="center">
            <h4>ปีการศึกษา 2564</h4>
        </v-row>
    </v-container> -->

    <div class="text-right">
      <v-btn
        color="blue-grey"
        class="ma-2 white--text"
        @click="ondialog('open')"
        >Upload
        <v-icon right dark>
          mdi-cloud-upload
        </v-icon>
      </v-btn>
      <v-dialog
        transition="dialog-bottom-transition"
        width="30%"
        v-model="dialog"
      >
        <template>
          <v-card>
            <v-toolbar color="#303F9F" dark
              >Choose File To Upload
              <v-spacer />
              <!-- <v-btn text @click="saveXLSX" color="white">Save</v-btn> -->
            </v-toolbar>

            <div class="pa-4">
              <!-- <v-btn color="#283593" dark class="ma-2" @click="dialog2 = !dialog2">
                            Import Student data
                        </v-btn> -->
              <v-file-input
                label="File"
                outlined
                dense
                @change="preview"
                type="file"
                ref="file"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              />
            </div>

            <v-card-actions class="justify-end">
              <v-btn text @click="saveXLSX" color="green">Save</v-btn>
              <v-btn text @click="ondialog('close')" color="#F44336"
                >Close</v-btn
              >
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </div>

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
        ></v-text-field>
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
      
      <template v-slot:item.status="{ item }">
        <v-switch v-model="resolve" inset dense color="red darken-3">
          <template #prepend>
            <p class="small"></p>
          </template>
        </v-switch>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import Axios from "axios";
import { create } from "domain";
const url = "http://localhost:5000/api/staff/";
import XLSX from "xlsx";
export default {
  data() {
    return {
      search: "",
      selected: [],
      headers: [
        {
          text: "ID",
          value: "Staff_ID"
        },
        {
          text: "Full Name",
          value: "FullName_THAI"
        },
        {
          text: "E-mail",
          value: "Email"
        },
        {
          text: "Position",
          value: "Position"
        },

        {
          text: "Status",
          value: "status"
        }
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
      const res = await Axios.get(url);
      this.users = res.data.response;
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
