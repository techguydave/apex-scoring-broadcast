<template>
    <div class="chart-wrapper">
        <div v-if="stats && stats.games">
            <component :is="chartType" :options="chartOptions" :data="{ labels, datasets }"></component>
        </div>
    </div>
</template>

<script>
import { Bar, Line } from 'vue-chartjs'
import colors from "@/utils/colors";
import _ from "lodash";


import 'chart.js/auto'

export default {
    components: {
        Bar,
        // eslint-disable-next-line vue/no-reserved-component-names
        Line
    },
    props: ["stats"],
    data() {
        return {
            chartType: Bar,
            chartOptions: {
                color: "#ffffff",
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true
                    }
                }
            }
        }
    },
    computed: {
        labels() {
            return this.stats.games.map((_, index) => `Game ${index + 1}`);
        },
        datasets() {
            if (this.stats && this.stats.games) {
                let gamesByTeam = this.stats.games.map(game => _(game.teams).keyBy("teamId").value());
                let teams = _(this.stats.teams).map(team => ({ id: `${team.teamId}`, name: team.name })).sortBy(team => parseInt(team.id)).value();

                return teams.map(team => ({
                    id: team.id,
                    label: team.name,
                    borderColor: colors[`${team.id}`],
                    backgroundColor: colors[`${team.id}`],
                    borderSize: 2,
                    data: _(gamesByTeam).map(game => game[`${team.id}`].overall_stats.score).value()
                }))
            } else {
                return []
            }
        }
    }
}
</script>
