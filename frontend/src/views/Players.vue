<template>
    <v-app>
        <div class="public-wrapper">
            <NavBar></NavBar>
            <div class="page-header">
                <div class="page-title">Players</div>
            </div>
            <v-container>
                <div class="page-wrap content-wrap pa-2">
                    <v-text-field v-model="search" placeholder="search" outlined></v-text-field>
                    <Pagnation v-model="start" :count="count" :total="players.total"></Pagnation>

                    <router-link :to="{
                        name: 'player', params: { id: `${player.id}.${player.names[0]}` }
                    }" v-for="player in players.data" :key="player.id">
                        <div class="list-item ma-2 white--text">
                            {{ player.names[0] }}
                        </div>
                    </router-link>

                    <Pagnation v-model="start" :count="count" :total="players.total"></Pagnation>
                </div>
            </v-container>
        </div>
    </v-app>
</template>
<script>
import Pagnation from '../components/Pagnation.vue';
import NavBar from "../components/NavBar.vue";
import _ from "lodash";

export default {
    components: {
        Pagnation,
        NavBar
    },
    data() {
        return {
            players: { total: 0 },
            start: 0,
            count: 25,
            search: "",
        }
    },
    methods: {
        updatePlayers: _.debounce(async function () {
            this.players = await this.$apex.getPlayers(this.start, this.count, this.search);
        }, 500)
    },
    watch: {
        start() {
            this.updatePlayers();
        },
        search() {
            this.updatePlayers();
        }
    },
    async mounted() {
        await this.updatePlayers()
    }

}
</script>

<style scoped lang="scss">
a {
    color: white;
    text-decoration: none;
}
</style>