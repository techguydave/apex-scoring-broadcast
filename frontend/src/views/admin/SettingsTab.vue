<template>
    <v-container>

        <v-tabs v-model="tab">
            <v-tab>General</v-tab>
            <v-tab>Teams</v-tab>
            <v-tab>Drop Spots</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item>
                <v-row>
                    <v-col sm="12" lg="6">
                        <v-card class="ma-2">
                            <v-card-title>Settings</v-card-title>
                            <v-card-text>
                                <v-text-field v-model="publicData.title" label="Public Title"></v-text-field>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn @click="setPublicSettings" color="primary">Update</v-btn>
                            </v-card-actions>
                        </v-card>
                        <v-card class="ma-2">
                            <v-card-title>Public Link</v-card-title>
                            <v-card-text>
                                <v-form><v-text-field solo :value="publicUrl" readonly></v-text-field></v-form>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col sm="12" lg="6">

                        <v-card class="ma-2">
                            <v-card-title>Twitch Chat Intergration</v-card-title>
                            <v-card-text>
                                <v-text-field v-model="command" label="Command"></v-text-field>
                                <v-radio-group v-model="add">
                                    <v-radio key="add" value="add" :label="`Add new command ${command}`"></v-radio>
                                    <v-radio key="edit" value="edit"
                                        :label="`Update existing command ${command}`"></v-radio>
                                    <v-radio key="raw" value="raw" :label="`Raw command (Add via website)`"></v-radio>
                                </v-radio-group>

                                <template v-if="add != 'raw'">
                                    <v-text-field readonly label="Nightbot" :value="nightbotCommand"></v-text-field>
                                    <v-text-field readonly label="Stream Elements" :value="SECommand"></v-text-field>
                                </template>
                                <v-text-field v-else readonly label="Command" :value="rawCommand"></v-text-field>
                            </v-card-text>

                        </v-card>
                    </v-col>
                </v-row>
            </v-tab-item>
            <v-tab-item>
                <v-card>
                    <v-card-title>Team Managment</v-card-title>
                    <v-card-text>
                        <div v-for="team in teams" :key="team.teamId" class="team-wrap">
                            <div class="team-index">{{ team.teamId - 1 }}</div>
                            <div class="team-name"> <v-text-field v-model="team.name" dense></v-text-field></div>
                            <div class="team-name"> <v-btn @click="updateTeam(team)">Update</v-btn></div>
                        </div>
                        <v-btn @click="addTeam" color="seconday">Add Team</v-btn>
                        <v-btn @click="add20Teams" color="seconday">Add 20 Teams</v-btn>
                    </v-card-text>
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card>
                    <v-card-text>
                        <template >
                            <v-btn color="primary" @click="enableDropsDiag = true">Setup</v-btn>
                        </template>
                        <template v-if="publicData.drops">
                            <v-tabs v-model="dropTab">
                                <v-tab v-for="id in publicData.drops.maps" :key="id">{{ getMapNameShort(id) }}</v-tab>
                            </v-tabs>
                            <v-tabs-items v-model="dropTab">
                                <v-tab-item>
                                    <DropMap :map="id" :matchId="matchId" mode="admin"></DropMap>
                                </v-tab-item>
                            </v-tabs-items>
                        </template>
                    </v-card-text>
                </v-card>
                 <v-dialog v-model="enableDropsDiag" max-width="600px">
                    <v-card>
                      <v-toolbar color="primary" class="toolbar" flat>Enable Drop Spots<v-spacer></v-spacer><icon-btn-filled icon="close"
                          @click="enableDropsDiag = false"></icon-btn-filled></v-toolbar>
                          <v-card-title>Setup Drops</v-card-title>
                      <v-card-text>
                        <v-checkbox v-for="(id, name) in maps" :label="getMapName(id)" :key="name" v-model="selectedMaps[name]"  dense></v-checkbox>
                        <v-text-field v-model="pass" type="password"></v-text-field>
                        <v-btn color="primary" block class="my-3"
                          @click="enableDrops">Enable</v-btn>
                      </v-card-text>
                    </v-card>
                  </v-dialog>
            </v-tab-item>
        </v-tabs-items>



    </v-container>
</template>

