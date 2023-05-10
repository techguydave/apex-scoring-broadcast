<template>
    <span class="regen">
        <img v-show="loaded" class="icon pa-4"  :height="height"
            :src="`/regen_icons/${icon}.svg`" @load="loaded = true" />
        <span class="pa-2 white--text" v-if="!loaded">[{{ icon }}]</span>
    </span>
</template>

<script>
export default {
    props: ["icon", "height", "left", "top"],
    data() {
        return {
            loaded: false,
        }
    }
}
</script>

<style scoped>
.white-svg {
    filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(146deg) brightness(105%) contrast(101%);
}

</style>