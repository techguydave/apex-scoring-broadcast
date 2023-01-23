<template>
    <div>
        <div v-if="game == 'overall'" class="overall text-center"><i>Please choose a game</i></div>
        <template v-if="liveData">
            <v-virtual-scroll :items="liveData.feed" height="600" item-height="45">
                <template #default="{ item }">
                    <FeedCard :feed="item" :startTime="liveData.match_start"></FeedCard>
                </template>
            </v-virtual-scroll>
        </template>
    </div>
</template>


<script>
import FeedCard from "./subcomponents/FeedCard.vue";

export default {
    data() {
        return {
            liveData: undefined,
        }
    },
    components: { FeedCard },
    props: ["organizer", "eventId", "game"],
    methods: {
        async getLiveData() {
            this.liveData = await this.$apex.getLiveData(this.organizer, this.eventId, this.game);
            console.log(this.liveData.match_start)
        }
    },
    mounted() {
        this.getLiveData();
    }
}
</script>

<style scoped>
.feed-wrap {
    max-height: 60vh;
    overflow: auto;
}
</style>