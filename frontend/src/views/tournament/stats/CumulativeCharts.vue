<template>
    <div class="chart-wrapper">
        <div v-if="stats && stats.games">
            <v-select v-model="selectedOption"
                :items="options.map((o, index) => ({ text: o.name, value: index }))"></v-select>
            <component :is="chartType" :options="chartOptions" :data="{ labels, datasets }"></component>
        </div>
    </div>
</template>

<script>
import { Bar, Line } from 'vue-chartjs'
import colors from "@/utils/colors";
import _ from "lodash";
import 'chart.js/auto'

const options = [
    {
        name: "Position",
        func: (stats, team, index) => _.findIndex(stats.stacked[index], { teamId: team.id }) + 1,
        chartOptions: {
            scales: {
                y: {
                    reverse: true,
                    min: 1,
                    max: 20,
                    title: {
                        text: "Position",
                        display: true,
                    },
                    ticks: {
                        color: "#ffffff",
                    },
                },
                x: {
                    ticks: {
                        color: "#ffffff",
                    },
                }
            }
        }
    },
    {
        name: "Kills",
        func: (stats, team, index) => _.find(stats.stacked[index], { teamId: team.id }).overall_stats.kills,
        chartOptions: {
            scales: {
                y: {
                    title: {
                        text: "Kills",
                        display: true,
                    },
                    ticks: {
                        color: "#ffffff",
                    },
                },
                x: {
                    ticks: {
                        color: "#ffffff",
                    },
                }
            }
        }
    },
    {
        name: "Score",
        func: (stats, team, index) => _.find(stats.stacked[index], { teamId: team.id }).overall_stats.score,
        chartOptions: {
            scales: {
                y: {
                    title: {
                        text: "Score",
                        display: true,
                    },
                    ticks: {
                        color: "#ffffff",
                    },
                },
                x: {
                    ticks: {
                        color: "#ffffff",
                    },
                }
            }
        }
    }
]


export default {
    components: {
        Bar,
        // eslint-disable-next-line vue/no-reserved-component-names
        Line
    },
    props: ["stats"],
    data() {
        return {
            chartType: Line,
            options,
            selectedOption: 0,
        }
    },
    computed: {
        selectedOptionValue() {
            return options[this.selectedOption];
        },
        labels() {
            return this.stats.games.map((_, index) => `Game ${index + 1}`);
        },
        chartOptions() {
            return this.selectedOptionValue.chartOptions;
        },
        datasets() {
            if (this.stats && this.stats.games) {
                let teams = this.stats.teams.map(team => ({ id: `${team.teamId}`, name: team.name }));

                return teams.map(team => ({
                    id: team.id,
                    label: team.name,
                    borderColor: colors[`${team.id}`],
                    backgroundColor: colors[`${team.id}`],
                    data: _(new Array(this.stats.total)).map((d, index) => this.selectedOptionValue.func(this.stats, team, index)).value()
                }))
            } else {
                return []
            }
        }
    }
}
</script>
