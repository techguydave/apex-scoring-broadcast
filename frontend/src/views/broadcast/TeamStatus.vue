<template>
    <div class="d">
        <div class="team-wrap" v-for="team in liveData.teams" :key="team[0].teamId">
            <div class="team-name">{{ team[0].teamName }} ({{ team.reduce((k, c) => k + c.kills, 0) }}) </div>
            <div v-for="player in team" :key="player.nucleasHash" class="player-status">
                <div class="player-status"><img class="team-character" height="25"
                        :src="'/legend_icons/' + player.character + '.webp'"></div>
                {{ player.name }}
                <div v-if="player.status == 'alive'" class="player-status prog-bar"
                    :style="{ height: (player.maxHealth + player.shieldMaxHealth) / 8 + 'px' }">
                    <div class="hb sheild"
                        :style="{ bottom: player.currentHealth / 8 + 'px', height: player.shieldHealth / 8 + 'px', backgroundColor: getShieldColor(player.shieldMaxHealth) }">
                    </div>
                    <div class="hb health" :style="{ height: player.currentHealth / 8 + 'px' }"></div>

                </div>
            </div>
        </div>
        <div v-for="line in liveData.feed.slice(liveData.feed.length - 10, liveData.feed.length - 1).reverse()" :key="line">
            <FeedCard :feed="line" :startTime="liveData.match_start"></FeedCard>
        </div>
    </div>
</template>

<script>
import FeedCard from "../tournament/standings/subcomponents/FeedCard.vue";
export default {
    components: { FeedCard },
    props: ["liveData"],
    methods: {
        getShieldColor(health) {
            switch (health) {
                case 50:
                    return "grey";
                case 75:
                    return "blue";
                case 100:
                    return "purple";
                case 125:
                    return "red";

            }
        }
    }
}
</script>

<style scoped> .d {
     color: white;
     width: 400px;
     text-align: right;
 }

 .team-wrap {
     height: 30px;
     width: 400px;
 }

 .team-name {
     display: inline-block;
     line-height: 30px;
     height: 30px;
 }

 .prog-bar {
     background-color: white;
     width: 5px;
     position: relative;
     display: inline-block;
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

 .sheild {
     background-color: blue;
 }
</style>