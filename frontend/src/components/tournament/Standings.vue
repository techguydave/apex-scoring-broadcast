<template>
    <v-container>
        <div class="overall-wrapper">

            <v-toolbar class="text-center">
                <div class="toolbar-link-container">
                    <router-link class="toolbar-link"
                        :to="{ name: 'tournament.standings.scoreboard', params: $props }">Scoreboard</router-link>
                    <router-link class="toolbar-link"
                        :to="{ name: 'tournament.standings.player', params: $props }">Player
                        Standings</router-link>
                    <router-link class="toolbar-link" :to="{ name: 'tournament.standings.team', params: $props }">Team
                        Standings</router-link>
                    <router-link class="toolbar-link"
                        :to="{ name: 'tournament.standings.feed', params: $props }">Feed</router-link>
                </div>
            </v-toolbar>

            <div class="leaderboard-wrap">
                <v-row no-gutters>
                    <v-col cols="12" sm="2">
                        <div class="game-select-wrap">
                            <div :class="{ 'selected-game': 'overall' == game }" class="game-select game py-4"
                                @click="setGame('overall')"> Overall</div>
                            <div v-for="g in gameList" :class="{ 'selected-game': g.game == game }"
                                class="game-select pa-2" @click="setGame(g.game)" :key="g.id">
                                <div class="game">Game {{ g.game }}</div>
                                <div class="map">{{ getMapNameShort(g.map_name) }}</div>
                                <div class="date sub">{{ getDate(g.match_start * 1000) }} {{
                                    getTime(g.match_start *
                                        1000)
                                }}</div>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="10">
                        <router-view :stats="stats"></router-view>
                    </v-col>
                </v-row>
            </div>
        </div>
    </v-container>
</template>

<script>
import { getMapNameShort } from '../../utils/statsUtils';

export default {
    props: ["organizer", "eventId", "game"],

    data() {
        return {
            stats: [],
            gameList: []
        }
    },
    methods: {
        getMapNameShort,
        async updateStats() {
            this.gameList = await this.$apex.getGameList(this.organizer, this.eventId);
            this.stats = await this.$apex.getStats(this.organizer, this.eventId, this.game);
        },
        setGame(game) {
            this.$router.replace({ params: { game, organizer: this.organizer, eventId: this.eventId } });
        },
        buildGameList(count) {
            return new Array(count + 1).fill({}).map((i, index) => index == 0 ? "overall" : index);
        },
        getDate(timestamp) {
            return Intl.DateTimeFormat(navigator.language, { month: 'short', day: 'numeric', year: "numeric" }).format(new Date(timestamp))
        },
        getTime(timestamp) {
            return Intl.DateTimeFormat(navigator.language, { hour: "numeric", minute: "numeric", hour12: true, timeZoneName: "short" }).format(new Date(timestamp));
        }
    },
    watch: {
        game() {
            this.updateStats();
        }
    },
    mounted() {
        if (!this.game) {
            this.setGame("overall");
        } else {
            this.updateStats();
        }
    }
}
</script>

<style scoped lang="scss">
.overall-wrapper {
    background: $third-tone;
    max-width: 1200px !important;
    margin: auto;
}

.date {
    text-transform: capitalize;
}

.map {
    font-size: .8em;
}

.sub {
    font-size: .6em;
    opacity: .7;
}

.game-select {
    background: $first-tone;
    color: white;
    text-align: center;
    padding: 3px;
    margin: 3px 7px;
    cursor: pointer;
}

.selected-game {
    background: $primary;
}

.leaderboard-wrap {
    padding: 30px;
    margin: auto;
}
</style>