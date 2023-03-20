<template>
    <div class="page-wrap content-wrap pa-2">
        <v-row>
            <v-col cols="12" md="4" lg="3">
                <v-card color="secondary">
                    <v-card-title>Other Names</v-card-title>
                    <v-card-text>
                        <div class="text-center" v-for="name in player.names" :key="name">
                            {{ name }}
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="4" lg="3">
                <v-card color="secondary">
                    <v-card-title>Top Characters</v-card-title>
                    <v-card-text>
                        <div class="text-center" v-for="char in player.characters.slice(0, 2)" :key="char.character">
                            {{ char.character }}
                            {{ char.count }}
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="4" lg="3">
                <v-card color="secondary">
                    <v-card-title>Total Games</v-card-title>
                    <v-card-text class="text-center title">
                        {{ player.sums.totalGames }}
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="4" lg="3">
                <v-card color="secondary">
                    <v-card-title>Kills</v-card-title>
                    <v-card-text class="text-center title">
                        {{ player.sums.kills }}
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="4" lg="3">
                <v-card color="secondary">
                    <v-card-title>Damage</v-card-title>
                    <v-card-text class="text-center title">
                        {{ player.sums.damageDealt }}
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="4" lg="3">
                <v-card color="secondary">
                    <v-card-title>Assists</v-card-title>
                    <v-card-text class="text-center title">
                        {{ player.sums.assists }}
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    props: ["player"]
}
</script>