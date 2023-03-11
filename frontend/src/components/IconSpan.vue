<template>
    <span class="material-symbols-outlined" :style="{ fontSize: fontSize }">{{ icon }}</span>
</template>
<script>
export default {
    props: ["icon", "fontSize"]
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