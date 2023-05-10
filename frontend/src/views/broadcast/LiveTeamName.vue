<template>
    <div v-if="observerTeam" class="wrap">
        <div class="team-wrap label" :class="{ dark: settings.dark }">
            <div class="index ">
                <IconSpan icon="tag" font-size="18px"></IconSpan>
            </div>
            <div class="team-name"><span></span> </div>

            <div class="score ">
                <IconSpan icon="leaderboard" font-size="18px"></IconSpan>
            </div>
            <div class="score ">
                <IconSpan icon="skull" font-size="18px"></IconSpan>
            </div>

        </div>
        <div :class="{ styled: settings.styled }">
            <div class="team-wrap">
                <div class="index "><span>{{ teamIndex }}</span></div>
                <div class="team-name"><span>{{ observerTeam.name }}</span> </div>
                <div class="score "><span>{{ getTeamScoreByLiveTeam(observerTeam) }}</span></div>
                <div class="score "><span>{{ observerTeam.kills }} </span></div>
            </div>
        </div>
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
    props: ["stats", "liveData", "settings", "display", "observerTeam"],
    components: {
        IconSpan,
    },
    data() {
        return {

        };
    },
    computed: {
        teamIndex() {
            let sorted = (this.liveData?.teams) ? this.sortTeamsLive(this.liveData.teams) : this.sortTeamsStats(this.stats.teams);
            return sorted.findIndex(team => team.name == this.observerTeam?.name) + 1;
        }
    },
    methods: {
        getTeamScoreByStatsTeam,
        getTeamScoreByLiveTeam,
        getPlacementPoints,
        sortTeamsLive,
        sortTeamsStats,
        isAlive,
    }
}
</script>

<style scoped lang="scss">
.wrap {
    position: absolute;
    left: 43px;
    bottom: 310px;
}

.team-wrap {
    height: 50px;
    //  width: 375px;
    font-size: 23px;
    display: flex;
    align-items: center;
    margin-bottom: 1px;
    white-space: nowrap;
    overflow: hidden;
    /* justify-content: end; */
}

.label div {
    align-items: end;
    color: v-bind("display?.colors?.secondaryText");
}

.index {
    height: 50px;
    display: flex;
    align-items: center;
    width: 50px;

    span {
        flex: 1;
        text-align: center;
    }
}

.score {
    width: 50px;
    height: 50px;
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
    height: 50px;
    min-width: 200px;
    padding: 0 10px;
    margin-left: 1px;

    span {
        padding-top: 3px;
        padding-left: 5px;
    }
}



.styled {
    .index {
        background-color: v-bind("display?.colors?.primary");
        color: v-bind("display?.colors?.primaryText");
    }

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
</style>