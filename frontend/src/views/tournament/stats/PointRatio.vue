<template>
    <div class="chart-wrapper">
        <div v-if="stats && stats.games">
            <v-btn block text @click="stacked = !stacked">{{ stacked? 'Seperate Axis': 'Stacked' }}</v-btn>
            <component :is="chartType" :options="chartOptions" :data="{ labels, datasets }"></component>
        </div>
    </div>
</template>

<script>
import { Bar, Line } from 'vue-chartjs'
// import colors from "@/utils/colors";
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
            selectedOption: 0,
            stacked: true,
        }
    },
    computed: {
        labels() {
            return this.stats.teams.map(team => team.name);
        },
        chartOptions() {
            return {
                responsive: true,
                color: "#ffffff",
                scales: {
                    x: {
                        ticks: {
                            color: "#ffffff",
                        },
                        stacked: true,
                    },
                    y: {
                        ticks: {
                            color: "#ffffff",
                        },
                        stacked: true
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => (`${tooltipItem.dataset.label}: ${Math.abs(tooltipItem.formattedValue)}`)
                        }
                    }
                },
            };
        },
        datasets() {
            if (this.stats && this.stats.teams) {
                console.log([this.stats.teams.map(team => ({ data: [team.overall_stats.score] })), this.stats.teams.map(team => ({ data: [team.overall_stats.score] }))])

                return [{
                    label: "Placement",
                    data: this.stats.teams.map(team => ((team.overall_stats.score - team.overall_stats.kills) * (this.stacked ? 1 : -1)))
                }, {
                    label: "Kills",
                    data: this.stats.teams.map(team => team.overall_stats.kills),
                }]
            } else {
                return []
            }
        }
    },

}
</script>
