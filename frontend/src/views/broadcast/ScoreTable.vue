<template>
  <div class="overall-wrap" v-if="(stats && stats.teams)" :class="{ 'overall-wrap-styled': styled }">
    <div class="table-wrap">
      <div class="row-wrap">
        <div class="column" v-for="index in 2" :key="index">
          <div class="score-wrap table-header">
            <div class="score-item score-index">
              <div>&nbsp;#&nbsp;</div>
            </div>
            <div class="score-item score-name">
              <div>{{ mode == "team" ? "Team" : "Player" }}</div>
            </div>
            <div class="score-item score-value score-header">
              <template v-if="display2">&nbsp;{{ getDisplayName(display) }}&nbsp;</template>
            </div>
            <div class="score-item score-value score-header">
              &nbsp;{{ getDisplayName(display2 || display) }}&nbsp;
            </div>
          </div>
        </div>
        <div class="column" v-for="score in sortedScores" :key="score.name" sm="6">
          <div class="score-wrap">
            <div class="score-item score-index" :class="{ 'score-index-styled': styled }"> {{ score.index }} </div>
            <div v-if="mode == 'team'" class="score-item score-name" :class="{ 'score-name-styled': styled }">
              <div class="team-name-character-wrapper"
                :class="{ 'team-name-wrapper-override': score.name.length > 14 }">
                <div class="team-name" :class="{ 'team-name-override': score.name.length > 14 }"> {{ score.name }}
                </div>
                <template v-if="showCharacters">
                  <div class="character-wrap score-item" :class="{ 'character-wrap-styled': styled }"
                    v-if="mode == 'team'">
                    <img class="team-character" v-for="character in getCharacters(score.teamId)" :key="character"
                      height="26" :src="'/legend_icons/' + character + '.webp'">
                  </div>
                </template>
              </div>
              <div class="score-player-names" v-if="mode == 'team'">
                <span v-for="player in getPlayers(score.teamId)" :key="player.name">
                  {{ cleanPlayerName(score.name, player.name) }} &nbsp;</span>
              </div>
            </div>
            <div v-else class="score-item score-name score-player-name padding-zero"
              :class="{ 'score-name-styled': styled }">
              <span v-if="mode == 'player' && showCharacters" class="character-wrap-player score-item"
                :class="{ 'character-wrap-styled': styled }">
                <img v-for="character in score.characters || [score.characterName]" :key="character" height="70"
                  :src="'/legend_icons/' + character + '.webp'">
              </span>
              <span class="fix-player-name" :style="{ 'top': showCharacters ? '-25px' : '5px' }">{{ mode == 'player' ?
              score.name : cleanPlayerName(score.teamName, score.playerName) }}</span>
            </div>
            <div class="score-item score-value" :class="{ 'score-value-styled': styled }">
              <template v-if="display2">&nbsp;{{ score[display] }}&nbsp;</template>
            </div>
            <div class="score-item score-value" :class="{ 'score-value-styled': styled }">
              &nbsp;{{ score[display2 || display] }}&nbsp;
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { sortScores, getDisplayName, getStatsByMode, getCharactersByTeam, getPlayersByTeam } from "../../utils/statsUtils";

const pad_array = function (arr, len, fill) {
  return arr.concat(Array(len).fill(fill)).slice(0, len);
};

const defScore = {
  name: ""
}

export default {
  props: ["stats", "display", "display2", "styled", "mode", "showCharacters"],
  computed: {
    sortedScores() {
      let scores = sortScores(this.scoresByMode, this.display);

      scores = scores.length < 20 ? pad_array(scores, 20, defScore) : scores;

      scores.forEach((score, index) => {
        if (score.name || score.name) score.index = index + 1;
      });

      let start = scores.slice(0, 10);
      let end = scores.slice(10, 20);
      return _.zip(start, end).flat();
    },
    teams() {
      return this.stats.teams
    },
    scoresByMode() {
      return getStatsByMode(this.teams, this.mode)
    }
  },
  methods: {
    cleanPlayerName(team, player) {
      return player.replace(team + "_", "").replace(team, "").trim();
    },
    getDisplayName(display) {
      return getDisplayName(display);
    },
    getPlayers(team) {
      return getPlayersByTeam(this.teams, team);
    },
    getCharacters(team) {
      return getCharactersByTeam(this.teams, team);
    }
  },
};
</script>

<style scoped>
.overall-wrap {
  font-family: "Heebo", sans-serif;
  width: 100%;
}

.table-header .score-item {
  height: 23px;
  line-height: 20px;
  font-size: 18px;
  white-space: nowrap !important;
  overflow: visible;
}

.score-wrap.table-header {
  height: 25px;
}

.score-wrap {
  margin: auto;
  width: 680px;
  height: 83px;
}

.column {
  display: inline-block;
  width: 50%;
}

.score-item.character-wrap {
  display: inline-block;
  /* width: 24px; */
  height: 37px;
  margin: 0;
  padding: 0;
}

.score-item.character-wrap-player {
  display: inline-block;
  height: 70px;
  margin: 0;
  padding: 0;
}

.fix-player-name {
  position: relative;
  margin-left: 8px;
}

.team-name-character-wrapper {
  display: flex;
  height: 34px;
  margin-top: 2px;
}

.team-name {
  position: relative;
  top: -4px;
  margin-right: 4px;
}

.team-name-override {
  font-size: 22px;
  top: -2px;
}

.team-name-wrapper-override {
  margin-top: 3px;
}

.team-character {
  margin-left: 4px;
  /* display: inline-block; */
}

.character-wrap-styled {
  background: rgb(38, 31, 31);
}

.character-inline-block {
  display: inline-block;
  margin: 0 4px;
  height: 26px;
}

.character {
  height: 23px;
  margin: 4px 0;
  padding: 0;
  line-height: 24px;
  width: 23px;
}

.character-player {
  height: 70px;
  margin: 0;
  padding: 0;
  line-height: 70px;
  display: inline-block;
}

.score-item {
  display: inline-block;
  height: 70px;
  margin-bottom: 0px;
  padding: 5px;
  overflow: hidden;
  /* border: 1px solid black; */
}

.score-name.padding-zero {
  padding: 0;
  padding-left: 0;
}

.score-player-name {
  line-height: 62px;
}

.score-index {
  width: 55px;
  line-height: 65px;
  text-align: center;
}

.score-name {
  width: 417px;
  padding-left: 10px;
  font-size: 25px;
}

.score-index-styled {
  background-color: rgb(151, 11, 11);
}

.score-name-styled {
  background: rgb(38, 31, 31);
}

.score-value-styled {
  background: rgb(38, 31, 31);
}

.score-player-names {
  font-size: 17px;
  font-weight: 300;
}

.score-value {
  width: 100px;
  padding-right: 15px;
  line-height: 65px;
  text-align: right;
}

.score-header {
  text-transform: capitalize;
}

.table-wrap {
  position: relative;
  top: 200px;
  width: 1500px;
  height: 710px;
  margin: auto;
  /* background-color: rgba(255, 0, 0, .5); */
  font-size: 30px;
  font-weight: 400;
}

.row-wrap {
  height: 100%;
  width: 100%;
}
</style>
