<template>
    <v-app>
        <div class="public-wrapper">
            <NavBar></NavBar>
            <div class="page-header">
                <div class="page-title">{{ player.names[0] }}</div>
            </div>
            <v-container>
                <div class="page-wrap">
                    <div class="page-nav">
                        <div class="link-container">
                            <router-link class="nav-link"
                                :to="{ name: 'player.overview', params: $props }">Overview</router-link>
                            <router-link class="nav-link"
                                :to="{ name: 'player.matches', params: $props }">Matches</router-link>
                        </div>
                    </div>
                    <div class="content-wrap">
                        <router-view :playerId="parsedId" :player="player" />
                    </div>
                </div>

            </v-container>

        </div>
    </v-app>
</template>
<script>
// import Pagnation from '../components/Pagnation.vue';
import NavBar from "../components/NavBar.vue";

export default {
    components: {
        // Pagnation,
        NavBar
    },
    props: ["id"],
    data() {
        return {
            player: {}
        }
    },
    methods: {
        async updatePlayer() {
            this.player = await this.$apex.getPlayer(this.parsedId);
        }
    },
    computed: {
        parsedId() {
            return this.id.split(".")[0];
        }
    },
    watch: {
        parsedId() {
            this.updatePlayer();
        }
    },
    async mounted() {
        await this.updatePlayer()
    }

}
</script>

<style lang="scss">

</style>