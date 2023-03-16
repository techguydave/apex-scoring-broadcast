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
                        <td v-if="editing == team.teamId">
                            <v-text-field v-model="score"></v-text-field><v-btn color="primary"
                                @click="editing = undefined; $emit('edit', { teamId: team.teamId, gameId: stats.id, score })">Update</v-btn>
                        </td>
                        <td v-else>{{ team.overall_stats.score }} <IconBtnFilled v-if="stats.id"
                                @click="score = team.overall_stats.score; editing = team.teamId" icon="edit"
                                font-size="14px">
                            </IconBtnFilled>
                        </td>
                        <td>{{ team.overall_stats.kills }}</td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
    </div>
</template>

<script>
import IconBtnFilled from "./IconBtnFilled.vue";

export default {
    props: ['stats'],
    components: {
        IconBtnFilled,
    },
    data() {
        return {
            editing: undefined,
            score: 0,
        }
    },
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