<template>
    <div>
        <v-checkbox label="Styled" v-model="settings.styled"></v-checkbox>
        <v-checkbox label="Dark" v-model="settings.dark"></v-checkbox>
        <v-checkbox label="Smooth" v-model="settings.smooth"></v-checkbox>
        <template v-if="settings.smooth">
            <v-slider v-model="settings.speed" label="Speed" :max="29" :min="1"></v-slider>
        </template>
    </div>
</template>

<script>
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
    }
}
</script>

<style scoped></style>