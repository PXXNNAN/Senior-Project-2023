<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" clipped fixed app color="indigo lighten-5" width="auto">
      <v-list v-if="logstatus !== true">
        <v-list-item :to="items[0].to" router exact>
          <v-list-item-action>
            <v-icon>{{ items[0].icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="items[0].title" />
          </v-list-item-content>

          <v-list-item-icon>
            <v-badge color="red" v-if="items.basket && basketCount !== 0" :content="basketCount" inline>
            </v-badge>
          </v-list-item-icon>
        </v-list-item>
      </v-list>

      <!-- user list -->
      <v-list v-if="logstatusUser !== false">
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>

          <v-list-item-icon>
            <v-badge color="red" v-if="item.basket && basketCount !== 0" :content="basketCount" inline>
            </v-badge>
          </v-list-item-icon>
        </v-list-item>
      </v-list>

      <!-- admin list -->
      <v-list v-if="logstatusAdmin !== false">
        <!-- <h3>Admin</h3> -->
        <v-list-item v-for="(item, i) in adminItem" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>

          <v-list-item-icon>
            <v-badge color="red" v-if="item.basket && basketCount !== 0" :content="basketCount" inline>
            </v-badge>
          </v-list-item-icon>
        </v-list-item>
      </v-list>

      <!-- myWeb list -->
      <v-list v-if="logstatusWeb !== false">
        <!-- <h3>Staff</h3> -->
        <v-list-item v-for="(item, i) in myweb" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>

          <v-list-item-icon>
            <v-badge color="red" v-if="item.basket && basketCount !== 0" :content="basketCount" inline>
            </v-badge>
          </v-list-item-icon>
        </v-list-item>
      </v-list>

      <!-- lecturer list -->
      <v-list v-if="logstatusLecturer !== false">
        <!-- <h3>Lecturer</h3> -->
        <v-list-item v-for="(item, i) in lecturer" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>

          <v-list-item-icon>
            <v-badge color="red" v-if="item.basket && basketCount !== 0" :content="basketCount" inline>
            </v-badge>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar clipped-left fixed app color="indigo darken-4">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="indigo lighten-5" />
      <v-avatar>
        <img src="image/logo.png" alt="logo" />
      </v-avatar>
      <v-toolbar-title v-text="title" />
      <v-div class="text-lg-right white--text font-weight-light">
        ระบบยืม-คืนครุภัณฑ์ สำนักวิชาเทคโนโลยีสารสนเทศ
      </v-div>
      



      <v-spacer />

      <v-card-text class="hello" color="white" v-if="localUserData.data !== null">
        <h3 class="text-lg-right white--text font-weight-light">
          {{ localUserData.data.FullName_THAI }}
        </h3>
        <h4 class="text-lg-right white--text font-weight-light">
          <div v-if="localUserData.data.role_asset === 0">USER</div>
          <div v-if="localUserData.data.role_asset === 1">STAFF</div>
          <div v-if="localUserData.data.role_asset === 2">ADMIN</div>
          <div v-if="localUserData.data.role_asset === 3">LECTURER</div>
        </h4>
      </v-card-text>

      <div class="hello" v-if="logstatus === false">
        <v-btn rounded color="success" @click="socialGoogleLogin">
          <v-icon left>
            mdi-cloud-upload
          </v-icon>
          Google
        </v-btn>
      </div>

      <v-menu bottom left color="indigo lighten-4" v-if="logstatus === true">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" color="indigo lighten-5">
            <v-icon>mdi-dots-vertical </v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="(item, i) in dotitems" :key="i" :to="item.to">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logOutUser">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import * as firebase from "firebase/app";
import items from "./items.json";
import adminItem from "./adminItem.json";
import myweb from "./myweb.json";
import lecturer from "./lecturer.json";


const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default {
  name: "HomeviewShow",

  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      logstatus: false,
      logstatusWeb: false,
      logstatusAdmin: false,
      logstatusUser: false,
      logstatusLecturer: false,
      localUserData: { data: null },
      items: items,
      adminItem: adminItem,
      myweb: myweb,
      lecturer: lecturer,
      dotitems: [
        {
          icon: "mdi-account-circle",
          title: "Home",
          to: "/status"
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false
    };
  },
  mounted() {
    this.localUserData.data = JSON.parse(localStorage.getItem("userData"));
    if (this.localUserData.data !== null) {
      let role_asset = this.localUserData.data.role_asset;
      this.logstatus = true;
      if (role_asset === 3) {
        this.logstatusLecturer = true;
      } else if (role_asset === 2) {
        this.logstatusAdmin = true;
      } else if (role_asset === 1) {
        this.logstatusWeb = true;
      } else if (role_asset === 0) {
        this.logstatusUser = true;
      }
    }
  },
  methods: {
    socialGoogleLogin: function () {
      const provider = new GoogleAuthProvider();
      signInWithPopup(getAuth(), provider)
        .then(async result => {
          console.log(result.user); // Firebase Google
          const res = await this.$axios.post(
            "http://localhost:5000/api/login",
            {
              email: result.user.email,
              name: result.user.displayName
            }
          );
          if (res.status === 200) {
            console.log(res.data);
            console.log(res.data[0]);
            localStorage.setItem("userData", JSON.stringify(res.data[0]));
            this.localUserData.data = res.data[0];
            this.logstatus = true;
            if (res.data[0].role_asset === 3) {
              //lecturer = 3
              this.logstatusLecturer = true;
            } else if (res.data[0].role_asset === 2) {
              //admin = 2
              this.logstatusAdmin = true;
            } else if (res.data[0].role_asset === 1) {
              //staff = 1
              this.logstatusWeb = true;
            } else if (res.data[0].role_asset === 0) {
              //user = 0
              this.logstatusUser = true;
            }
            this.$router.push({
              path: "/"
            });
          } else {
            console.error("Error, not a member");
          }
        })
        .catch(error => {
          alert(error.message);
        });
    },
    logOutUser: async function () {
      try {
        const res = await this.$axios.post("http://localhost:5000/api/logout");
        if (res.status === 200) {
          localStorage.removeItem("userData");
          this.localUserData.data = null;
          this.logstatusLecturer = false;
          this.logstatusAdmin = false;
          this.logstatusWeb = false;
          this.logstatusUser = false;
          this.logstatus = false;
        }
        this.$router.push({
          path: "/"
        });

        console.log("logOut Success!!");
      } catch (error) {
        console.log(error);
      }
    }
  },
  computed: {
    basketCount() {
      const cartCount = this.$store.state.asset.cart?.length;
      return cartCount !== 0 ? cartCount : 0;
    }
  }
};
</script>
