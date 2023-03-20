<template>
    <v-btn icon @click.stop="() => $emit('click')">
        <span class="material-symbols-outlined" :style="{ fontSize: fontSize || '24px' }">{{ icon }}</span>
    </v-btn>
</template>
<script>
export default {
    props: ["icon", "fontSize"]
}
</script>

<style scoped>
.material-symbols-outlined {
    font-variation-settings:
        'FILL' 1,
        'wght' 500,
        'GRAD' 0,
        'opsz' 40
}
</style>