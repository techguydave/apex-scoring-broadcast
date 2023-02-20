<template>
    <div class="broadcast-page">
        <component :is="'LivedataTest'" :settings="displayOptions" :stats="stats" :liveData="liveData" />
        <div id="credit1" class="credit" :class="{ dark: displayOptions.dark }"><span class="power">Powered by
            </span><br />overstat.gg</div>
        <!-- <div id="credit2" class="credit" :class="{ dark: displayOptions.dark }">Powered by overstat.gg</div> -->
    </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import Scoreboard from "@/views/broadcast/Scoreboard.vue"
import LivedataTest from "../views/broadcast/LivedataTest.vue";
import TeamStatus from "../views/broadcast/TeamStatus.vue";
import { processWsData } from "@/utils/liveData";
export default {
    components: {
        Scoreboard,
        LivedataTest,
        TeamStatus
    },
    props: ["organizer", "eventId"],
    data() {
        return {
            stats: [],
            liveData: {},
            interval: 0,
            ws: undefined,
            displayOptions: {}
        }
    },

    methods: {
        async updateScores() {
            this.displayOptions = await this.$apex.getBroadcastSettings(this.organizer);

            if (this.displayOptions.game && this.displayOptions.mode && this.displayOptions.display) {
                this.stats = await this.$apex.getStats(this.organizer, this.eventId, this.displayOptions.game);
            }
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