<template>
  <div>
    <v-app>
      <div>
        <nav-bar></nav-bar>
        <v-container>
          <v-row>
            <template v-if="!loggedIn">
              <v-col sm="12" lg="12">
                <v-card>
                  <v-card-title>Tournament Admin</v-card-title>
                  <v-card-text>
                    <v-text-field v-model="usernameForm" label="Username"
                      @v-on:keyup="loginFailed = false"></v-text-field>
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
              </v-col>
            </template>
            <template v-else>
              <v-col sm="12" lg="12">
                <v-card>
                  <v-card-title>Match:
                    <v-select class="ma-2" solo :items="matchList" v-model="eventId"></v-select>
                  </v-card-title>
                </v-card>
              </v-col>
              <v-col sm="12">
                <v-card>
                  <v-card-text>
                    <v-tabs v-model="tabs">
                      <v-tab>
                        Game Manager
                      </v-tab>
                      <v-tab>
                        Broadcast Settings
                      </v-tab>
                      <v-tab>
                        Public Settings
                      </v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="tabs">
                      <v-tab-item>
                        <game-tab :organizer="organizer" :eventId="eventId"></game-tab>
                      </v-tab-item>
                      <v-tab-item>
                        <broadcast-tab :organizer="organizer" :eventId="eventId"></broadcast-tab>
                      </v-tab-item>
                      <v-tab-item>
                        <public-tab :organizer="organizer" :eventId="eventId"></public-tab>
                      </v-tab-item>
                    </v-tabs-items>
                  </v-card-text>
                </v-card>
              </v-col>
            </template>
          </v-row>
        </v-container>
      </div>
    </v-app>
  </div>
</template>


<script>
import GameTab from "../views/admin/GameTab.vue"
import BroadcastTab from "../views/admin/BroadcastTab.vue"
import PublicTab from "../views/admin/PublicTab.vue"
import NavBar from "../components/NavBar.vue"
export default {
  components: {
    BroadcastTab,
    GameTab,
    PublicTab,
    NavBar,
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
<style scoped></style>