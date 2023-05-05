<template>
    <div class="wrap" :class="{ styled: settings.styled }"
        :style="{ transform: `translate(${settings.hidePlayers ? '1632px' : '1500px'}, 300px)` }">
        <div class="team-wrap" :class="{ dark: settings.dark }">
            <div class="index ">
                <IconSpan icon="tag" font-size="18px"></IconSpan>
            </div>
            <div class="score ">
                <IconSpan icon="leaderboard" font-size="18px"></IconSpan>
            </div>
            <div class="score ">
                <IconSpan icon="skull" font-size="18px"></IconSpan>
            </div>
            <div v-if="!settings.hidePlayers" class="player-wrap"><span>Players</span></div>
            <div class="team-name"><span>Team</span></div>
        </div>
        <template v-for=" (team, index) in sortTeamsLive(liveData.teams).slice(0, 20)">
            <div v-if="shouldShow(index)" class="team-wrap" :class="{ dark: settings.dark }"
                :style="{ opacity: isAlive(team) ? 1 : .7 }" :key="team.teamId">
                <div class="index "><span>{{ index + 1 }} </span></div>
                <div class="score "><span>{{ getTeamScoreByLiveTeam(team) }}</span></div>
                <div class="score "><span>{{ team.kills }} </span></div>

                <div v-if="!settings.hidePlayers" class="player-wrap">
                    <div v-for="player in team" :key="player.nucleasHash" class="player-status"
                        :style="{ opacity: player.status == 'alive' ? .8 : .5 }">
                        <div class="player-status">
                            <img class="team-character" height="32" :src="'/legend_icons/' + player.character + '.webp'">
                        </div>
                        <div v-if="player.status == 'alive'" class="player-status prog-bar"
                            v-show="player.status == 'alive'"
                            :style="{ height: calcHeight(player.maxHealth + player.shieldMaxHealth, 2) }">
                            <div class="hb sheild"
                                :style="{ bottom: calcHeight(player.currentHealth), height: calcHeight(player.shieldHealth), backgroundColor: getShieldColor(player.shieldMaxHealth) }">
                            </div>
                            <div class="hb health" :style="{ height: calcHeight(player.currentHealth) }"></div>
                            <!-- <div class="hb sheild"
                        :style="{ height: (player.currentHealth + player.shieldHealth) / 8 + 'px', backgroundColor: getShieldColor(player.shieldMaxHealth) }"> -->

                            <!-- </div> -->
                        </div>
                        <div v-else class="player-status prog-bar" :style="{ opacity: 0 }"></div>
                    </div>
                </div>
                <div class="team-name"><span>{{ team.name }}</span> </div>

            </div>
        </template>
    </div>
</template>

<script>
import IconSpan from "@/components/IconSpan.vue";
import {
    getTeamScoreByStatsTeam,
    getTeamScoreByLiveTeam,
    getPlacementPoints,
    sortTeamsLive,
    sortTeamsStats,
    isAlive,
} from "@/utils/overlayUtils.js"


export default {
    props: ["stats", "liveData", "settings", "display"],
    components: {
        IconSpan,
    },
    data() {
        return {
            start: this.settings.static,
        }
    },
    watch: {
        settings() {
            if (!this.start)
                this.start = this.settings.static
        }
    },
    methods: {
        getShieldColor(health) {
            switch (health) {
                case 50:
                    return "#ddd";
                case 75:
                    return "#14f";
                case 100:
                    return "#c1f";
                case 125:
                    return "#f11";

            }
        },
        shouldShow(index) {
            return (index < (this.settings.static ?? 20) || index >= this.start && index < this.start + this.settings.rotate)
        },
        calcHeight(health, add = 0) {
            return ((health / 7.6) + add) + "px";
        },
        rotate() {
            this.start += this.settings.rotate;

            if (this.start >= this.liveData?.totalTeams) {
                this.start = this.settings.static;
            }
        },
        getTeamScoreByStatsTeam,
        getTeamScoreByLiveTeam,
        getPlacementPoints,
        sortTeamsLive,
        sortTeamsStats,
        isAlive,
    },
    mounted() {
        this.int = setInterval(() => this.rotate(), 7000);
    },
    destroyed() {
        clearInterval(this.int);
    }
}
</script>

<style scoped lang="scss"> .wrap {
     color: white;
     text-align: right;
     display: block;
     width: 400px;
 }


 .team-wrap {
     height: 30px;
     //  width: 375px;
     font-size: 16px;
     display: flex;
     align-items: center;
     margin-bottom: 1px;
     overflow: hidden;
     /* justify-content: end; */
 }

 .index {
     height: 30px;
     display: flex;
     align-items: center;
     width: 38px;

     span {
         flex: 1;
         text-align: center;
     }
 }




 .score {
     width: 38px;
     height: 30px;
     display: flex;
     align-items: center;
     margin-left: 1px;

     span {
         flex: 1;
         text-align: center;
     }
 }


 .sub {
     font-size: 8px;
 }

 .team-name {
     display: flex;
     align-items: center;
     height: 30px;
     width: 150px;
     margin-left: 1px;

     span {
         padding-top: 3px;
         padding-left: 5px;
     }
 }


 .prog-bar {
     border: 1px solid #fff8;
     width: 7px;
     display: flex;
     position: relative;
     align-self: end;
 }

 .hb {
     position: absolute;
     left: 0;
     bottom: 0;
     background-color: blue;
     width: 5px;
 }

 .health {
     background-color: darkred;
 }

 .player-status {
     display: flex;
     align-items: center;
     margin-left: 0px;
     padding-left: 2px;
 }


 .player-wrap {
     margin-left: 1px;
     display: flex;
     width: 132px;
     height: 30px;

     span {
         padding-left: 5px;
         align-self: center;
         text-align: left;
         flex: 1;
     }
 }

 .styled {
     .index {
         background-color: v-bind("display?.colors?.primary");
         color: v-bind("display?.colors?.primaryText");
     }

     .team-wrap {}

     &.wrap {
         background: #000000aa;
     }

     .score {
         background-color: v-bind("display?.colors?.secondary");
         color: v-bind("display?.colors?.text");
     }

     .player-wrap {
         background-color: v-bind("display?.colors?.secondary");
         color: v-bind("display?.colors?.text");

     }

     .team-name {
         background-color: v-bind("display?.colors?.secondary");
         color: v-bind("display?.colors?.text");

     }
 }


 .dark {
     &.team-wrap {
         color: black;
     }
 }
</style>