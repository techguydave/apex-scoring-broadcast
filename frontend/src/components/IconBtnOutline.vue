<template>
    <v-btn icon @click.stop="() => $emit('click')">
        <span class="material-symbols-outlined">{{ icon }}</span>
    </v-btn>
</template>
<script>
export default {
    props: ["icon"]
}
</script>

<style scoped>
.material-symbols-outlined {
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 48
}
</style>