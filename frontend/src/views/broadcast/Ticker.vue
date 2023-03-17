<template>
    <div class="wrap" v-if="stats.teams" :class="{ styled: settings.styled, dark: settings.dark }"
        :style="`transform: translate(${calcTrans}, 0)`">
        <div class="team"
            v-for="(team, index) in [...sortTeamsStats(stats.teams), ...sortTeamsStats(stats.teams).slice(0, 5)]"
            :key="team.name + ':' + index">
            <div class="index">{{ (index >= stats.teams.length ? index - stats.teams.length : index) + 1 }}</div>
            <div class="score">{{ getTeamScoreByStatsTeam(team) }}</div>
            <div class="name"><span>{{ team.name }}</span></div>
        </div>
    </div>
</template>

<script>
import {
    getTeamScoreByStatsTeam,
    getTeamScoreByLiveTeam,
    getPlacementPoints,
    sortTeamsLive,
    sortTeamsStats,
    isAlive,
} from "@/utils/overlayUtils.js"

const timer = 5000;

export default {
    props: ["stats", "liveData", "settings"],
    data() {
        return {
            rotated: 0,
            smoothed: 0,
            alive: true,
            timer: Date.now(),
        }
    },
    computed: {
        calcTrans() {
            if (this.settings.smooth) {
                return `${-this.smoothed}px`;
            } else {
                return `${-this.rotated * 1920}px`;
            }
        }
    },
    methods: {
        getTeamScoreByStatsTeam,
        getTeamScoreByLiveTeam,
        getPlacementPoints,
        sortTeamsLive,
        sortTeamsStats,
        isAlive,
        rotate() {
            this.rotated++;
            if (this.rotated >= (this.stats.teams.length / 5))
                this.rotated = 0;
        },
        rotateSmooth() {
            let diff = Date.now() - this.timer;

            this.smoothed = (diff / (30 - (this.settings?.speed ?? 15))) % ((this.stats?.teams?.length / 5) * 1920);
            // if (this.smoothed >= (this.stats?.teams?.length / 5) * 1920)
            //     this.smoothed = 0;
            // this.timer = Date.now();
            if (this.alive) requestAnimationFrame(() => this.rotateSmooth());
        }
    },
    mounted() {
        this.inter = setInterval(() => this.rotate(), timer);
        this.alive = true;
        this.rotateSmooth()
    },
    destroyed() {
        clearInterval(this.inter);
        this.alive = false;
    }
}
</script>
<style lang="scss" scoped>
.wrap {
    color: white;
    display: flex;
    font-size: 25px;
    position: absolute;
    top: 0;
    left: 0;
}

.team {
    display: flex;
}

.index {
    width: 50px;
    text-align: center;
    background-color: $primary;
}

.score {
    width: 50px;
    text-align: center;
    margin-left: 1px;
}

.name {
    width: 282px;
    margin-left: 1px;
    padding-left: 10px;
    font-size: 18px;
    display: flex;
    align-items: center;
}

.styled {
    &.wrap {}

    .score {
        background-color: $second-tone;
    }

    .name {
        background-color: $second-tone;
    }
}

.dark {
    &.wrap {
        color: black;
    }
}
</style>