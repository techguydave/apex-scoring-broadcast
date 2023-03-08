<template>
  <div>
    <v-app>
      <div>
        <nav-bar></nav-bar>
        <div class="admin-wrap">
          <template v-if="!loggedIn">
            <v-card>
              <v-card-title>Tournament Admin</v-card-title>
              <v-card-text>
                <v-text-field v-model="usernameForm" label="Username" @v-on:keyup="loginFailed = false"></v-text-field>
                <v-text-field v-model="apiKeyForm" type="password" label="API Key"
                  @v-on:keyup="loginFailed = false"></v-text-field>

                <v-alert v-show="loginFailed" dense type="error">
                  Invalid API key
                </v-alert>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="login">Go</v-btn>
              </v-card-actions>
            </v-card>
          </template>
          <template v-else>
            <v-row>
              <v-col sm="2" cols="12">

                <!-- <IconBtnFilled icon="add"></IconBtnFilled> -->
                <h3>Match</h3>
                <v-select class="ma-2" outlined :items="matchList" v-model="eventId" dense append-outer-icon="mdi-plus"
                  hide-details @click:append-outer="newMatchId = ''; newMatchName = ''; newMatchDiag = true"></v-select>
                <admin-menu-item id="GameTab" v-model="selectedTab"> Game Manager</admin-menu-item>
                <admin-menu-item id="PublicTab" v-model="selectedTab">Settings</admin-menu-item>
                <h3>Broadcast</h3>
                <admin-menu-item id="BroadcastTab" v-model="selectedTab">Broadcast Control</admin-menu-item>
                <h3>Observers</h3>
                <admin-menu-item id="ObserverClientTab" v-model="selectedTab">Apex Clients</admin-menu-item>
              </v-col>
              <v-col sm="10" cols="12">
                <component :is="selectedTab" :organizer="organizer" :eventId="eventId"></component>
              </v-col>
            </v-row>
          </template>
        </div>
      </div>
      <v-dialog v-model="newMatchDiag" max-width="600px">
        <v-card>
          <v-toolbar class="toolbar" flat>Create new match<v-spacer></v-spacer><icon-btn-filled icon="close"
              @click="newMatchDiag = false"></icon-btn-filled></v-toolbar>
          <v-card-text>
            <v-text-field label="Match ID" v-model="newMatchId"></v-text-field>
            <v-btn @click="addRandom()">+ Random</v-btn><v-btn @click="addDate" class="mx-2">+ Date</v-btn>
            <v-text-field label="Display Name (optional)" v-model="newMatchName"></v-text-field>

            <v-btn color="primary" block :disabled="this.newMatchId.length == 0" @click="newMatch()">Add</v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-app>
  </div>
</template>


<script>
import GameTab from "../views/admin/GameTab.vue"
import BroadcastTab from "../views/admin/BroadcastTab.vue"
import PublicTab from "../views/admin/PublicTab.vue"
import ObserverClientTab from "../views/admin/ObserverClientTab.vue"
import NavBar from "../components/NavBar.vue"
import AdminMenuItem from "../components/AdminMenuItem.vue"
import IconBtnFilled from "../components/IconBtnFilled.vue"

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export default {
  components: {
    BroadcastTab,
    GameTab,
    PublicTab,
    ObserverClientTab,
    NavBar,
    AdminMenuItem,
    IconBtnFilled
  },
  data() {
    return {
      apiKeyForm: undefined,
      usernameForm: undefined,
      loginFailed: false,
      tabs: undefined,
      eventId: undefined,
      matchList: [],
      loggedIn: false,
      organizer: undefined,
      selectedTab: "GameTab",
      newMatchDiag: false,
      newMatchId: "",
      newMatchName: undefined,
    };
  },
  methods: {
    async login() {
      let valid = await this.$apex.login(this.usernameForm, this.apiKeyForm);

      console.log(valid)
      if (valid) {
        localStorage.setItem("organizer-key", this.apiKeyForm);
        localStorage.setItem("organizer-username", this.usernameForm);

        this.eventId = valid.selected_match;
        this.loggedIn = true;
        this.organizer = valid.username;

        this.matchList = await this.$apex.getMatchList(this.organizer);
      } else {
        this.loginFailed = true;
        setTimeout(() => this.loginFailed = false, 3000);
      }
    },
    generateRandomString() {
      let randomString = '';

      for (let i = 0; i < 8; i++) {
        randomString += characters[Math.floor(Math.random() * characters.length)];
      }

      return randomString;
    },
    addDate() {
      let date = new Date();
      this.newMatchId = this.append(this.newMatchId, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay() + 1} ${date.getHours()}:${date.getMinutes()}`)
    },
    addRandom() {
      this.newMatchId = this.append(this.newMatchId, this.generateRandomString());
    },
    append(str, text) {
      return str + (str.length > 0 ? "_" : "") + text;
    },
    newMatch() {

    }
  },
  watch: {
    eventId() {
      console.log("event", this.eventId)
      this.$apex.setSelectedMatch(this.organizer, this.eventId);
    }
  },
  async mounted() {
    this.apiKeyForm = localStorage.getItem("organizer-key");
    this.usernameForm = localStorage.getItem("organizer-username");

    if (this.apiKeyForm && this.usernameForm)
      await this.login();

  }
};
</script>
<style scoped lang="scss">
.admin-wrap {
  margin: 20px;
}

.toolbar.v-sheet.v-toolbar {
  background-color: $primary !important;
}
</style>