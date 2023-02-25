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
                <v-select class="ma-2" solo :items="matchList" v-model="eventId"></v-select>
                <h3>Match</h3>
                <admin-menu-item id="GameTab" v-model="selectedTab"> Game Manager</admin-menu-item>
                <admin-menu-item id="PublicTab" v-model="selectedTab"> Public Settings </admin-menu-item>
                <h3>Broadcast</h3>
                <admin-menu-item id="BroadcastTab" v-model="selectedTab">Broadcast Settings </admin-menu-item>
              </v-col>
              <v-col sm="10" cols="12">


                <component :is="selectedTab" :organizer="organizer" :eventId="eventId"></component>


              </v-col>
            </v-row>
          </template>
        </div>
      </div>
    </v-app>
  </div>
</template>


<script>
import GameTab from "../views/admin/GameTab.vue"
import BroadcastTab from "../views/admin/BroadcastTab.vue"
import PublicTab from "../views/admin/PublicTab.vue"
import NavBar from "../components/NavBar.vue"
import AdminMenuItem from "../components/AdminMenuItem.vue"
export default {
  components: {
    BroadcastTab,
    GameTab,
    PublicTab,
    NavBar,
    AdminMenuItem,
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
</style>