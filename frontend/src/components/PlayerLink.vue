<template>
    <router-link :to="{ name: 'player', params: { id: linkId } }">
        <slot></slot>
    </router-link>
</template>
<script>
export default {
    props: ["player"],
    computed: {
        linkId() {
            if (this.player.name) {
                return this.player.playerId + "." + this.player.name
            } else {
                return this.player.playerId;
            }
        }
    }
}
</script>
