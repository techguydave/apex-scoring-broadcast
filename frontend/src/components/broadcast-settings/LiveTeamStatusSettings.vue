<template>
    <div>
        <v-checkbox label="Styled" v-model="settings.styled"></v-checkbox>
        <v-checkbox label="Dark" v-model="settings.dark"></v-checkbox>
        <v-btn color="primary" @click="update()">Update</v-btn>

    </div>
</template>

<script>
export default {
    props: ["value"],
    data() {
        return {
            settings: this.value,
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