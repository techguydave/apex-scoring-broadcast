<template>
    <div>
        <score-table :settings="displayOptions" :stats="stats" />
        <div id="credit1" class="credit" :class="{ dark: displayOptions.dark }"><span class="power">Powered by
            </span><br />overstat.gg</div>
        <!-- <div id="credit2" class="credit" :class="{ dark: displayOptions.dark }">Powered by overstat.gg</div> -->
</div>
</template>

<script>
import ScoreTable from "@/views/broadcast/Scoreboard.vue"
export default {
    components: {
        ScoreTable,
    },
    props: ["organizer", "eventId"],
    data() {
        return {
            stats: [],
            interval: 0,
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
    },
    destroyed() {
        clearInterval(this.interval);
    }
}
</script>

<style scoped lang="scss">
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