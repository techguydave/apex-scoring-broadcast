<template>
    <div>
        <div class="broadcast-page">
            <component v-for="overlay in scene.overlays" :is="overlay.type" :settings="overlay.settings" :stats="stats"
                :liveData="liveData" :key="overlay.id" />
            <div id="credit1" class="credit dark"><span class="power">Powered by
                </span><br />overstat.gg</div>
            <!-- <div id="credit2" class="credit" :class="{ dark: displayOptions.dark }">Powered by overstat.gg</div> -->
        </div>
    </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import TeamScoreboard from "@/views/broadcast/TeamScoreboard.vue"
import LivedataTest from "../views/broadcast/LivedataTest.vue";
import LiveTeamStatus from "../views/broadcast/LiveTeamStatus.vue";
import LiveCharacterSelect from "../views/broadcast/LiveCharacterSelect.vue";
import { processWsData } from "@/utils/liveData";
export default {
    components: {
        TeamScoreboard,
        LivedataTest,
        LiveTeamStatus,
        LiveCharacterSelect,
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
        }
    },

    methods: {
        async updateScores() {
            console.log(this.display)
            let displays = await this.$apex.getBroadcastSettings(this.organizer, this.display);
            this.displayOptions = displays.find(d => d.id == this.display);
            this.scene = this.displayOptions.scenes.find(s => this.displayOptions.activeScene == s.id);
            this.eventId = await this.$apex.getSelectedMatch(this.organizer);
            this.stats = await this.$apex.getStats(this.organizer, this.eventId, "overall");
        }

    },
    async mounted() {
        await this.$nextTick();
        this.updateScores();
        this.interval = setInterval(async () => {
            this.updateScores()
        }, 3000);

        this.ws = this.$apex.getLiveDataWs(this.organizer);
        console.log(this.ws);
        processWsData(this.ws, (data) => {
            this.$set(this, 'liveData', data);
        });
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

    .dark {
        color: black;
    }

    .power {
        font-weight: bold;
    }
}

#credit1 {
    left: 1750px;
    text-align: center;
    top: 1020px;
}
</style>