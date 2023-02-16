<template>
    <v-card @click="$emit('click')" outlined class="ma-3 pointer" :class="{selected}">
        <v-card-title>
            {{getMapName(game.map_name)}}
        </v-card-title>
        <v-card-subtitle>
            {{new Date(game.match_start * 1000)}}
        </v-card-subtitle>
        <v-card-text>
            <v-row>
                <v-col class="ma-0" v-for="team in game.teams.slice(0, 6)" :key="team.name" sm="2">
                    {{team.overall_stats.teamPlacement}}: {{team.name}}
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { getMapName } from '../../../utils/statsUtils';

export default {
    props: ["game", "selected"],
    methods: {getMapName}
}
</script>

<style>
.v-card.selected {
    border-color: #000!important;
    background-color: rgba(3, 193, 251, 0.5)!important;
}

.pointer {
    cursor: pointer;
}
</style>