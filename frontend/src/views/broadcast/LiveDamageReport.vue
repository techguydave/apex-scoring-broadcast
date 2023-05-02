<template>
    <div class="wrap" :class="{ styled: settings.styled }">
       
    </div>
</template>

<script>
import colors from "@/utils/colors";
export default {
    props: ["liveData", "settings", "display", "observer", "observerTeam"],
    data() {
        return {
            colors,
            lastFeedIdx: 0,
            recentDamageFeed: [],
        };
    },
    computed: {
        feed() {
            return this.liveData?.feed;
        }
    },
    watch: {
        liveDamage() {
            this.lastFeedIdx = this.liveData.feed.length;
        },
        feed() {
            if(this.feed.length > this.lastFeedIdx)
                this.update();
        }
    },
    methods: {
        update() {  
            if (this.liveData) {
                let newFeed = this.liveData.feed.slice(this.lastFeedIdx);
                console.log(JSON.stringify(newFeed));
                console.log(JSON.stringify(this.observer))
                newFeed.forEach(feed => {
                    this.recentDamageFeed.find(f => f.name == feed.name)
                })
            }
        }
    },
    mounted() {
        setTimeout(() => this.update(), 1000);
    }
}
</script>

<style scoped lang="scss">
.styled {
    .player {
        background-color: v-bind("display?.colors?.secondary");
        color: v-bind("display?.colors?.text");
    }

    .header {
        background: v-bind("display?.colors?.primary");
        color: v-bind("display?.colors?.primaryText")
    }
}
</style>