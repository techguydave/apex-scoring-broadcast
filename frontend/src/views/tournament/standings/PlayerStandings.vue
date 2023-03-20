<template>
    <div v-if="stats && stats.teams">
        <v-data-table class="standing-table" :items-per-page="-1" hide-default-footer :headers="headers"
            :items="playerStats" dense>
            <template v-slot:item.no="{ index }">{{ index + 1 }}</template>
            <template v-slot:item.name="{ item }">
                <PlayerLink :player="item">{{ item.name }}</PlayerLink>
            </template>

        </v-data-table>
</div>
</template>

<script>
import { displayOptions, getDisplayName, getStatsByMode } from '@/utils/statsUtils';
import PlayerLink from '@/components/PlayerLink.vue';
export default {
    props: ["stats"],
    data() {
        return {};
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
                }))
            ];
        },
        playerStats() {
            let stats = getStatsByMode(this.stats.teams, "player", this.stats);
            return stats;
        }
    },
    components: { PlayerLink }
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