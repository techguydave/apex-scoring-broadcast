<template>
    <div v-if="stats && stats.teams">
        <v-data-table class="standing-table" :items-per-page="-1" hide-default-footer :headers="headers"
            :items="playerStats" dense>
            <template v-slot:item.no="{ index }">{{ index + 1}}</template>
        </v-data-table>
    </div>
</template>

<script>
import { displayOptions, getDisplayName, getStatsByMode } from '@/utils/statsUtils';
export default {
    props: ["stats"],
    data() {
        return {
        }
    },
    computed: {
        headers() {
            return [
                {
                    text: "#",
                    value: "no",
                },
                {
                    text: "Player",
                    value: "name",
                },
                ...displayOptions.display.player.map(o => ({
                    text: getDisplayName(o),
                    value: o,
                }))]
        },
        playerStats() {
            let stats = getStatsByMode(this.stats.teams, "player");
            return stats;
        }
    }
}
</script>

<style>
.standing-table th {
    white-space: nowrap;
    padding: 0 8px !important;
}

.standing-table td {
    padding: 0 8px !important;
}
</style>