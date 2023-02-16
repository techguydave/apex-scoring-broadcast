<template>
    <div class="chart-wrapper">
        <div v-if="stats && stats.games">
            <v-btn block text @click="perGame = !perGame">{{ !perGame ? 'Group by game' : 'group by legend' }}</v-btn>
            <v-btn v-if=!perGame block text @click="combind = !combind">{{
                combind? 'Show Individual': 'Show Team'
            }}</v-btn>

            <component :is="chartType" :options="chartOptions" :data="data"></component>
        </div>
    </div>
</template>

<script>
import { Bar, Line } from 'vue-chartjs'
import { getMapNameShort } from "@/utils/statsUtils"

// import colors from "@/utils/colors";
import 'chart.js/auto'
import _ from "lodash";

const mapCharacters = (team, combind) => {
    let chars = team.player_stats.map(player => player.characterName);
    if (combind) {
        chars = [chars.sort().join(", ")]
    }
    return chars;
}

const perChar = (stats, combind) => {
    let totals = _(stats.games)
        .map(game => game.teams.map(team => mapCharacters(team, combind)))
        .flattenDeep()
        .countBy()
        .map((value, key) => ({ count: value, char: key }))
        .orderBy("count", "desc")
        .value();


    // label: `Game ${(index + 1)} (${getMapNameShort(game.map_name)})`,
    let games = stats.games.map(game => {
        return _(game.teams)
            .map(team => mapCharacters(team, combind))
            .flattenDeep()
            .countBy()
            .value()
    });

    let datasets = stats.games.map((game, index) => ({
        label: `Game ${(index + 1)} (${getMapNameShort(game.map_name)})`,
        data: totals.map(t => games[index][t.char])
    }));

    return {
        labels: totals.map(t => t.char),
        datasets,
    }
}

const perGame = (stats) => {
    let characters = _(stats.teams)
        .map(team => team.player_stats.map(player => player.characters))
        .flattenDeep()
        .uniq()
        .value();

    let played = stats.games.map(game => _(game.teams)
        .map(team => mapCharacters(team, false))
        .flattenDeep()
        .countBy()
        .value())

    let count = characters.map(char => ({ label: char, data: stats.games.map((g, index) => (played[index][char] || 0)) }))

    return {
        labels: stats.games.map((game, index) => `Game ${(index + 1)} (${getMapNameShort(game.map_name)})`),
        datasets: count
    }
}


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
            perGame: false,
            combind: false,
        }
    },
    computed: {

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
                    sort: {
                        enabled: true,
                    }
                }
            };
        },
        data() {
            if (this.stats && this.stats.teams) {
                return this.perGame ? perGame(this.stats, this.combind) : perChar(this.stats, this.combind);
            } else {
                return []
            }
        }
    },

}
</script>
