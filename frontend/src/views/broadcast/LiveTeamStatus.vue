<template>
    <div class="wrap">
        <div class="team-wrap" v-for="(team, index) in sortTeams(liveData.teams)" :key="team[0].teamId">
            <div class="index ">{{ index + 1 }}. </div>
            <div class="score ">{{ getTeamScore(team) }}

            </div>
            <div v-for="player in team" :key="player.nucleasHash" class="player-status">
                <div class="player-status"><img class="team-character" height="25"
                        :src="'/legend_icons/' + player.character + '.webp'"></div>
                <div v-if="player.status == 'alive'" class="player-status prog-bar"
                    :style="{ height: (player.maxHealth + player.shieldMaxHealth) / 8 + 2 + 'px' }">
                    <div class="hb sheild"
                        :style="{ bottom: player.currentHealth / 8 + 'px', height: player.shieldHealth / 8 + 'px', backgroundColor: getShieldColor(player.shieldMaxHealth) }">
                    </div>
                    <div class="hb health" :style="{ height: player.currentHealth / 8 + 'px' }"></div>
                    <!-- <div class="hb sheild"
                        :style="{ height: (player.currentHealth + player.shieldHealth) / 8 + 'px', backgroundColor: getShieldColor(player.shieldMaxHealth) }"> -->

                    <!-- </div> -->
                </div>
                <div v-else class="player-status prog-bar"></div>

            </div>
            <div class="team-name">{{ team.name }} ({{ team.kills }}) </div>

        </div>

    </div>
</template>

<script>
import IconSpan from "@/components/IconSpan.vue";

export default {
    props: ["stats", "liveData"],
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
        getTeamScore(team) {
            if (this.stats?.teams) {
                let teamId = team[0].teamId;
                let statsTeam = this.stats.teams.find(team => team.teamId == teamId);
                return statsTeam.overall_stats.score;
            }
        },
        sortTeams(teams) {
            return Object.values(teams).sort((a, b) => this.getTeamScore(b) - this.getTeamScore(a));
        }
    }
}
</script>

<style scoped> .wrap {
     color: white;
     text-align: right;
     display: block;
     width: 350px;
     /* transform: translate(1550px, 270px); */
     background: #000000dd;
     box-shadow: 0 0 60px #000000dd;
 }

 .team-wrap {
     height: 30px;
     width: 400px;
     font-size: 16px;
     display: flex;
     align-items: center;
     /* justify-content: end; */
 }

 .team-name {
     padding-left: 5px;
 }

 .score {
     padding: 0 5px;
     width: 35px;
 }

 .index {
     width: 25px;
 }

 .sub {
     font-size: 8px;
 }

 .team-name {
     display: flex;
     line-height: 30px;
     height: 30px;
 }


 .prog-bar {
     border: 1px solid rgba(255, 255, 255, .6);
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
     display: inline-block;
 }
</style>