<template>
    <div class="d">
        <v-row>
            <v-col cols="2" v-for="team in liveData.teams" :key="team">
                <table>
                    <th>
                    <td>{{ team[0].teamName }}</td>
                    </th>
                    <tr v-for="player in team" :key="player.name" height="40px">
                        <td>
                            <div><img class="team-character" height="20"
                                    :src="'/legend_icons/' + player.character + '.webp'">{{ player.name }} {{ player.kills
                                    }} - {{ player.currentWeapon }}</div>
                            <div v-if="player.status == 'alive'" class=" prog-bar"
                                :style="{ width: (player.maxHealth + player.shieldMaxHealth) + 'px' }">
                                <div class="hb health" :style="{ width: player.currentHealth + 'px' }"></div>
                                <div class="hb sheild"
                                    :style="{ left: player.currentHealth + 'px', width: player.shieldHealth + 'px', backgroundColor: getShieldColor(player.shieldMaxHealth) }">
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>


            </v-col>
        </v-row>

        <!-- <tr v-for="player in liveData.players" :key="player.name">
                                                                                                <td>{{ player.name }}: ({{ player.character }})</td>
                                                                                                <td>{{ player.status }}</td>
                                                                                                <td>{{ player.currentWeapon }}</td>
                                                                                                <td>{{ player.damageDealt }}</td>

                                                                                                <td>{{ player.kills }}</td>
                                                                                                <td>
                                                                                                   
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table> -->
    </div>
</template>

<script>
export default {
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
 }

 .prog-bar {
     background-color: white;
     height: 5px;
     display: inline-block;
 }

 .hb {
     position: relative;
     left: 0;
     top: 0;
     background-color: blue;
     height: 5px;
 }

 .health {
     background-color: darkred;
 }

 .sheild {
     background-color: blue;
     top: -5px;
 }
</style>