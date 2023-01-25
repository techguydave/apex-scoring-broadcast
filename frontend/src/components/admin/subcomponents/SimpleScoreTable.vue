<template>
    <div>
        <v-simple-table dense>
            <template v-slot:default>
                <thead>
                    <tr>
                        <th class="text-left">
                            Team
                        </th>

                        <th class="text-left">
                            Score
                        </th>
                        <th class="text-left">
                            Kills
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(team, index) in sortedTeams" :key="team.teamId">
                        <td>
                            <div><span class="index">{{ index + 1 }}.</span> {{ team.name }}</div>

                        </td>
                        <td>{{ team.overall_stats.score }}</td>
                        <td>{{ team.overall_stats.kills }}</td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
    </div>
</template>

<script>
export default {
    props: ['stats'],
    computed: {
        sortedTeams() {
            if (this.stats && this.stats.teams)
                return JSON.parse(JSON.stringify(this.stats.teams)).sort((a, b) => b.overall_stats.score - a.overall_stats.score);
            return []
        }
    }
}
</script>

<style scoped>
.index {
    width: 20px;
    text-align: right;
}
</style>