<script>
import _ from "lodash";
import { getMapName, getMapNameShort } from "@/utils/statsUtils";
import IconBtnFilled from "@/components/IconBtnFilled";
import DropMap from "../../components/DropMap.vue";

const maps = {
    "worlds-edge": "mp_rr_desertlands_hu",
    "storm-point": "mp_rr_tropic_island_mu1",
    // "olympus": "mp_rr_olympus_mu2",
    // "broken-moon": "mp_rr_divided_moon",
    // "kings-canyon": "mp_rr_canyonlands_hu",
}

export default {
    props: ["eventId", "organizer", "matchId"],
    components: {
        IconBtnFilled,
        DropMap,
    },
    data() {
        return {
            publicData: {},
            publicUrl: undefined,
            command: "!now",
            add: "edit",
            tab: undefined,
            teams: [],
            enableDropsDiag: false,
            selectedMaps: {},
            dropTab: undefined,
            pass: "",
            maps,
        }
    },
    computed: {
        publicFullUrl() {
            return window.location.origin + this.$router.resolve({ name: 'tournament.standings', params: { eventId: this.eventId, organizer: this.organizer, game: "overall" } }).href;
        },
        summaryUrl() {
            return encodeURI(`${this.$apex.config.fullUrl}stats/${this.organizer}/${this.eventId}/summary`);
        },
        rawCommand() {
            return `$(urlfetch ${this.summaryUrl}) -- ${this.publicUrl}`;
        },
        SECommand() {
            return `!command ${this.add} ${this.command} ${this.rawCommand}`;
        },
        nightbotCommand() {
            return `!commands ${this.add} ${this.command} ${this.rawCommand}`;
        },
    },
    watch: {
        eventId() {
            this.refreshPublicOptions();
        }
    },
    methods: {
        getMapName,
        getMapNameShort,
        setPublicSettings() {
            this.$apex.setPublicSettings(this.matchId, this.publicData);
        },
        async refreshPublicOptions() {
            if (this.eventId) {
                let options = await this.$apex.getPublicSettings(this.matchId);
                let overall = await this.$apex.getStats(this.organizer, this.eventId, "overall");
                overall = overall.teams.map(t => ({ name: t.name, teamId: parseInt(t.teamId), matchId: this.matchId })).sort((a, b) => a.teamId - b.teamId);

                let teams = await this.$apex.getMatchTeams(this.matchId);
                teams = teams?.sort((a, b) => a.teamId - b.teamId);

                this.teams = _.merge(teams, overall);
                if (options) {
                    this.publicData = options;
                }
            }
        },
        async enableDrops() {
            let enabledMaps = {};
            Object.keys(this.selectedMaps).filter(key => this.selectedMaps[key]).forEach(key => enabledMaps[key] = maps[key]);
            this.publicData.drops = {
                pass: this.pass,
                maps: enabledMaps,
            }
            await this.setPublicSettings();
            this.enableDropsDiag = false;
        },
        async getShortLink() {
            let { hash } = await this.$apex.getShortLink(this.publicFullUrl);
            return `${window.location.origin}/${hash}`;
        },
        async add20Teams() {
            for (let i = 0; i < 20; i++) {
                await this.addTeam();
            }
        },
        async addTeam() {
            let team = {
                match: this.eventId,
                teamId: this.teams.length + 2, // team 1 is spectators, skip
                name: "Team " + (this.teams.length + 1),
            };
            this.teams.push(team);
            await this.updateTeam(team);
        },
        async updateTeam(team) {
            await this.$apex.setMatchTeam(this.matchId, team.teamId, team.name);
        }
    },
    async mounted() {
        this.publicUrl = this.publicFullUrl;
        await this.refreshPublicOptions();
        this.publicUrl = (await this.getShortLink()) || this.publicFullUrl;
    }
}
</script>
<style lang="scss" scoped>
.team-wrap {
    display: flex;
    height: 40px;
    margin: 5px;
}

.team-index {
    background: $primary;
    height: 40px;
    width: 40px;
    text-align: center;
    line-height: 40px;
    color: white;
    font-size: 1.3em;
}

.team-name {
    background: $second-tone;
    height: 40px;
    flex: 1;
    padding: 5px;
}


.toolbar.v-sheet.v-toolbar {
  background-color: $primary !important;
}

</style>