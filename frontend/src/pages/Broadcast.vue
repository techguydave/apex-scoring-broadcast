<template>
    <div>
        <div class="scoreboard-wrap"
            :class="{ 'scoreboard-wrap-styled': displayOptions.styled, 'white-text': displayOptions.dark }">
            <div class="scoreboard-header-wrap">
                <div class="scoreboard-header" :class="{ 'scoreboard-header-styled': displayOptions.styled }">
                    <div v-if="displayOptions.styled" class="scoreboard-header-backing"></div>
                    <div class="scoreboard-header-text">{{ title }}</div>
                </div>
            </div>
            <score-table :showCharacters="displayOptions.showCharacters" :styled="displayOptions.styled"
                :mode="displayOptions.mode" :game="displayOptions.game" :display="displayOptions.display"
                :display2="displayOptions.display2" :dark="displayOptions.dark" :header="displayOptions.header"
                :stats="stats" />
        </div>
        <div id="credit1" class="credit" :class="{ dark: displayOptions.dark }"><span class="power">Powered by
            </span><br />overstat.gg</div>
        <!-- <div id="credit2" class="credit" :class="{ dark: displayOptions.dark }">Powered by overstat.gg</div> -->
</div>
</template>

<script>
import ScoreTable from "../views/broadcast/ScoreTable.vue"
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
            this.displayOptions = await this.$apex.getBroadcastSettings(this.organizer, this.eventId);

            if (this.displayOptions.game && this.displayOptions.mode && this.displayOptions.display) {
                this.stats = await this.$apex.getStats(this.organizer, this.eventId, this.displayOptions.game);
            }
        }

    },
    computed: {
        title() {
            if (this.displayOptions.header) {
                if (this.displayOptions.game == "overall") {
                    return "Leaderboard"
                } else {
                    return `Game ${this.displayOptions.game}`
                }
            } else {
                return " "
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
.scoreboard-wrap {
    position: absolute;
    width: 1920px;
    height: 1080px;
}

.scoreboard-wrap-styled {
    background: black;
}

.scoreboard-header-wrap {
    position: absolute;
    top: 50px;
    height: 150px;
    width: 100%;
}

.white-text {
    color: white;
}

.scoreboard-header {
    width: 40%;
    /* margin: auto; */
    font-family: "Heebo", sans-serif;
    font-size: 50px;
    line-height: 80px;
    text-align: center;
    position: relative;
}

.scoreboard-header-text {
    position: absolute;
    text-align: center;
    width: 100%;
}

.scoreboard-header-backing {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    border-top: 80px solid rgb(151, 11, 11);
    border-right: 40px solid transparent;
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