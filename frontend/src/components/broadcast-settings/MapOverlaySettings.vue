@<template>
    <div>
        <v-checkbox label="Show Map" v-model="settings.showMap"></v-checkbox>
        <v-checkbox label="Show Drops" v-model="settings.showDrops"></v-checkbox>
        <v-select :items="mappedMaps" v-model="settings.selectedMap"></v-select>
        <div><i>Hint: Turn off map to display drops over ingame map.</i></div>
    </div>
</template>

<script>
import { maps } from "@/utils/maps";

export default {
    props: ["value"],
    data() {
        return {
            settings: this.value.settings,
        }
    },
    methods: {
        update() {
            this.$emit('input', { ...this.value, settings: this.settings })
        }
    },
    computed: {
        mappedMaps() {
            return Object.keys(maps).map(map => ({ value: maps[map], text: map }));
        }
    }
}
</script>

<style scoped></style>