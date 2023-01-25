<template>
    <div>
        <v-row class="header-row" no-gutters>
            <v-col sm="6"></v-col>
            <v-col sm="2" class="score">Score </v-col>
            <v-col sm="2" class="score">{{ stats.games ? 'Best Placement' : "Placement" }} </v-col>
            <v-col sm="2" class="score">Kills</v-col>
        </v-row>
        <div class="entry-wrapper" v-for="(team, index) in stats.teams" :key="team.id">
            <div class="entry-index">
                <div class="entry-index-text">{{ index + 1 }}</div>
            </div>

            <div class="leaderboard-container">
                <div class="entry-main">
                    <div class="entry-header">
                        <v-row class="entry-header-row">
                            <v-col sm="6">{{ team.name }}</v-col>
                            <v-col sm="2" class="score">{{ team.overall_stats.score }} </v-col>
                            <v-col sm="2" class="score">{{
                                team.overall_stats.bestPlacement ?
                                    team.overall_stats.bestPlacement : team.overall_stats.teamPlacement
                            }} </v-col>
                            <v-col sm="2" class="score">{{ team.overall_stats.kills }}</v-col>
                            <v-btn icon class="float-icon" @click="updateExpanded(team.name)"><v-icon>{{
                                expanded[team.name]
                                    ? 'mdi-menu-up' : 'mdi-menu-down'
                            }}</v-icon></v-btn>

                        </v-row>

                    </div>
                    <div v-if="expanded[team.name]" class="entry-players entry-sub">
                        <v-row no-gutters>
                            <v-col class="entry-player" v-for="player in team.player_stats" :key="player.id">
                                <template v-if="player.characters"><img class="team-character"
                                        v-for="character in player.characters" :key="character" height="18"
                                        :src="'/legend_icons/' + character + '.webp'"></template>
                                <img v-else class="team-character" height="20"
                                    :src="'/legend_icons/' + player.characterName + '.webp'">
                                &nbsp;{{ player.name }} ({{ player.kills }})
                            </v-col>
                        </v-row>
                    </div>
                    <!-- <div class="entry-expanded entry-sub">
                    <v-row>
                        <v-col>
                            <div>&nbsp;</div>
                            <div v-for="key in statsToShow" :key="key" class="text-right pr-5 text-capitalize">{{getDisplayName(key)}}</div>
                        </v-col>
                        <v-col v-for="player in team.player_stats" :key="player.id">
                            <div  class="table-header">{{player.name}}</div>
                            <div v-for="key in statsToShow" :key="key">{{player[key]}}&nbsp;</div>
                        </v-col>
                        <v-col>
                            <div>Team</div>
                            <div v-for="key in statsToShow" :key="key">{{team.overall_stats[key]}}&nbsp;</div>
                        </v-col>
                    </v-row>
                </div>-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { displayOptions, getDisplayName } from '@/utils/statsUtils';
export default {
    props: ["stats"],
    data() {
        return {
            statsToShow: displayOptions.display.player,
            expanded: {}
        }
    },
    methods: {
        getDisplayName,
        updateExpanded(index) {
            this.$set(this.expanded, index, !this.expanded[index]);
        }
    }
}
</script>

<style scoped lang="scss">
.entry-wrapper {
    display: flex;
    color: white;
    margin-bottom: 5px;
    // box-shadow: 0px 0px 10px #ffffff99;
    border-radius: 6px;
    overflow: hidden;
}

.entry-index {
    width: 40px;
    font-size: 1.2em;
    padding: 10px;
    text-align: center;
    background: #{$primary};
    color: $primary-invert;
    display: flex;
}

.entry-index-text {
    align-self: center;
    width: 100%;
}

.entry-header-row {
    padding-right: 25px;
}

.header-row {
    font-size: .7em;
    padding-left: 40px;
    padding-right: 25px;
    white-space: nowrap;
    text-align: center;
    margin-top: -16px;
    padding-bottom: 2px;
}

.entry-main {
    flex-grow: 1;
    background: $background-content;
}

.float-icon {
    position: absolute;
    right: 2px;
    top: 7px;
}

.entry-header {
    padding: 10px;
    font-size: 1.2em;
    position: relative;
}

.entry-sub {
    background: $second-tone;
    font-size: .8em;
}

.table-header {
    font-size: 1.2em;
}

.entry-player {
    display: flex;
}

.score {
    text-align: center;
}

.entry-players .col {
    border: 1px solid rgb(20, 10, 10);
    border-left: none;
    border-bottom: none;
    padding: 8px;
}

.leaderboard-container {
    flex-grow: 1;
}

.v-icon {
    font-size: .8em;
    padding: 2px;
    padding-bottom: 5px;
}
</style>