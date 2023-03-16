<template>
    <div class="wrap" :class="{ styled: settings.styled }">
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
            <div class="player-wrap"><span>Players</span></div>
            <div class="team-name"><span>Team</span></div>
        </div>
        <div class="team-wrap" :class="{ dark: settings.dark }" :style="{ opacity: isAlive(team) ? 1 : .7 }"
            v-for=" (team, index) in sortTeams(liveData.teams).slice(0, 20)" :key="team.teamId">
            <div class="index "><span>{{ index + 1 }} </span></div>
            <div class="score "><span>{{ getTeamScore(team) }}</span></div>
            <div class="score "><span>{{ team.kills }} </span></div>

            <div class="player-wrap">
                <div v-for="player in team" :key="player.nucleasHash" class="player-status"
                    :style="{ opacity: player.status == 'alive' ? .8 : .5 }">
                    <div class="player-status">
                        <img class="team-character" height="32" :src="'/legend_icons/' + player.character + '.webp'">
                    </div>
                    <div v-if="player.status == 'alive'" class="player-status prog-bar" v-show="player.status == 'alive'"
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

    </div>
</template>

<script>
import IconSpan from "@/components/IconSpan.vue";
import {
    getTeamScore,
    getPlacementPoints,
    sortTeams,
    isAlive,
} from "@/utils/overlayUtils.js"


export default {
    props: ["stats", "liveData", "settings"],
    components: {
        IconSpan,
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

        calcHeight(health, add = 0) {
            return ((health / 7.6) + add) + "px";
        },
        getTeamScore,
        getPlacementPoints,
        sortTeams,
        isAlive,
    }
}
</script>

<style scoped lang="scss"> .wrap {
     color: white;
     text-align: right;
     display: block;
     width: 400px;
     transform: translate(1500px, 300px);
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
         background-color: $primary;
     }

     .team-wrap {}

     &.wrap {
         background: #000000aa;
     }

     .score {
         background-color: $second-tone;

     }

     .player-wrap {
         background-color: $second-tone;

     }

     .team-name {
         background-color: $second-tone;

     }
 }


 .dark {
     &.team-wrap {
         color: black;
     }
 }
</style>