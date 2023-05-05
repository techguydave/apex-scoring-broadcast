<template>
    <div class="wrap" :class="{ styled: settings.styled }">
        <v-row>
            <v-col cols="3" v-for="team in liveData.teams" :key="team.id">
                <div class="cont">
                    <div class="header">{{ team.name }}</div>
                    <div class="color" :style="{ background: colors[team.teamId] }"></div>
                    <div class="player" v-for=" player in team" :key="player.name">

                        <span class="character"><img v-if="player.characterSelected" class="team-character" height="40"
                                :src="'/legend_icons/' + player.character + '.webp'"></span>
                        <span>{{ player.name }}</span>
                    </div>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import colors from "@/utils/colors";
export default {
    props: ["liveData", "settings", "display"],
    data() {
        return { colors };
    }
}
</script>

<style scoped lang="scss">
.wrap {
    margin: auto;

    margin-top: 70px;
    width: 1400px;
}

.cont {
    width: 300px;
    color: white;
    margin: auto;
}

.character {
    width: 40px;
}

.header {
    width: 300px;
    text-align: center;
    height: 30px;

    line-height: 30px;
    font-weight: bold;

}

.color {
    height: 5px;
    margin: 5px 0;
}

.player {
    height: 40px;
    margin: 3px 0;
    display: flex;
    align-items: center;


    span {
        margin-left: 5px;
        font-size: 16px;
    }
}

.styled {
    .player {
        background-color: v-bind("display?.colors?.secondary");
        color: v-bind("display?.colors?.text");
    }

    .header {
        background: v-bind("display?.colors?.primary");
        color: v-bind("display?.colors?.primaryText")
    }
}
</style>