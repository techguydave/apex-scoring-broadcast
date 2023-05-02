<template>
    <div>
        <div class="broadcast-page">
            <component v-for="overlay in scene.overlays" :is="overlay.type" :settings="overlay.settings" :stats="stats"
                :liveData="liveData" :key="overlay.id" :observer="observer" :observerTeam="observerTeam"
                :observerPlayer="observerPlayer" :display="displayOptions" />
            <div id="credit1" class="credit dark"><img width="150" src="/img/powered_by.png"></div>
            <!-- <div id="credit2" class="credit" :class="{ dark: displayOptions.dark }">Powered by overstat.gg</div> -->
        </div>
    </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import Scoreboard from "@/views/broadcast/Scoreboard.vue"
import LivedataTest from "../views/broadcast/LivedataTest.vue";
import LiveTeamStatus from "../views/broadcast/LiveTeamStatus.vue";
import LiveCharacterSelect from "../views/broadcast/LiveCharacterSelect.vue";
import LiveDamageReport from "../views/broadcast/LiveDamageReport.vue";
import Ticker from "../views/broadcast/Ticker.vue";

import { processWsData } from "@/utils/liveData";
export default {
    components: {
        Scoreboard,
        LivedataTest,
        LiveTeamStatus,
        LiveCharacterSelect,
        LiveDamageReport,
        Ticker,
    },
    props: ["organizer", "display"],
    data() {
        return {
            stats: [],
            liveData: {},
            interval: 0,
            ws: undefined,
            displayOptions: {},
            scene: {},
            eventId: undefined,
            apexClient: "",
            observerName: "",
        }
    },
    computed: {
        observerPlayer() {
            return this.observerTeam?.find(p => this.observer?.target?.nucleusHash == p.nucleusHash);
        },
        observer() {
            if (this.liveData.observers)
                return Object.values(this.liveData.observers).find(o => o.name == this.observerName);
            return undefined;
        },
        observerTeam() {
            console.log("obs", JSON.stringify(this.liveData?.observers))
            console.log("target", JSON.stringify(this.observer?.target));
            return this.liveData?.teams?.[this.observer?.target?.teamId]
        },
    },
    watch: {
        apexClient(old, n) {
            if (this.ws && old != n) {
                this.ws.close();
            }
        }
    },
    methods: {
        async updateScores() {
            let displays = await this.$apex.getBroadcastSettings(this.organizer, this.display);
            this.displayOptions = displays.find(d => d.id == this.display);
            this.scene = this.displayOptions.scenes.find(s => this.displayOptions.activeScene == s.id);

            if (this.displayOptions.selectedMatch?.length > 0) {
                this.eventId = this.displayOptions.selectedMatch;
            } else {
                let selected = await this.$apex.getSelectedMatch(this.organizer);
                this.eventId = selected.eventId;
            }

            const current = this.apexClient;

            if (this.displayOptions.selectedClient?.length > 0) {
                this.apexClient = this.displayOptions.selectedClient;
            }
            else {
                this.apexClient = await this.$apex.getOrganizerDefaultApexClient(this.organizer);
            }

            this.observerName = this.displayOptions.observerName;

            if (this.apexClient != current && this.ws) {
                this.ws.close();
                this.connectWs();
            }

            this.stats = await this.$apex.getStats(this.organizer, this.eventId, "overall");


        },
        async connectWs() {
            console.log("Connecting to ws ", this.organizer, this.apexClient);
            this.ws = this.$apex.getLiveDataWs(this.organizer, this.apexClient);
            processWsData(this.ws, (data) => {
                this.$set(this, 'liveData', data);
            });

            this.ws.addEventListener("close", () => setTimeout(() => this.connectWs(), 1000));
        }
    },
    async mounted() {
        await this.$nextTick();
        await this.updateScores();
        this.interval = setInterval(async () => {
            this.updateScores()
        }, 1000);

        this.connectWs();
    },
    destroyed() {
        clearInterval(this.interval);
    }
}
</script>

<style scoped lang="scss">
.broadcast-page {
    font-family: "Heebo", sans-serif;

    position: absolute;
    width: 1920px;
    height: 1080px;

}

.credit {
    position: absolute;

    font-size: 16px;
    text-align: center;
    color: white;
    opacity: .6;
    font-family: "heebo";
}

#credit1 {
    left: 1700px;
    text-align: center;
    top: 1028px;
}
</style>